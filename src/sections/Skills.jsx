import { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../components/SplitText";

// ─── Data ──────────────────────────────────────────────────────────────────────
import SKILLS_DATA from "../data/SkillsData.json";

const icons = import.meta.glob('../assets/*.{webp,svg}', { eager: true, import: 'default' });

const SKILLS = SKILLS_DATA.map(skill => ({
  ...skill,
  img: icons[`../assets/${skill.icon}`] || ''
}));

const CATEGORIES = ["Frontend", "Backend", "Database", "Languages", "Tools"];

// ─── Float delays — pre-computed to avoid Math.random() in render ──────────────
const FLOAT_DATA = SKILLS.map((_, i) => ({
  delay: parseFloat(((i * 0.38) % 2.0).toFixed(2)),
  duration: parseFloat((2.1 + (i % 4) * 0.45).toFixed(2)),
}));

// ─── SkillCard ─────────────────────────────────────────────────────────────────
const SkillCard = forwardRef(function SkillCard({ skill, floatDelay, floatDuration }, ref) {
  const [hovered, setHovered] = useState(false);
  const [isTouchMode, setIsTouchMode] = useState(false);

  useEffect(() => {
    setIsTouchMode(typeof window !== "undefined" && window.innerWidth < 768);
  }, []);

  const enterHandler = () => { if (!isTouchMode) setHovered(true); };
  const leaveHandler = () => { if (!isTouchMode) setHovered(false); };

  // Sizes can be slightly larger since they sit inside focused category boxes
  const w = isTouchMode ? 66 : 86;
  const h = isTouchMode ? 66 : 86;
  const imgSize = isTouchMode ? 26 : 34;
  const fontSize = isTouchMode ? "7px" : "8.5px";
  const gapSize = isTouchMode ? 4 : 6;
  const maxWidth = isTouchMode ? 60 : 76;

  return (
    <div
      ref={ref}
      onPointerEnter={enterHandler}
      onPointerLeave={leaveHandler}
      className="relative flex-shrink-0 will-change-transform pointer-events-auto"
      style={{ width: w, height: h }}
      data-cursor="card"
      data-cursor-label={skill.skill}
    >
      <div
        className="absolute inset-0 rounded-[1.1rem] flex flex-col items-center justify-center"
        style={{
          animation: `skillFloat ${floatDuration}s ease-in-out ${floatDelay}s infinite`,
          gap: gapSize,
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
            width: imgSize,
            height: imgSize,
            objectFit: "contain",
            filter: hovered
              ? `drop-shadow(0 0 8px ${skill.glow})`
              : "opacity(0.72)",
            transition: "filter 0.28s ease",
          }}
        />
        <span
          style={{
            fontSize: fontSize,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            textAlign: "center",
            lineHeight: 1.25,
            wordBreak: "break-word",
            maxWidth: maxWidth,
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
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const setCardRef = useCallback((i) => (el) => { cardsRef.current[i] = el; }, []);

  const categoriesData = useMemo(() =>
    CATEGORIES.map((cat) => ({
      name: cat,
      skills: SKILLS
        .map((s, idx) => ({ ...s, _idx: idx }))
        .filter((s) => s.category === cat),
    })), []
  );

  // ── GSAP Timeline animation ──────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);

    let mm = gsap.matchMedia();

    // ── Desktop: Crystal Clear "Card Dealer" Layout ──
    mm.add("(min-width: 768px)", () => {
      // Set initial states
      gsap.set(cards, { x: "0vw", y: 200, opacity: 0, scale: 0.8, filter: "blur(10px)" });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${cards.length * 100}%`, // Scroll depth based on number of cards
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      const overlapDuration = 1;
      const holdDuration = 0.5;

      // Final resting positions pulled closer to center for crystal clear visibility
      const positions = [
        { x: "-18vw", y: "-22vh", scale: 0.65 }, // 0: Top Left
        { x: "18vw", y: "-22vh", scale: 0.65 },  // 1: Top Right
        { x: "-18vw", y: "22vh", scale: 0.65 },  // 2: Bottom Left
        { x: "18vw", y: "22vh", scale: 0.65 }    // 3: Bottom Right
      ];

      cards.forEach((card, i) => {
        const enterTime = i * (overlapDuration + holdDuration);

        // Bring current card in to CENTER
        tl.to(card, {
          x: "0vw",
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: overlapDuration,
          ease: "power3.out"
        }, enterTime);

        // Move to final corner position when the NEXT card enters
        // (Except for the very last card, which stays in the center)
        if (i < cards.length - 1) {
          const disperseTime = (i + 1) * (overlapDuration + holdDuration);
          const pos = positions[i];
          
          tl.to(card, {
            x: pos.x,
            y: pos.y,
            scale: pos.scale,
            opacity: 0.95, // Kept high for crystal clear visibility
            filter: "blur(0px)", // Removed blur completely
            duration: overlapDuration,
            ease: "power2.inOut"
          }, disperseTime);
        }
      });

      // Extra padding at the end before unpinning
      tl.to({}, { duration: 1 });

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    });

    // ── Mobile: 3D Depth Stack Layout ──
    mm.add("(max-width: 767px)", () => {
      // Set initial states
      gsap.set(cards, { x: 0, y: 200, opacity: 0, scale: 0.8, filter: "blur(10px)" });
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${cards.length * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      const overlapDuration = 1;
      const holdDuration = 0.5;

      cards.forEach((card, i) => {
        const startTime = i * (overlapDuration + holdDuration);

        // Bring current card in
        tl.to(card, {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          duration: overlapDuration,
          ease: "power3.out"
        }, startTime);

        // Push all previously active cards further back into the stack
        for (let j = 0; j < i; j++) {
           const depth = i - j; 
           tl.to(cards[j], {
              scale: 1 - (depth * 0.04), // 0.96, 0.92, 0.88...
              y: -(depth * 25), // Push up slightly so top edges stay visible
              x: 0, // Ensure it stays centered
              opacity: Math.max(0.2, 1 - (depth * 0.2)), 
              filter: `blur(${depth * 2}px)`, // Depth of field blur
              duration: overlapDuration,
              ease: "power3.out"
           }, startTime); 
        }
      });

      tl.to({}, { duration: 1 });

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center w-full h-dvh overflow-hidden bg-transparent text-brand-text"
    >
      {/* ── Decorative Background Text ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span
          className="font-display font-black leading-none text-white/[0.02]"
          style={{ fontSize: "clamp(6rem, 25vw, 25rem)", letterSpacing: "-0.05em" }}
        >
          SKILLS
        </span>
      </div>

      {/* Ambient dot-grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(191,219,254,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      
      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full pointer-events-none blur-[120px] opacity-10 z-0"
        style={{ background: "radial-gradient(ellipse, rgba(191,219,254,0.3) 0%, transparent 70%)" }}
      />

      {/* ── Foreground Heading ── */}
      <div className="absolute top-[12%] md:top-[15%] left-0 w-full flex flex-col items-center justify-center pointer-events-none z-20">
        <SplitText
          text="SKILLS"
          className="font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold text-white tracking-[0.12em] leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.06)]"
          delay={0}
          duration={0.8}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 50, scale: 0.9 }}
          to={{ opacity: 1, y: 0, scale: 1 }}
          threshold={0.5}
        />
        <div className="mt-4 h-px w-16 bg-gradient-to-r from-transparent via-brand-accent/70 to-transparent" />
        <p className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-accent/60">
          The tech ecosystem I thrive in
        </p>
      </div>

      {/* ── Central Cards Stacking Container ── */}
      <div 
        ref={containerRef} 
        className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-center h-full px-5 pt-[10vh] md:pt-[15vh]"
      >
        {categoriesData.map((cat, index) => (
          <div
            key={cat.name}
            ref={setCardRef(index)}
            className="absolute w-[90%] max-w-[700px] md:h-[320px] flex flex-col items-center justify-start pt-10 md:pt-4 p-8 md:px-12 rounded-[2rem] border border-white/10 md:border-transparent bg-[#0a0a0a]/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none shadow-[0_30px_60px_rgba(0,0,0,0.6)] md:shadow-none"
          >
            {/* Soft inner glow (hidden on desktop) */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none md:hidden" />
            
            <h3 className="font-display text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8 tracking-wide drop-shadow-lg flex items-center gap-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20 flex-shrink-0" />
              {cat.name}
              <div className="h-px w-8 bg-gradient-to-r from-white/20 to-transparent flex-shrink-0" />
            </h3>

            {/* Skill Cards Grid inside the Category Box */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-5 w-full max-w-[440px]">
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
        ))}
      </div>
    </section>
  );
}
