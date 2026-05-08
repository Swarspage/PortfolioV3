import { useRef, useEffect } from "react";
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

  const setTextBlockRef = (index) => (el) => {
    if (el && !textBlocksRef.current.includes(el)) {
      textBlocksRef.current[index] = el;
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || textBlocksRef.current.length === 0) return;

    const blocks = textBlocksRef.current;

    // Reset styles
    gsap.set(blocks, { clearProps: "all" });
    
    // Set initial states: first block visible, others hidden below
    gsap.set(blocks.slice(1), { y: 50, opacity: 0, ...(IS_MOBILE ? {} : { filter: "blur(4px)" }) });
    gsap.set(blocks[0], { y: 0, opacity: 1 });

    const isDesktop = window.innerWidth >= 768;

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
      // 1. Entrance animation (except for the first one)
      if (index > 0) {
        tl.to(block, {
          y: 0,
          opacity: 1,
          ...(IS_MOBILE ? {} : { filter: "blur(0px)" }),
          duration: 1,
          ease: "power2.out"
        });
      }

      // 2. Exit animation (except for the last one)
      if (index < blocks.length - 1) {
        tl.to(block, {
          y: -50,
          opacity: 0,
          ...(IS_MOBILE ? {} : { filter: "blur(4px)" }),
          duration: 1,
          ease: "power2.in"
        }, "+=0.5"); // hold it before pushing out
      }
    });

    // EXIT: About peels away (scales back, fades) — reveals Projects from behind
    if (innerRef.current) {
      tl.to(innerRef.current, {
        scale: 0.88,
        opacity: 0,
        ...(IS_MOBILE ? {} : { filter: "blur(8px)" }),
        duration: 1.5,
        ease: "power2.in"
      }, "+=0.3");
    }

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
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
      <div ref={innerRef} className="w-full h-full max-w-7xl mx-auto relative md:flex md:flex-row md:items-center md:px-12 lg:px-24 gap-12 lg:gap-20">
        
        {/* --- Left Column Wrapper (Desktop: Bundles Title + Bios) --- */}
        <div className="md:flex md:flex-col md:justify-center md:flex-1 relative h-full">
          
          {/* 1. Sticky Title: Top card on mobile, Top-Left on desktop */}
          <div className="absolute top-0 left-0 right-0 md:relative flex flex-col justify-start pointer-events-none md:pointer-events-auto z-20 w-full mt-0">
            <div ref={headingRef} className="bg-transparent md:bg-transparent p-6 pt-24 pb-6 md:p-0 flex flex-col items-center md:items-start text-center md:text-left w-full drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:drop-shadow-none">
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
              <div className="text-brand-accent tracking-[0.2em] uppercase text-[10px] md:text-xs mt-3 md:mt-2 ml-0 md:ml-1 font-body opacity-90 drop-shadow-lg">
                The person behind the code
              </div>
            </div>
          </div>

          {/* 2. Text Bio Container: Middle/Bottom on mobile, Bottom-Left on desktop */}
          <div className="absolute top-[260px] bottom-4 left-4 right-4 md:relative md:inset-auto flex flex-col pointer-events-auto z-0 pb-4 md:pb-0 h-[50vh] md:h-[45vh] lg:h-[40vh]">
            
            {/* Animated Paragraphs Stack */}
            <div className="relative flex-1 w-full perspective-1000">
              {aboutData.paragraphs.map((para, index) => (
                <div 
                  key={index}
                  ref={setTextBlockRef(index)}
                  className="absolute inset-0 flex flex-col justify-end md:justify-center font-body text-[clamp(1.1rem,1.5vw,1.3rem)] leading-relaxed text-white md:text-brand-muted p-4 md:p-8 rounded-none md:rounded-[2rem] bg-transparent md:bg-brand-surface/40 backdrop-blur-none md:backdrop-blur-xl shadow-none md:shadow-[0_8px_32px_rgba(0,0,0,0.4)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:drop-shadow-none"
                  style={{ zIndex: aboutData.paragraphs.length - index }}
                >
                  <p dangerouslySetInnerHTML={{ __html: para }} />
                </div>
              ))}
            </div>

            {/* Identity Chips (Static below paragraphs) */}
            <div className="flex flex-wrap gap-2 pt-6 px-2 justify-center md:justify-start shrink-0">
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
        <div className="absolute inset-0 md:relative md:block shrink-0 w-full md:w-[38%] lg:w-[35%] h-full md:h-[65vh] md:aspect-[3/4] z-[-1] md:z-0">
          <div 
            ref={imageContainerRef} 
            className="w-full h-full relative md:rounded-[2.5rem] overflow-hidden md:border border-white/10 md:shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-brand-bg/20 md:from-black/80 md:via-transparent md:to-transparent z-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-brand-accent/10 z-[1] mix-blend-overlay"></div>
            <img 
              src={image} 
              alt="Swar Shinde" 
              className="absolute inset-0 w-full h-full object-cover object-top scale-[1.02]"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;
