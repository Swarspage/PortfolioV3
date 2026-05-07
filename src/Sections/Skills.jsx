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

// Evaluated once at module load — never re-evaluated on resize
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// Skip filter:blur on mobile — prevents expensive GPU layer compositing
const BLUR_ENTER = IS_MOBILE ? {} : { filter: "blur(8px)" };
const BLUR_CLEAR = IS_MOBILE ? {} : { filter: "blur(0px)" };
const BLUR_EXIT = IS_MOBILE ? {} : { filter: "blur(10px)" };

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
      {/*
        Inner div uses CSS animation for organic float.
        This layer is completely separate from GSAP-controlled outer div,
        so the float never conflicts with ScrollTrigger scrubbing.
      */}
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
          backdropFilter: IS_MOBILE ? "blur(4px)" : "blur(14px)",
          WebkitBackdropFilter: IS_MOBILE ? "blur(4px)" : "blur(14px)",
          transition: "background 0.28s ease, border-color 0.28s ease, box-shadow 0.28s ease",
          // Hover lift — pure CSS transform doesn't interfere with the CSS animation
          // because we wrap in translate inside the animation cycle
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
  const headingWrapRef = useRef(null);
  const gridRef = useRef(null);
  const categoryRefs = useRef([]);
  const cardRefs = useRef([]);

  const setCategoryRef = useCallback((i) => (el) => { categoryRefs.current[i] = el; }, []);
  const setCardRef = useCallback((i) => (el) => { cardRefs.current[i] = el; }, []);

  // Flat list preserving original index for float data lookup
  const categoriesData = useMemo(() =>
    CATEGORIES.map((cat) => ({
      name: cat,
      skills: SKILLS
        .map((s, idx) => ({ ...s, _idx: idx }))
        .filter((s) => s.category === cat),
    })), []
  );

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const grid = gridRef.current;
    if (!section || !inner || !grid) return;

    const categories = categoryRefs.current.filter(Boolean);
    const cards = cardRefs.current.filter(Boolean);

    // ── Initial hidden state ──────────────────────────────────────────────────
    gsap.set(inner, { autoAlpha: 0, scale: 0.96, ...BLUR_ENTER });
    gsap.set(categories, { autoAlpha: 0, y: 32 });
    gsap.set(cards, { autoAlpha: 0, y: 16 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=160%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // Clean-slate reset so GSAP re-measures correctly after resize
          gsap.set(inner, { autoAlpha: 0, scale: 0.96, y: 0, clearProps: "filter" });
          gsap.set(categories, { autoAlpha: 0, y: 32 });
          gsap.set(cards, { autoAlpha: 0, y: 16 });
          gsap.set(grid, { y: 0 });
        },
      },
    });

    // ── Phase 1: Section entrance ─────────────────────────────────────────────
    masterTl.to(inner, {
      autoAlpha: 1, scale: 1, ...BLUR_CLEAR,
      duration: 0.8, ease: "power3.out",
    });

    // ── Phase 2: Category panels stagger in ──────────────────────────────────
    masterTl.to(categories, {
      autoAlpha: 1, y: 0,
      stagger: 0.1, duration: 0.6, ease: "power3.out",
    }, "-=0.35");

    // ── Phase 3: Skill cards stagger in ──────────────────────────────────────
    masterTl.to(cards, {
      autoAlpha: 1, y: 0,
      stagger: 0.025, duration: 0.35, ease: "power2.out",
    }, "-=0.4");

    // ── Phase 4: Hold – user reads the full grid ──────────────────────────────
    masterTl.to({}, { duration: 0.5 });

    // ── Phase 5: Scroll grid upward to reveal overflow content on small screens
    masterTl.to(grid, {
      y: () => {
        const gridH = grid.scrollHeight;
        const headH = headingWrapRef.current?.offsetHeight ?? 120;
        const available = window.innerHeight - headH - 40; // 40px breathing room
        return -Math.max(0, gridH - available);
      },
      ease: "none",
      duration: 1.5,
    });

    // ── Phase 6: Hold at bottom ────────────────────────────────────────────────
    masterTl.to({}, { duration: 0.4 });

    // ── Phase 7: Cinematic exit ───────────────────────────────────────────────
    masterTl.to(inner, {
      autoAlpha: 0, scale: 0.9, ...BLUR_EXIT,
      duration: 0.8, ease: "power2.in",
    });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  // cardIndex incremented sequentially per render — stable because render
  // always visits skills in the same CATEGORIES × SKILLS order
  let cardIndex = 0;

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative h-dvh w-full overflow-hidden bg-transparent"
    >
      {/* ── Float keyframe — self-contained so no external CSS file needed ── */}
      <style>{`
        @keyframes skillFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-5px); }
        }
      `}</style>

      {/* ── Decorative watermark ── */}
      <span
        aria-hidden="true"
        className="absolute right-[-1vw] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none text-white/[0.025] z-0"
        style={{ fontSize: "clamp(8rem,22vw,20rem)", letterSpacing: "-0.05em" }}
      >
        TECH
      </span>

      {/* ── Inner wrapper — GSAP drives entrance / exit on this layer ── */}
      <div ref={innerRef} className="absolute inset-0 flex flex-col z-10 lg:justify-center">

        {/* ── Heading ──────────────────────────────────────────────────────── */}
        <div
          ref={headingWrapRef}
          className="flex-none text-center pt-20 md:pt-24 lg:pt-0 pb-4 md:pb-6 px-6 relative z-20"
        >
          <SplitText
            text="SKILLS"
            className="font-display text-[clamp(3.5rem,8vw,8rem)] font-bold text-white tracking-widest leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.06)]"
            delay={0}
            duration={0.9}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40, scale: 0.85 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.4}
          />
          <p className="text-brand-accent tracking-[0.3em] uppercase text-[10px] md:text-xs mt-3 font-body opacity-70">
            The tech ecosystem I thrive in
          </p>
        </div>

        {/* ── Scrollable grid Mask (Mobile only) ── */}
        <div 
          className="w-full flex-1 min-h-0 relative overflow-hidden lg:overflow-visible lg:flex-none"
          style={{
            WebkitMaskImage: IS_MOBILE ? 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none',
            maskImage: IS_MOBILE ? 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)' : 'none'
          }}
        >
          {/* ── Scrollable grid — GSAP Phase 5 translates this upward ── */}
          <div
            ref={gridRef}
            className="will-change-transform px-4 sm:px-8 md:px-12 lg:px-20 pb-24 lg:pb-0"
          >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 max-w-6xl mx-auto">
            {categoriesData.map((cat, catIndex) => (
              <div
                key={cat.name}
                ref={setCategoryRef(catIndex)}
                className={`rounded-2xl overflow-hidden ${
                  cat.name === "Tools & Languages" ? "md:col-span-2 lg:col-span-3" : ""
                }`}
                style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: IS_MOBILE ? "none" : "blur(8px)",
                  WebkitBackdropFilter: IS_MOBILE ? "none" : "blur(8px)",
                }}
              >
                {/* Category label row */}
                <div className="flex items-center gap-3 px-4 md:px-5 pt-4 md:pt-5 pb-2.5 md:pb-3.5">
                  <div
                    className="h-px w-6 flex-shrink-0"
                    style={{ background: "linear-gradient(to right, transparent, rgba(191,219,254,0.45))" }}
                  />
                  <span className="font-body text-[9px] md:text-[10px] font-semibold tracking-[0.35em] uppercase text-brand-accent/50 whitespace-nowrap">
                    {cat.name}
                  </span>
                  <div
                    className="h-px flex-1"
                    style={{ background: "linear-gradient(to right, rgba(191,219,254,0.15), transparent)" }}
                  />
                </div>

                {/* Skill card flex-wrap */}
                <div className="flex flex-wrap gap-2 md:gap-2.5 px-4 md:px-5 pb-4 md:pb-5">
                  {cat.skills.map((skill) => {
                    const ci = cardIndex++;
                    return (
                      <SkillCard
                        key={skill.skill}
                        ref={setCardRef(ci)}
                        skill={skill}
                        floatDelay={FLOAT_DATA[skill._idx].delay}
                        floatDuration={FLOAT_DATA[skill._idx].duration}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
