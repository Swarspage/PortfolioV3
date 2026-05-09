import { useRef, useEffect, useState, useCallback } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

// ─── Constants ──────────────────────────────────────────────────────────────
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Data ───────────────────────────────────────────────────────────────────
const experienceData = [
  {
    role: "Intern / Team Member",
    org: "Datta Meghe College",
    duration: "2023 - Present",
    active: true,
    description: "Building and maintaining features across the stack — React on the front, Express and MongoDB in the back. Integrated real-world APIs like OpenWeather and Leaflet into student-facing applications that actually get used.",
  },
  {
    role: "Contributor",
    org: "CSI-CATT Tech Team",
    duration: "2023 - Present",
    active: true,
    description: "Fast-paced collaboration, rapid prototyping, and hackathon-mode shipping. Worked across frontend and backend, and genuinely enjoy the pressure of building something meaningful under a deadline.",
  },
  {
    role: "Freelance / Personal Projects",
    org: "Self-employed",
    duration: "2022 - Present",
    active: false,
    description: "End-to-end ownership: design decisions, MERN stack development, deployment, and polish. Every project has been a lesson in what it actually takes to ship something you're proud of.",
  }
];

// ─── Component ───────────────────────────────────────────────────────────────
const Experience = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const contentRefs = useRef([]);
  const [isTouchMode, setIsTouchMode] = useState(IS_MOBILE);

  useEffect(() => {
    const handleResize = () => {
      setIsTouchMode(window.matchMedia("(hover: none) and (pointer: coarse)").matches || window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setNodeRef = useCallback((i) => (el) => { nodeRefs.current[i] = el; }, []);
  const setContentRef = useCallback((i) => (el) => { contentRefs.current[i] = el; }, []);

  // ── GSAP Timeline animation ──────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || nodeRefs.current.length === 0) return;

    const nodes = nodeRefs.current.filter(Boolean);
    const contents = contentRefs.current.filter(Boolean);
    const line = lineRef.current;

    let mm = gsap.matchMedia();

    // Desktop Animation (Pinned Timeline Scrub)
    mm.add("(hover: hover) and (min-width: 768px)", () => {
      // Setup initial states
      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(nodes, { scale: 0, opacity: 0 });
      gsap.set(contents, { x: 40, opacity: 0, filter: "blur(8px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%", // Scroll depth
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Draw the vertical line smoothly over the entire scroll length
      tl.to(line, { scaleY: 1, duration: 1, ease: "none" }, 0);

      // Trigger nodes and content sequentially as the line "hits" them
      const timeOffsets = [0.1, 0.5, 0.9];
      nodes.forEach((node, i) => {
        const timeOffset = timeOffsets[i] || (i / nodes.length);

        // Pulse the node
        tl.to(node, { scale: 1, opacity: 1, duration: 0.1, ease: "back.out(2)" }, timeOffset);
        
        // Slide out the content
        tl.to(contents[i], { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.2, ease: "power3.out" }, timeOffset + 0.05);
      });

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    });

    // Touch/Mobile Animation (Flowing Unpinned Scroll)
    mm.add("(hover: none), (max-width: 767px)", () => {
      gsap.set([line, ...nodes, ...contents], { clearProps: "all" });

      // Animate line scaling down
      gsap.fromTo(line, 
        { scaleY: 0, transformOrigin: "top center" },
        { 
          scaleY: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: line.parentElement, // the track
            start: "top 75%",
            end: "bottom 75%",
            scrub: true
          }
        }
      );

      // Animate each item independently when it enters viewport
      nodes.forEach((node, i) => {
        const itemTl = gsap.timeline({
          scrollTrigger: {
            trigger: node.parentElement, // the row
            start: "top 80%",
          }
        });
        
        itemTl.fromTo(node, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }
        )
        .fromTo(contents[i],
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        );
      });

      return () => {};
    });

    return () => mm.revert();
  }, []);

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative flex items-center justify-center w-full min-h-dvh overflow-hidden text-brand-text px-5 sm:px-8 md:px-12 lg:px-20 py-20 lg:py-0"
    >
      {/* Ambient dot-grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(191,219,254,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Soft ambient glow */}
      <div
        aria-hidden="true"
        className="absolute right-[-10vw] top-1/2 -translate-y-1/2 w-[40vw] h-[60vh] rounded-full pointer-events-none blur-[120px] opacity-10"
        style={{ background: "radial-gradient(ellipse, rgba(191,219,254,0.3) 0%, transparent 70%)" }}
      />

      {/* ── Inner two-column layout ── */}
      <div
        ref={innerRef}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 sm:gap-16 lg:gap-24"
      >

        {/* ══════════ LEFT: Heading + Intro ══════════ */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center items-start gap-5 sm:gap-7 shrink-0">
          {/* Heading */}
          <div ref={headingRef}>
            <SplitText
              text="EXPERIENCE"
              className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold text-white tracking-[0.12em] leading-none"
              delay={0}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.9 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.5}
            />
            <div className="mt-3 h-px w-12 bg-gradient-to-r from-brand-accent/70 to-transparent" />
            <p className="mt-2.5 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-accent/60">
              What I've been building and contributing to
            </p>
          </div>
          
          {/* Watermark label */}
          <p className="hidden lg:block font-mono text-[8px] tracking-[0.4em] uppercase text-white/8 select-none mt-6">
            Professional Record // Verified
          </p>
        </div>

        {/* ══════════ RIGHT: Glowing Timeline ══════════ */}
        <div className="relative flex-1 w-full flex flex-col justify-center min-h-[400px] lg:min-h-[500px]">
          
          {/* Background Track */}
          <div className="absolute left-[11px] md:left-[15px] top-0 bottom-0 w-[2px] bg-white/[0.05] rounded-full overflow-hidden">
            {/* Glowing Laser Line */}
            <div 
              ref={lineRef} 
              className="w-full h-full bg-brand-accent shadow-[0_0_15px_rgba(191,219,254,0.8)] rounded-full" 
            />
          </div>

          <div className="flex flex-col justify-between h-full py-8 sm:py-12 gap-12 sm:gap-16">
            {experienceData.map((item, index) => (
              <div key={index} className="relative flex items-start pl-10 md:pl-16">
                
                {/* Glowing Node */}
                <div 
                  ref={setNodeRef(index)} 
                  className="absolute left-[7px] md:left-[11px] top-1.5 w-[10px] h-[10px] rounded-full bg-brand-accent shadow-[0_0_12px_rgba(191,219,254,1)] z-10"
                />

                {/* Unboxed Content */}
                <div ref={setContentRef(index)} className="flex flex-col w-full group">
                  {/* Years + Active Pulse */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-brand-accent/80">
                      {item.duration}
                    </span>
                    {item.active && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent shadow-[0_0_8px_rgba(191,219,254,0.8)]"></span>
                      </span>
                    )}
                  </div>

                  {/* Role */}
                  <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight mb-2 transition-colors duration-300 group-hover:text-brand-accent">
                    {item.role}
                  </h3>

                  {/* Organization */}
                  <p className="font-body text-brand-muted text-sm sm:text-base font-semibold tracking-wide uppercase mb-3">
                    {item.org}
                  </p>

                  {/* Description Detail */}
                  <div className="flex items-start gap-4">
                    <div className="h-px w-6 sm:w-8 bg-white/10 mt-2.5 shrink-0" />
                    <p className="font-body text-[13px] sm:text-[15px] leading-relaxed text-[#a0a0a0]">
                      {item.description}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Experience;
