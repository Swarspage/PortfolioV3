import { useEffect, useState, useRef } from "react";
import { gsap } from "../lib/gsapScroll";

const Loader = ({ isAppLoaded, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const wrapperRef = useRef(null);
  const textRef = useRef(null);
  const lineRef = useRef(null);
  
  useEffect(() => {
    let interval;
    // Walk counter up to ~90% natively to simulate processing time
    interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90; // Hold securely at 90% until Spline model buffers
        }
        return p + Math.floor(Math.random() * 8) + 1;
      });
    }, 120);

    // Hard fallback: if Spline never fires (ad-blocker, network error),
    // force the loader to complete after 10 seconds so the user isn't stuck.
    const fallbackTimeout = setTimeout(() => {
      setProgress(100);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  useEffect(() => {
    if (isAppLoaded) {
      // Fast burst to 100% when Spline finishes securely
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            return 100;
          }
          return p + Math.floor(Math.random() * 15) + 5;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isAppLoaded]);

  useEffect(() => {
    if (progress >= 100) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });
      // Dramatic cinematic exit
      tl.to(textRef.current, { scale: 1.1, opacity: 0, filter: "blur(12px)", duration: 0.6, ease: "power3.inOut" })
        .to(lineRef.current, { scaleX: 0, opacity: 0, duration: 0.4, ease: "power3.inOut" }, "-=0.4")
        .to(wrapperRef.current, { y: "-100%", duration: 1.2, ease: "power4.inOut" }, "-=0.1");
    }
  }, [progress, onComplete]);

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-[10000] bg-brand-bg flex items-center justify-center flex-col pointer-events-auto">
       <div ref={textRef} className="flex flex-col items-center">
         <span className="font-display font-black text-[clamp(6rem,15vw,12rem)] tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600">
           {progress}%
         </span>
         <div className="flex items-center gap-4 mt-6">
           <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping" />
           <span className="tracking-[0.4em] text-xs font-body uppercase text-brand-muted">Initializing Core Assets</span>
         </div>
       </div>
       {/* Accents */}
       <div ref={lineRef} className="absolute bottom-10 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50" />
    </div>
  )
}
export default Loader;
