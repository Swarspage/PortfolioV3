import { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../Components/SplitText";

// ─── Asset imports ─────────────────────────────────────────────────────────────
import C from "../assets/C.webp";
import Cpp from "../assets/cpp.webp";
import Java from "../assets/java.webp";
import Python from "../assets/Python.webp";
import JavaScript from "../assets/js.webp";
import HTML from "../assets/html.webp";
import CSS from "../assets/css.webp";
import ReactLogo from "../assets/react.webp";
import NodeLogo from "../assets/node-js.webp";
import Express from "../assets/express.webp";
import MongoDB from "../assets/MongoDB.webp";
import MySQL from "../assets/MySQL.webp";
import Git from "../assets/Git.webp";
import GitHub from "../assets/github.webp";
import VSCode from "../assets/VS.webp";
import Postman from "../assets/postman.webp";
import ProblemSolving from "../assets/problemsolving.webp";

// ─── Data ──────────────────────────────────────────────────────────────────────
const SKILLS = [
  { skill: "React", img: ReactLogo, glow: "#61DAFB", category: "Frontend" },
  { skill: "JavaScript", img: JavaScript, glow: "#F7DF1E", category: "Frontend" },
  { skill: "HTML", img: HTML, glow: "#E34F26", category: "Frontend" },
  { skill: "CSS", img: CSS, glow: "#1572B6", category: "Frontend" },
  { skill: "Node.js", img: NodeLogo, glow: "#339933", category: "Backend" },
  { skill: "Python", img: Python, glow: "#4B8BBE", category: "Backend" },
  { skill: "Express", img: Express, glow: "#AAAAAA", category: "Backend" },
  { skill: "Java", img: Java, glow: "#ED8B00", category: "Backend" },
  { skill: "MongoDB", img: MongoDB, glow: "#47A248", category: "Database" },
  { skill: "MySQL", img: MySQL, glow: "#00618A", category: "Database" },
  { skill: "C++", img: Cpp, glow: "#00599C", category: "Tools & Languages" },
  { skill: "C", img: C, glow: "#A8B9CC", category: "Tools & Languages" },
  { skill: "Git", img: Git, glow: "#F05032", category: "Tools & Languages" },
  { skill: "GitHub", img: GitHub, glow: "#D0D0D0", category: "Tools & Languages" },
  { skill: "VS Code", img: VSCode, glow: "#007ACC", category: "Tools & Languages" },
  { skill: "Postman", img: Postman, glow: "#FF6C37", category: "Tools & Languages" },
  { skill: "Problem Solving", img: ProblemSolving, glow: "#BFDBFE", category: "Tools & Languages" },
];

const CATEGORIES = ["Frontend", "Backend", "Database", "Tools & Languages"];

// Evaluated once at module load
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Float delays — pre-computed to avoid Math.random() in render ──────────────
const FLOAT_DATA = SKILLS.map((_, i) => ({
  delay: parseFloat(((i * 0.38) % 2.0).toFixed(2)),
  duration: parseFloat((2.1 + (i % 4) * 0.45).toFixed(2)),
}));

// ─── SkillCard ─────────────────────────────────────────────────────────────────
const SkillCard = forwardRef(function SkillCard({ skill, floatDelay, floatDuration }, ref) {
  const [hovered, setHovered] = useState(false);

  const enterHandler = () => { if (!IS_MOBILE) setHovered(true); };
  const leaveHandler = () => { if (!IS_MOBILE) setHovered(false); };

  return (
    <div
      ref={ref}
      onPointerEnter={enterHandler}
      onPointerLeave={leaveHandler}
      className="relative flex-shrink-0 will-change-transform"
      style={{ width: IS_MOBILE ? 74 : 90, height: IS_MOBILE ? 74 : 88 }}
    >
      {/* Organic float animation separated from GSAP outer layer */}
      <div
        className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center"
        style={{
          animation: `skillFloat ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          gap: IS_MOBILE ? 5 : 7,
          background: hovered
            ? `linear-gradient(135deg, ${skill.glow}20 0%, rgba(255,255,255,0.06) 100%)`
            : "rgba(255,255,255,0.035)",
          border: `1px solid ${hovered ? skill.glow + "80" : "rgba(255,255,255,0.08)"}`,
          boxShadow: hovered
            ? `0 0 24px ${skill.glow}30, 0 8px 24px rgba(0,0,0,0.4)`
            : "0 2px 10px rgba(0,0,0,0.2)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          transition: "background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
          transform: hovered ? "scale(1.09) translateY(-3px)" : "scale(1)",
        }}
      >
        <img
          src={skill.img}
          alt={skill.skill}
          draggable={false}
          style={{
            width: IS_MOBILE ? 28 : 34,
            height: IS_MOBILE ? 28 : 34,
            objectFit: "contain",
            filter: hovered
              ? `drop-shadow(0 0 8px ${skill.glow})`
              : "opacity(0.72)",
            transition: "filter 0.28s ease",
          }}
        />
        <span
          style={{
            fontSize: IS_MOBILE ? "7.5px" : "9px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.25,
            wordBreak: "break-word",
            maxWidth: IS_MOBILE ? 66 : 80,
            color: hovered ? skill.glow : "rgba(255,255,255,0.52)",
            transition: "color 0.28s ease",
          }}
        >
          {skill.skill}
        </span>
      </div>
    </div>
  );
});

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function Skills() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headingRef = useRef(null);
  const rightColumnRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const contentRefs = useRef([]);
  const [isTouchMode, setIsTouchMode] = useState(IS_MOBILE);

  const categoriesData = useMemo(() =>
    CATEGORIES.map((cat) => ({
      name: cat,
      skills: SKILLS
        .map((s, idx) => ({ ...s, _idx: idx }))
        .filter((s) => s.category === cat),
    })), []
  );

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
    const rightCol = rightColumnRef.current;

    let mm = gsap.matchMedia();

    // Desktop Animation (Pinned Timeline Scrub with Overflow translate)
    mm.add("(hover: hover) and (min-width: 768px)", () => {
      // Setup initial states
      gsap.set(line, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(nodes, { scale: 0, opacity: 0 });
      gsap.set(contents, { x: 40, opacity: 0, filter: "blur(8px)" });
      gsap.set(rightCol, { y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=250%", // Longer scrub depth to accommodate the tall skill tree
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
        },
      });

      // 1. Draw the vertical line smoothly over the entire scroll length
      tl.to(line, { scaleY: 1, duration: 1, ease: "none" }, 0);

      // 2. Slide the entire right column up to reveal overflow if it's too tall
      tl.to(rightCol, {
        y: () => {
          const colH = rightCol.scrollHeight;
          const available = window.innerHeight - 80;
          return -Math.max(0, colH - available);
        },
        duration: 1, 
        ease: "none"
      }, 0);

      // 3. Trigger nodes and content sequentially as the line "hits" them
      const total = nodes.length;
      nodes.forEach((node, i) => {
        const timeOffset = (i / total) * 0.8 + 0.1; // Distribution between 0.1 and 0.9

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
      gsap.set([line, ...nodes, ...contents, rightCol], { clearProps: "all" });

      // Animate line scaling down naturally
      gsap.fromTo(line, 
        { scaleY: 0, transformOrigin: "top center" },
        { 
          scaleY: 1, 
          ease: "none",
          scrollTrigger: {
            trigger: line.parentElement,
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
            trigger: node.parentElement,
            start: "top 85%",
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

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative flex items-center justify-center w-full min-h-dvh overflow-hidden bg-transparent text-brand-text px-5 sm:px-8 md:px-12 lg:px-20 py-20 lg:py-0"
    >
      {/* ── Decorative watermark ── */}
      <span
        aria-hidden="true"
        className="absolute right-[-1vw] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none text-white/[0.025] z-0"
        style={{ fontSize: "clamp(8rem,22vw,20rem)", letterSpacing: "-0.05em" }}
      >
        TECH
      </span>

      {/* Ambient dot-grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(191,219,254,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Inner two-column layout */}
      <div
        ref={innerRef}
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch gap-12 sm:gap-16 lg:gap-24"
      >

        {/* ══════════ LEFT: Heading + Intro ══════════ */}
        <div className="w-full lg:w-[42%] flex flex-col justify-center items-start gap-5 sm:gap-7 shrink-0">
          <div ref={headingRef}>
            <SplitText
              text="SKILLS"
              className="font-display text-[clamp(3.5rem,8vw,8rem)] font-bold text-white tracking-[0.12em] leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.06)]"
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
              The tech ecosystem I thrive in
            </p>
          </div>
          
          {/* Watermark label */}
          <p className="hidden lg:block font-mono text-[8px] tracking-[0.4em] uppercase text-white/8 select-none mt-6">
            Technical Stack // Verified
          </p>
        </div>

        {/* ══════════ RIGHT: Glowing Timeline + Skill Cards ══════════ */}
        <div 
          ref={rightColumnRef} 
          className="relative flex-1 w-full flex flex-col justify-start pt-10 pb-24 lg:py-20 min-h-[400px]"
        >
          
          {/* Background Track */}
          <div className="absolute left-[11px] md:left-[15px] top-4 bottom-10 w-[2px] bg-white/[0.05] rounded-full overflow-hidden">
            {/* Glowing Laser Line */}
            <div 
              ref={lineRef} 
              className="w-full h-full bg-brand-accent shadow-[0_0_15px_rgba(191,219,254,0.8)] rounded-full" 
            />
          </div>

          <div className="flex flex-col gap-14 md:gap-20">
            {categoriesData.map((cat, index) => (
              <div key={cat.name} className="relative flex items-start pl-10 md:pl-16">
                
                {/* Glowing Node */}
                <div 
                  ref={setNodeRef(index)} 
                  className="absolute left-[7px] md:left-[11px] top-[0.6rem] w-[10px] h-[10px] rounded-full bg-brand-accent shadow-[0_0_12px_rgba(191,219,254,1)] z-10"
                />

                {/* Unboxed Content */}
                <div ref={setContentRef(index)} className="flex flex-col w-full group">
                  {/* Category Title */}
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight mb-6 transition-colors duration-300 group-hover:text-brand-accent flex items-center gap-4">
                    {cat.name}
                    <div className="h-px w-12 bg-gradient-to-r from-white/20 to-transparent flex-shrink-0" />
                  </h3>

                  {/* Skill Cards Grid */}
                  <div className="flex flex-wrap gap-3 md:gap-4">
                    {cat.skills.map((skill) => (
                      <SkillCard
                        key={skill.skill}
                        skill={skill}
                        floatDelay={FLOAT_DATA[skill._idx].delay}
                        floatDuration={FLOAT_DATA[skill._idx].duration}
                      />
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
