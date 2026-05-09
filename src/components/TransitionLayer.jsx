import { useLayoutEffect, useRef } from "react";
import { gsap } from "../lib/gsapScroll";
import styles from "./TransitionLayer.module.css";

const TransitionLayer = () => {
  const rootRef = useRef(null);
  const lineRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const root = rootRef.current;
    const line = lineRef.current;
    let observer;

    if (!root || !line) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      const sections = Array.from(document.querySelectorAll("section[id]"));
      let sweepFromLeft = true;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            gsap.fromTo(
              line,
              {
                scaleX: 0,
                opacity: 0,
                transformOrigin: sweepFromLeft ? "left center" : "right center",
              },
              {
                scaleX: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1,
              }
            );

            sweepFromLeft = !sweepFromLeft;
          });
        },
        {
          threshold: 0.45,
        }
      );

      sections.forEach((section) => observer.observe(section));
    }, root);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.layer} aria-hidden="true">
      <div ref={lineRef} className={styles.line} />
    </div>
  );
};

export default TransitionLayer;
