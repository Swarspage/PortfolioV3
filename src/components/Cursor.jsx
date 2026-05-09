import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/gsapScroll";
import styles from "./Cursor.module.css";

const DESKTOP_QUERY = "(min-width: 768px)";
const COARSE_QUERY = "(pointer: coarse)";

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const currentModeRef = useRef("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const coarsePointer = window.matchMedia(COARSE_QUERY);
    const desktopViewport = window.matchMedia(DESKTOP_QUERY);

    const syncState = () => {
      setEnabled(!coarsePointer.matches && desktopViewport.matches);
    };

    syncState();

    coarsePointer.addEventListener("change", syncState);
    desktopViewport.addEventListener("change", syncState);

    return () => {
      coarsePointer.removeEventListener("change", syncState);
      desktopViewport.removeEventListener("change", syncState);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current || !labelRef.current) {
      return undefined;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    gsap.set(ring, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power2.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power2.out" });

    const updateMode = (nextMode) => {
      if (currentModeRef.current === nextMode) {
        return;
      }

      ring.classList.remove(styles.pointer, styles.text, styles.card);
      label.textContent = "";

      if (nextMode === "pointer") {
        ring.classList.add(styles.pointer);
      }

      if (nextMode === "text") {
        ring.classList.add(styles.text);
      }

      if (nextMode === "card") {
        ring.classList.add(styles.card);
        label.textContent = "VIEW";
      }

      currentModeRef.current = nextMode;
    };

    const resolveMode = (target) => {
      if (!target || !(target instanceof Element)) {
        return "default";
      }

      if (target.closest("[data-cursor='card']")) {
        return "card";
      }

      if (target.closest("[data-cursor='text']")) {
        return "text";
      }

      if (target.closest("a, button, [data-cursor='pointer']")) {
        return "pointer";
      }

      return "default";
    };

    const handleMove = (event) => {
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      xTo(event.clientX);
      yTo(event.clientY);
      updateMode(resolveMode(event.target));
    };

    const handleLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const handleEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={styles.cursorLayer} aria-hidden="true">
      <div ref={ringRef} className={styles.cursorRing}>
        <span ref={labelRef} className={styles.label} />
      </div>
      <div ref={dotRef} className={styles.cursorDot} />
    </div>
  );
};

export default Cursor;
