import { useRef, useEffect, useState } from "react";
import { SplineScene } from "../components/SplineScene";
import { Spotlight } from "../components/Spotlight";
import { gsap } from "../lib/gsapScroll";

// Skip blur on mobile — filter:blur(12px) on a full-width heading is the
// most expensive single GPU op at startup on low-end mobile devices.
const IS_MOBILE_TOUCH = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const Me = ({ onSplineLoad, isAppReady }) => {
  const leftRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setHasScrolled(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAppReady) return; // Halt entrance timeline until screen is ready!

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { y: 40, opacity: 0, ...(IS_MOBILE_TOUCH ? {} : { filter: "blur(12px)" }) },
      { y: 0, opacity: 1, ...(IS_MOBILE_TOUCH ? {} : { filter: "blur(0px)" }), duration: 1, delay: 0.4 }
    )
      .fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        statsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

  }, [isAppReady]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (id === "contact") {
      // Fallback: If the contact section is currently unmounted due to lazy-loading,
      // scrolling to the absolute bottom of the page will reveal it.
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      id="me"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-transparent"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 4s linear infinite;
        }
        @keyframes scroll-line {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          50.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .animate-scroll-line {
          animation: scroll-line 2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 255, 255, 0.15); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.4); }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Spotlight */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* 3D Scene: Full background on mobile, right panel on desktop */}
      <div className="absolute top-0 right-0 w-full h-full md:w-[62%] z-0 pointer-events-auto md:-mr-[5%]">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
          onSplineLoad={onSplineLoad}
          isAppReady={isAppReady}
          isVisible={isVisible}
        />
      </div>

      {/* Text Content: Bottom overlay card on mobile, left panel on desktop */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="w-full h-full max-w-7xl mx-auto flex flex-col justify-end md:justify-center px-4 sm:px-8 lg:px-12 xl:px-16 pb-12 md:pb-0">
          <div
            ref={leftRef}
            className="pointer-events-auto w-full md:w-[55%] lg:w-[50%] relative"
          >
            {/* Mobile dark gradient overlay */}
            <div className="absolute inset-0 md:hidden bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent rounded-t-[2.5rem] -z-10" />

            <div className="bg-brand-bg/60 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none p-8 md:p-0 rounded-t-[2.5rem] md:rounded-none border-t border-brand-border md:border-none flex flex-col items-start w-full">

              <div ref={headingRef} className="opacity-0 flex flex-col items-start">
                {/* Availability Status Pill */}
                <div className="mb-4 md:mb-5 inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                  </div>
                  <span className="font-mono text-[9px] md:text-[10px] text-white/80 uppercase tracking-[0.15em] mt-[1px]">Available for Opportunities</span>
                </div>

                {/* Name */}
                <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-bold leading-[0.85] tracking-[0.02em] text-transparent bg-clip-text bg-gradient-to-r from-neutral-300 via-neutral-50 to-neutral-300 animate-shimmer">
                  Swar<br />Shinde
                </h1>
              </div>

              {/* Role Tags */}
              <div
                ref={subtitleRef}
                className="mt-5 md:mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-body text-sm md:text-base text-brand-muted opacity-0"
              >
                <span>Developer</span>
                <span className="text-brand-border opacity-50">◆</span>
                <span>Builder</span>
                <span className="text-brand-border opacity-50 hidden sm:inline">◆</span>
                <span className="hidden sm:inline">Designer</span>
              </div>

              {/* CTAs */}
              <div
                ref={ctaRef}
                className="mt-8 md:mt-10 flex flex-wrap w-full sm:w-auto gap-3 md:gap-4 opacity-0"
              >
                <button
                  onClick={() => scrollTo("projects")}
                  className="group relative flex-1 sm:flex-none px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white text-black font-semibold tracking-wide text-xs md:text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] md:animate-none animate-pulse-glow"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">View Projects</span>
                  <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
                </button>

                <a
                  href="/Swar-Resume.pdf"
                  download="Swar-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-6 md:px-8 py-3 md:py-3.5 rounded-full border border-brand-accent/50 bg-brand-accent/10 text-brand-accent hover:bg-brand-accent hover:text-black transition-all duration-300 text-xs md:text-sm font-semibold tracking-wide flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                  Résumé
                </a>
              </div>

              {/* Quick Stats / Mini CV */}
              <div ref={statsRef} className="mt-8 md:mt-12 flex items-center gap-5 md:gap-8 opacity-0">
                <div className="flex flex-col">
                  <span className="font-display text-xl md:text-2xl font-bold text-white">500+</span>
                  <span className="font-mono text-[8px] md:text-[9px] text-brand-muted uppercase tracking-[0.2em] mt-1">Daily Users</span>
                </div>
                <div className="w-px h-6 bg-white/15" />
                <div className="flex flex-col">
                  <span className="font-display text-xl md:text-2xl font-bold text-white">Top 8</span>
                  <span className="font-mono text-[8px] md:text-[9px] text-brand-muted uppercase tracking-[0.2em] mt-1">Hackathon</span>
                </div>
                <div className="w-px h-6 bg-white/15" />
                <div className="flex flex-col">
                  <span className="font-display text-xl md:text-2xl font-bold text-white">MERN</span>
                  <span className="font-mono text-[8px] md:text-[9px] text-brand-muted uppercase tracking-[0.2em] mt-1">Full-Stack</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 z-30 ${hasScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-white origin-top animate-scroll-line" />
        </div>
      </div>

      {/* Bottom fade-dissolve: robot legs melt into next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-48 pointer-events-none z-20"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #000000ff 100%)"
        }}
      />
    </section>
  );
};

export default Me;
