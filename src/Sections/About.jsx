import { useRef, useEffect, useState } from "react";
import image from "../assets/image.webp";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";
import aboutData from "../Components/AboutData.json";

// Skip filter:blur on mobile — prevents expensive GPU layer compositing on low-power devices
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const About = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headingRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textBlocksRef = useRef([]);
  const [isTouchMode, setIsTouchMode] = useState(IS_MOBILE);

  useEffect(() => {
    const handleResize = () => {
      setIsTouchMode(window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setTextBlockRef = (index) => (el) => {
    if (el && !textBlocksRef.current.includes(el)) {
      textBlocksRef.current[index] = el;
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || textBlocksRef.current.length === 0) return;

    const blocks = textBlocksRef.current;

    let mm = gsap.matchMedia();

    // Desktop Animation (Pinned Scrub)
    mm.add("(hover: hover) and (min-width: 768px)", () => {
      gsap.set(blocks, { clearProps: "all" });
      gsap.set(blocks.slice(1), { y: 50, opacity: 0, ...(IS_MOBILE ? {} : { filter: "blur(4px)" }) });
      gsap.set(blocks[0], { y: 0, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${(blocks.length + 1) * 50}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      blocks.forEach((block, index) => {
        if (index > 0) {
          tl.to(block, {
            y: 0, opacity: 1, ...(IS_MOBILE ? {} : { filter: "blur(0px)" }), duration: 1, ease: "power2.out"
          });
        }
        if (index < blocks.length - 1) {
          tl.to(block, {
            y: -50, opacity: 0, ...(IS_MOBILE ? {} : { filter: "blur(4px)" }), duration: 1, ease: "power2.in"
          }, "+=0.5");
        }
      });

      if (innerRef.current) {
        tl.to(innerRef.current, {
          scale: 0.88, opacity: 0, ...(IS_MOBILE ? {} : { filter: "blur(8px)" }), duration: 1.5, ease: "power2.in"
        }, "+=0.3");
      }

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    });

    // Mobile Animation (Horizontal Swipe - No Pin)
    mm.add("(hover: none), (max-width: 767px)", () => {
      gsap.set(blocks, { clearProps: "all" });
      gsap.set(innerRef.current, { clearProps: "all" });

      // Subtle entrance fade for the cards when section enters
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        }
      });
      
      tl.fromTo(blocks, 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  // Entrance animation for image when reaching section
  useEffect(() => {
    if (!imageContainerRef.current) return;
    // Store the returned animation so its ScrollTrigger can be killed on cleanup
    const anim = gsap.fromTo(
      imageContainerRef.current,
      { scale: 0.9, opacity: 0, rotationY: 15 },
      {
        scale: 1, opacity: 1, rotationY: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      }
    );
    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-dvh w-full overflow-hidden bg-transparent"
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div ref={innerRef} className={`w-full h-full max-w-7xl mx-auto relative gap-12 lg:gap-20 ${isTouchMode ? '' : 'flex flex-row items-center px-12 lg:px-24'}`}>

        {/* --- Left Column Wrapper (Desktop: Bundles Title + Bios) --- */}
        <div className={`relative ${isTouchMode ? 'h-full' : 'h-full flex flex-col justify-center flex-1 gap-8'}`}>

          {/* 1. Sticky Title: Top card on mobile, Top-Left on desktop */}
          <div className={`flex flex-col w-full z-20 mt-0 ${isTouchMode ? 'absolute top-0 left-0 right-0 justify-start pointer-events-none' : 'relative justify-center pointer-events-auto'}`}>
            <div ref={headingRef} className={`bg-transparent flex flex-col w-full ${isTouchMode ? 'p-6 pt-24 pb-6 items-center text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]' : 'p-0 items-start text-left drop-shadow-none'}`}>
              <SplitText
                text="ABOUT"
                className="font-display text-[clamp(3.5rem,10vw,5rem)] font-bold text-white tracking-widest leading-[0.8] drop-shadow-2xl"
                delay={0}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.3}
              />
              <div className={`text-brand-accent tracking-[0.2em] uppercase font-body opacity-90 drop-shadow-lg ${isTouchMode ? 'text-[10px] mt-3 ml-0' : 'text-xs mt-2 ml-1'}`}>
                The person behind the code
              </div>
            </div>
          </div>

          {/* 2. Text Bio Container: Middle/Bottom on mobile, Bottom-Left on desktop */}
          <div className={`z-0 flex flex-col pointer-events-auto ${isTouchMode ? 'absolute top-[260px] md:top-auto bottom-4 md:bottom-12 left-0 right-0 pb-4 h-[50vh] md:h-auto' : 'relative inset-auto pb-0 h-[45vh] lg:h-[40vh]'}`}>

            {/* Animated Paragraphs Stack / Swipe Carousel */}
            <div className={`relative flex-1 w-full perspective-1000 ${isTouchMode ? 'flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4' : 'block px-0'}`}>
              {aboutData.paragraphs.map((para, index) => (
                <div
                  key={index}
                  ref={setTextBlockRef(index)}
                  className={`flex flex-col font-body text-[clamp(1.1rem,1.5vw,1.3rem)] leading-relaxed ${isTouchMode ? 'justify-end text-white w-[85vw] md:w-[65vw] max-w-[500px] shrink-0 snap-center p-6 md:p-8 rounded-[1.5rem] bg-brand-bg/20 border border-white/10 backdrop-blur-sm shadow-lg' : 'justify-center text-brand-muted absolute inset-0 w-full p-8 rounded-[2rem] bg-brand-surface/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] drop-shadow-none'}`}
                  style={{ zIndex: aboutData.paragraphs.length - index }}
                >
                  <p dangerouslySetInnerHTML={{ __html: para }} />
                </div>
              ))}
            </div>

            {/* Identity Chips (Static below paragraphs) */}
            <div className={`flex flex-wrap gap-2 pt-6 shrink-0 ${isTouchMode ? 'px-6 justify-center' : 'px-2 justify-start'}`}>
              <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white text-[10px] md:text-xs tracking-wider">
                🧩 Builder
              </span>
              <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white text-[10px] md:text-xs tracking-wider">
                🎯 Focused
              </span>
              <span className="px-4 py-1.5 rounded-full border border-brand-accent/30 bg-white/5 text-brand-accent text-[10px] md:text-xs tracking-wider">
                ✨ Creative
              </span>
            </div>
          </div>
        </div>

        {/* 3. Portrait Image: Background on mobile, Right side on desktop */}
        <div className={`shrink-0 z-0 ${isTouchMode ? 'absolute inset-0 w-full h-full z-[-1]' : 'relative block w-[38%] lg:w-[35%] h-[65vh] aspect-[3/4]'}`}>
          <div
            ref={imageContainerRef}
            className={`w-full h-full relative overflow-hidden bg-black ${isTouchMode ? '' : 'rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]'}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-t z-10 pointer-events-none ${isTouchMode ? 'from-brand-bg via-brand-bg/80 to-brand-bg/20' : 'from-black/80 via-transparent to-transparent'}`}></div>
            <div className="absolute inset-0 bg-brand-accent/10 z-[1] mix-blend-overlay"></div>
            <img
              src={image}
              alt="Swar Shinde"
              width={900}
              height={1200}
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-top scale-[1.02]"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
