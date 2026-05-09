import { useRef, useEffect, useState } from "react";
import image from "../assets/image.webp";
import SplitText from "../components/SplitText";
import { gsap } from "../lib/gsapScroll";
import aboutData from "../data/AboutData.json";

// Skip filter:blur on mobile — prevents expensive GPU layer compositing on low-power devices
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;

const About = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headingRef = useRef(null);
  const imageContainerRef = useRef(null);
  const textBlocksRef = useRef([]);
  const [isMobile, setIsMobile] = useState(IS_MOBILE);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setTextBlockRef = (index) => (el) => {
    if (el) {
      textBlocksRef.current[index] = el;
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || textBlocksRef.current.length === 0) return;

    const blocks = textBlocksRef.current;

    let mm = gsap.matchMedia();

    // Desktop/Tablet Animation (Pinned Scrub - Accumulating Boxes)
    mm.add("(min-width: 768px)", () => {
      gsap.set(blocks, { opacity: 0, scale: 0.9, filter: "blur(4px)", y: 20 });
      gsap.set(innerRef.current, { clearProps: "all" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${blocks.length * 60}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      blocks.forEach((block, index) => {
        tl.to(block, {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out"
        }, `+=${index === 0 ? 0 : 0.5}`); 
      });

      if (innerRef.current) {
        tl.to(innerRef.current, {
          scale: 0.95, opacity: 0, filter: "blur(8px)", duration: 1.5, ease: "power2.in"
        }, "+=0.8");
      }

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    });

    // Mobile Animation (Horizontal Swipe - No Pin)
    mm.add("(max-width: 767px)", () => {
      gsap.set(blocks, { clearProps: "all" });
      gsap.set(innerRef.current, { clearProps: "all" });

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
  }, [isMobile]);

  // Entrance animation for image when reaching section
  useEffect(() => {
    if (!imageContainerRef.current) return;
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
  }, [isMobile]);

  return (
    <section ref={sectionRef} className="relative h-dvh w-full overflow-hidden bg-transparent">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ──────────────── MOBILE LAYOUT ──────────────── */}
      {isMobile && (
         <div ref={innerRef} className="w-full h-full relative">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-[-1]">
               <div ref={imageContainerRef} className="w-full h-full relative overflow-hidden bg-black">
                  <div className="absolute inset-0 bg-gradient-to-t z-10 pointer-events-none from-brand-bg via-brand-bg/80 to-brand-bg/20"></div>
                  <div className="absolute inset-0 bg-brand-accent/10 z-[1] mix-blend-overlay"></div>
                  <img src={image} alt="Swar Shinde" width={900} height={1200} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover object-top scale-[1.02]" />
               </div>
            </div>
            
            {/* Title */}
            <div className="absolute top-0 left-0 right-0 p-6 pt-24 pb-6 flex flex-col items-center text-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] z-20 pointer-events-none">
               <div ref={headingRef}>
                 <SplitText text="ABOUT" className="font-display text-[clamp(3.5rem,10vw,5rem)] font-bold text-white tracking-widest leading-[0.8] drop-shadow-2xl" delay={0} duration={0.8} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} threshold={0.3} />
                 <div className="text-brand-accent tracking-[0.2em] uppercase font-body text-[10px] mt-3 opacity-90 drop-shadow-lg">The person behind the code</div>
               </div>
            </div>

            {/* Horizontal Scroll Cards */}
            <div className="z-0 flex flex-col pointer-events-auto absolute top-[260px] md:top-auto bottom-4 left-0 right-0 pb-4 h-[50vh]">
               <div className="relative flex-1 w-full perspective-1000 flex flex-row overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-4">
                 {aboutData.paragraphs.map((para, index) => (
                    <div key={index} ref={setTextBlockRef(index)} className="flex flex-col font-body text-[clamp(1rem,1.2vw,1.1rem)] leading-relaxed justify-end text-white w-[85vw] max-w-[500px] shrink-0 snap-center p-6 rounded-[1.5rem] bg-brand-bg/20 border border-white/10 backdrop-blur-sm shadow-lg" style={{ zIndex: aboutData.paragraphs.length - index }}>
                      <p dangerouslySetInnerHTML={{ __html: para }} />
                    </div>
                 ))}
               </div>
               <div className="flex flex-wrap gap-2 pt-6 shrink-0 px-6 justify-center">
                  <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white text-[10px] tracking-wider">🧩 Builder</span>
                  <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white text-[10px] tracking-wider">🎯 Focused</span>
                  <span className="px-4 py-1.5 rounded-full border border-brand-accent/30 bg-white/5 text-brand-accent text-[10px] tracking-wider">✨ Creative</span>
               </div>
            </div>
         </div>
      )}

      {/* ──────────────── DESKTOP / TABLET LAYOUT ──────────────── */}
      {!isMobile && (
         <div ref={innerRef} className="w-full h-full max-w-7xl mx-auto relative flex items-center justify-center px-6 md:px-12 lg:px-24">
            
            {/* Pinned Title */}
            <div className="absolute top-[10%] lg:top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
               <div ref={headingRef} className="flex flex-col items-center">
                 <SplitText text="ABOUT" className="font-display text-[5rem] lg:text-[6rem] font-bold text-white tracking-widest leading-[0.8] drop-shadow-2xl" delay={0} duration={0.8} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 50 }} to={{ opacity: 1, y: 0 }} threshold={0.3} />
                 <div className="text-brand-accent tracking-[0.3em] uppercase font-body text-xs mt-3 opacity-90 drop-shadow-lg">The person behind the code</div>
               </div>
            </div>

            {/* Central Portrait */}
            <div className="relative w-[40%] md:w-[35%] lg:w-[28%] h-[60vh] lg:h-[70vh] aspect-[3/4] z-10 shrink-0 mt-[8%]">
               <div ref={imageContainerRef} className="w-full h-full relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#050505]">
                  <div className="absolute inset-0 bg-gradient-to-t z-10 pointer-events-none from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-brand-accent/5 z-[1] mix-blend-overlay"></div>
                  <img src={image} alt="Swar Shinde" width={900} height={1200} loading="eager" decoding="async" className="absolute inset-0 w-full h-full object-cover object-center scale-[1.05]" />
               </div>
            </div>

            {/* Scattered Text Blocks */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center max-w-7xl mx-auto px-4 mt-[8%]">
               <div className="relative w-full h-[60vh] lg:h-[70vh]">
                 {aboutData.paragraphs.map((para, index) => {
                    const positions = [
                      "top-[-5%] right-[60%]",    // 1. Top Left
                      "top-[20%] left-[60%]",     // 2. Middle Right
                      "bottom-[20%] right-[60%]", // 3. Bottom Left
                      "bottom-[-5%] left-[60%]"   // 4. Bottom Right
                    ];
                    return (
                      <div 
                        key={index} 
                        ref={setTextBlockRef(index)} 
                        className={`absolute ${positions[index]} w-[35vw] md:w-[32vw] lg:w-[26vw] max-w-[420px] p-5 md:p-6 lg:p-7 rounded-[2rem] bg-[#050505]/60 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col font-body text-[0.85rem] md:text-[0.95rem] xl:text-[1rem] text-white/90 leading-relaxed pointer-events-auto`}
                      >
                        <p dangerouslySetInnerHTML={{ __html: para }} />
                      </div>
                    )
                 })}
               </div>
            </div>

         </div>
      )}
    </section>
  );
};

export default About;
