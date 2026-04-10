import { useRef, useEffect } from "react";
import { SplineScene } from "../Components/SplineScene";
import { Spotlight } from "../Components/Spotlight";
import { gsap } from "../lib/gsapScroll";

const Me = () => {
  const leftRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { y: 40, opacity: 0, filter: "blur(12px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, delay: 0.4 }
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
      );
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="me"
      className="relative h-screen w-full overflow-hidden bg-transparent"
    >
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
        />
      </div>

      {/* Text Content: Bottom overlay card on mobile, left panel on desktop */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center pointer-events-none">
        <div
          ref={leftRef}
          className="pointer-events-auto w-full md:w-[50%] px-4 sm:px-8 pb-12 md:px-12 lg:px-20 xl:px-32 md:pb-0"
        >
          <div className="bg-brand-bg/60 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none p-8 md:p-0 rounded-t-[2.5rem] md:rounded-none border-t border-brand-border md:border-none flex flex-col items-start w-full">
            {/* Name */}
            <div ref={headingRef}>
              <p className="mb-2 md:mb-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-brand-muted font-body">
                Portfolio — 2025
              </p>
              <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-bold leading-[0.8] tracking-[0.05em] text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">
                Swar<br />Shinde
              </h1>
            </div>

            {/* Role Tags */}
            <div
              ref={subtitleRef}
              className="mt-4 md:mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 font-body text-sm md:text-base text-brand-muted"
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
              className="mt-8 md:mt-10 flex flex-wrap w-full sm:w-auto gap-4"
            >
              <button
                onClick={() => scrollTo("projects")}
                className="group relative flex-1 sm:flex-none px-6 md:px-8 py-3 md:py-3.5 rounded-full bg-white text-black font-semibold tracking-wide text-xs md:text-sm overflow-hidden transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">View Projects</span>
                <div className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
              </button>

              <button
                onClick={() => scrollTo("contact")}
                className="flex-1 sm:flex-none px-6 md:px-8 py-3 md:py-3.5 rounded-full border border-brand-border text-brand-muted hover:text-white hover:border-brand-border-hover transition-all duration-300 text-xs md:text-sm font-medium tracking-wide flex items-center justify-center"
              >
                Contact Me
              </button>
            </div>
          </div>
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
