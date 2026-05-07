import { useEffect, useState, useRef } from "react";
import { gsap } from "../lib/gsapScroll";

const LOADING_PHRASES = [
  "Initializing Core Assets",
  "Waking Up Servers",
  "Loading 3D Models",
  "Preparing Experience",
  "Almost Ready"
];

const Loader = ({ isAppLoaded, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);
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
    // Cycle phrases based on progress
    const maxIndex = LOADING_PHRASES.length - 1;
    const newIndex = Math.floor((progress / 100) * maxIndex);
    if (newIndex !== phraseIndex) {
      setPhraseIndex(newIndex);
    }
  }, [progress, phraseIndex]);

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
       <div ref={textRef} className="flex flex-col items-center w-full max-w-md px-6 relative z-10">
         {/* Percentage */}
         <span className="font-display font-black text-[clamp(6rem,15vw,12rem)] tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-2xl">
           {progress}%
         </span>
         
         {/* Progress Bar Container */}
         <div className="w-full h-[2px] bg-brand-border mt-8 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 h-full bg-brand-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
            {/* Glow effect on the progress bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-white blur-sm transition-all duration-300 ease-out opacity-50"
              style={{ width: `${progress}%` }}
            />
         </div>

         {/* Loading Phrases */}
         <div className="flex items-center gap-4 mt-6 h-6 overflow-hidden relative">
           <div className="w-2 h-2 rounded-full bg-brand-accent animate-ping shadow-[0_0_10px_rgba(191,219,254,0.8)] shrink-0" />
           <div className="relative h-full flex flex-col items-start justify-start transition-transform duration-500 ease-out" style={{ transform: `translateY(-${phraseIndex * 24}px)` }}>
              {LOADING_PHRASES.map((phrase, idx) => (
                <span key={idx} className="h-[24px] tracking-[0.4em] text-xs font-body uppercase text-brand-muted flex items-center whitespace-nowrap">
                  {phrase}
                </span>
              ))}
           </div>
         </div>
       </div>
       
       {/* Ambient glow in background */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-brand-accent rounded-full blur-[150px] opacity-10 pointer-events-none" />

       {/* Accents */}
       <div ref={lineRef} className="absolute bottom-10 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-brand-accent to-transparent opacity-50" />
    </div>
  )
}
export default Loader;
