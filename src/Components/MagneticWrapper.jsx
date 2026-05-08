import { useRef, useEffect } from "react";
import { gsap } from "../lib/gsapScroll";

const MagneticWrapper = ({ children, className = "" }) => {
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect the OS-level reduced-motion preference — skip all hover physics
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    
    // Create quickTo functions for x and y
    const xTo = gsap.quickTo(el, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(el, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      // Push strength modifier
      const pushStrength = 0.4;
      
      xTo(distanceX * pushStrength);
      yTo(distanceY * pushStrength);
    };
    
    const handleMouseLeave = () => {
      // Reset back to center
      xTo(0);
      yTo(0);
    };
    
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  
  return (
    <div
      ref={ref}
      className={`relative ${className} will-change-transform inline-block`}
    >
      {children}
    </div>
  );
};

export default MagneticWrapper;
