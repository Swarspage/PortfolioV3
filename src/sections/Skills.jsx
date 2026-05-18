import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../components/SplitText";

// ─── Data ──────────────────────────────────────────────────────────────────────
import SKILLS_DATA from "../data/SkillsData.json";

const icons = import.meta.glob("../assets/*.{webp,svg}", {
  eager: true,
  import: "default",
});

const SKILLS = SKILLS_DATA.map((skill) => ({
  ...skill,
  img: icons[`../assets/${skill.icon}`] || "",
}));

// ─── Category visual config ───────────────────────────────────────────────────
// orbitR   — CSS length (vmin) for the ring radius; auto-scales tablet↔desktop
// speed    — seconds per full orbit; inner rings faster (realistic physics)
// angleOff — degree offset so planets from different categories don't cluster
const CAT_CONFIG = {
  Frontend:  { color: "#38BDF8", orbitR: "26vmin", speed: 52, angleOff: 0   },
  Backend:   { color: "#4ADE80", orbitR: "20vmin", speed: 41, angleOff: 30  },
  Tools:     { color: "#FB923C", orbitR: "14.5vmin", speed: 30, angleOff: 18  },
  Database:  { color: "#A78BFA", orbitR: "9.5vmin", speed: 20, angleOff: 0   },
  Languages: { color: "#FB7185", orbitR: "5.5vmin", speed: 14, angleOff: 90  },
};

// Category order: outermost → innermost
const CATEGORIES = ["Frontend", "Backend", "Tools", "Database", "Languages"];

// Pre-compute per-skill startDeg so it's stable across renders
const categoriesData = CATEGORIES.map((cat) => {
  const cfg = CAT_CONFIG[cat];
  const skills = SKILLS.filter((s) => s.category === cat);
  return {
    name: cat,
    ...cfg,
    skills: skills.map((skill, i) => ({
      ...skill,
      startDeg: (360 / skills.length) * i + cfg.angleOff,
    })),
  };
});

// ─── SkillChip ─────────────────────────────────────────────────────────────────
// variant="planet" → compact icon-only circle, no hover (used in orrery)
// variant="chip"   → full icon + label card (used in mobile accordion)
function SkillChip({ skill, color, variant = "chip" }) {
  const [hovered, setHovered] = useState(false);

  // ── Planet variant — static circle, name tooltip on hover ───────────────────
  if (variant === "planet") {
    return (
      <div
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        style={{
          position: "relative",
          width:  "clamp(37px, 5.1vmin, 51px)",
          height: "clamp(37px, 5.1vmin, 51px)",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 1px 6px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "auto",
          userSelect: "none",
          flexShrink: 0,
          cursor: "default",
        }}
      >
        <img
          src={skill.img}
          alt={skill.skill}
          draggable={false}
          style={{
            width:  "clamp(20px, 2.75vmin, 29px)",
            height: "clamp(20px, 2.75vmin, 29px)",
            objectFit: "contain",
            filter: "opacity(0.85)",
          }}
        />

        {/* Name tooltip — floats above, circle stays fully static */}
        {hovered && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(8,8,14,0.92)",
              border: `1px solid ${color}50`,
              borderRadius: 7,
              padding: "3px 9px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 200,
              boxShadow: `0 4px 16px rgba(0,0,0,0.5)`,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: color,
              }}
            >
              {skill.skill}
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── Chip variant — icon + label card for mobile accordion ───────────────────
  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        width: 72,
        height: 72,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        borderRadius: 14,
        background: hovered ? `${color}15` : "rgba(255,255,255,0.035)",
        border: `1px solid ${hovered ? color + "70" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: hovered
          ? `0 0 22px ${color}35, 0 4px 18px rgba(0,0,0,0.35)`
          : "0 2px 8px rgba(0,0,0,0.2)",
        transform: hovered ? "scale(1.1)" : "scale(1)",
        transition: "background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease",
        cursor: "default",
        pointerEvents: "auto",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <img
        src={skill.img}
        alt={skill.skill}
        draggable={false}
        style={{
          width: 28,
          height: 28,
          objectFit: "contain",
          filter: hovered ? `drop-shadow(0 0 7px ${color})` : "opacity(0.72)",
          transition: "filter 0.25s ease",
        }}
      />
      <span
        style={{
          fontSize: "8px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          fontFamily: "var(--font-body)",
          fontWeight: 500,
          textAlign: "center",
          lineHeight: 1.25,
          wordBreak: "break-word",
          maxWidth: 60,
          color: hovered ? color : "rgba(255,255,255,0.5)",
          transition: "color 0.25s ease",
        }}
      >
        {skill.skill}
      </span>
    </div>
  );
}

// ─── Planet ─────────────────────────────────────────────────────────────────────
// A zero-size anchor div that rotates around the ring center.
// `animationDelay` is set to a NEGATIVE value so the planet appears at its
// startDeg immediately — no waiting for the animation to "wind up".
function Planet({ skill, startDeg, speed, orbitR, color }) {
  // negative delay = start mid-animation at the correct angle
  const delay = `-${((startDeg / 360) * speed).toFixed(2)}s`;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        animation: `orbitRotate ${speed}s linear infinite`,
        animationDelay: delay,
        pointerEvents: "none",
      }}
    >
      {/*
        Counter-rotate the chip so it always faces upright.
        var(--r) is the orbit radius — a constant, not interpolated, so CSS
        custom property substitution works correctly here.
      */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          "--r": orbitR,
          animation: `counterRotate ${speed}s linear infinite`,
          animationDelay: delay,
          pointerEvents: "none",
        }}
      >
        <SkillChip skill={skill} color={color} variant="planet" />
      </div>
    </div>
  );
}

// ─── CenterOrb ──────────────────────────────────────────────────────────────────
function CenterOrb() {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
    >
      <div
        style={{
          width: "clamp(60px, 8vmin, 88px)",
          height: "clamp(60px, 8vmin, 88px)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(191,219,254,0.32) 0%, rgba(191,219,254,0.06) 55%, transparent 100%)",
          border: "1px solid rgba(191,219,254,0.22)",
          animation: "orbPulse 2.8s ease-in-out infinite",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(10px, 1.5vmin, 16px)",
            color: "rgba(191,219,254,0.92)",
            letterSpacing: "0.12em",
            textShadow: "0 0 12px rgba(191,219,254,0.9)",
            userSelect: "none",
          }}
        >
          Swar
        </span>
      </div>
    </div>
  );
}

// ─── OrbitRing ──────────────────────────────────────────────────────────────────
// forwardRef so the parent OrreryDesktop can pass refs for GSAP hover animations.
const OrbitRing = forwardRef(function OrbitRing(
  { cat },
  ref
) {
  const { name, color, orbitR, speed, skills } = cat;
  const diameter = `calc(${orbitR} * 2)`;

  return (
    // Zero-size anchor at center — GSAP scales this, which scales all children
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 0,
        height: 0,
        transformOrigin: "center center",
      }}
    >
      {/* Visible ring ellipse — purely decorative */}
      <div
        style={{
          position: "absolute",
          width: diameter,
          height: diameter,
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `1px dashed ${color}30`,
          boxShadow: `0 0 18px ${color}12 inset, 0 0 6px ${color}08`,
          pointerEvents: "none",
        }}
      />

      {/* Category label — positioned at 12 o'clock of the ring */}
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: `calc(-${orbitR} - 22px)`,
          transform: "translateX(-50%)",
          fontSize: "clamp(7px, 1vmin, 10px)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          color: color,
          opacity: 0.7,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {name}
      </span>

      {/* Planet chips — orbit around center */}
      {skills.map((skill) => (
        <Planet
          key={skill.skill}
          skill={skill}
          startDeg={skill.startDeg}
          speed={speed}
          orbitR={orbitR}
          color={color}
        />
      ))}
    </div>
  );
});

// ─── OrreryDesktop ──────────────────────────────────────────────────────────────
// Rendered on ≥ 768px. Uses vmin sizing so it scales naturally from tablet → 4K.
function OrreryDesktop() {
  const orreryRef = useRef(null);
  const ringsRef = useRef([]);

  const setRingRef = useCallback(
    (i) => (el) => {
      ringsRef.current[i] = el;
    },
    []
  );

  // ── One-shot scroll entry: rings scale in staggered inside → outside ────────
  useEffect(() => {
    const rings = ringsRef.current.filter(Boolean);
    if (!rings.length || !orreryRef.current) return;

    gsap.set(rings, { scale: 0, opacity: 0 });

    const entry = gsap.to(rings, {
      scale: 1,
      opacity: 1,
      duration: 0.85,
      stagger: { each: 0.1, from: "end" }, // innermost ring first
      ease: "back.out(1.3)",
      scrollTrigger: {
        trigger: orreryRef.current,
        start: "top 68%",
        once: true,
      },
    });

    return () => {
      entry.scrollTrigger?.kill();
      entry.kill();
    };
  }, []);

  return (
    <div
      ref={orreryRef}
      className="relative flex items-center justify-center"
      // Container is just big enough to contain the outermost ring
      style={{ width: "min(56vmin, 620px)", height: "min(56vmin, 620px)" }}
    >
      <CenterOrb />
      {categoriesData.map((cat, i) => (
        <OrbitRing
          key={cat.name}
          cat={cat}
          ref={setRingRef(i)}
        />
      ))}
    </div>
  );
}

// ─── CategoryLegend ─────────────────────────────────────────────────────────────
// Color-coded list of rings + individual skill names shown in left column on desktop.
function CategoryLegend() {
  return (
    <div className="flex flex-col gap-5 mt-2">
      {categoriesData.map((cat) => (
        <div key={cat.name}>
          {/* Category header row */}
          <div className="flex items-center gap-2 mb-2">
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: cat.color,
                boxShadow: `0 0 6px ${cat.color}cc`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: 9,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: cat.color,
                fontWeight: 600,
                opacity: 0.85,
              }}
            >
              {cat.name}
            </span>
          </div>

          {/* Individual skill names — colored, inline */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 pl-4">
            {cat.skills.map((skill) => (
              <span
                key={skill.skill}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 11,
                  color: cat.color,
                  opacity: 0.65,
                  letterSpacing: "0.04em",
                  lineHeight: 1.5,
                }}
              >
                {skill.skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MobileAccordion ────────────────────────────────────────────────────────────
// Rendered on < 768px. Frontend is open by default (best first impression).
// Pure CSS max-height transition — zero JS, zero layout thrash.
function MobileAccordion() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (i) =>
    setOpenIdx((prev) => (prev === i ? -1 : i));

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3 px-4 pointer-events-auto">
      {categoriesData.map((cat, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={cat.name}
            style={{
              borderRadius: 18,
              border: `1px solid ${isOpen ? cat.color + "45" : "rgba(255,255,255,0.07)"}`,
              background: "rgba(255,255,255,0.025)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              overflow: "hidden",
              transition: "border-color 0.3s ease",
            }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-5 py-4 pointer-events-auto"
              style={{
                borderLeft: `3px solid ${isOpen ? cat.color : "transparent"}`,
                transition: "border-color 0.3s ease",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <div className="flex items-center gap-3">
                {/* Category color dot */}
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: cat.color,
                    boxShadow: `0 0 8px ${cat.color}cc`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(15px, 4.5vw, 20px)",
                    color: isOpen ? cat.color : "rgba(255,255,255,0.82)",
                    letterSpacing: "0.1em",
                    transition: "color 0.3s ease",
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.3)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cat.skills.length}
                </span>
              </div>

              {/* Chevron */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{
                  color: cat.color,
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
                  flexShrink: 0,
                }}
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Expandable skill grid */}
            <div
              style={{
                maxHeight: isOpen ? "600px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.42s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                className="flex flex-wrap justify-center gap-3 px-5 pb-6 pt-2"
              >
                {cat.skills.map((skill) => (
                  <SkillChip
                    key={skill.skill}
                    skill={skill}
                    color={cat.color}
                    size="md"
                  />
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────
export default function Skills() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col md:flex-row items-center w-full min-h-dvh overflow-hidden bg-transparent text-brand-text px-5 sm:px-8 md:px-12 lg:px-20 py-20 md:py-0"
    >
      {/* ── Ambient dot-grid ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(191,219,254,0.07) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Ambient glow — shifted right on desktop ── */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[30%] -translate-y-1/2 w-[50vw] h-[50vh] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse, rgba(191,219,254,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Decorative ghost text ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 select-none"
      >
        <span
          className="font-display font-black leading-none text-white/[0.015]"
          style={{ fontSize: "clamp(6rem, 22vw, 22rem)", letterSpacing: "-0.05em" }}
        >
          SKILLS
        </span>
      </div>

      {/* ════════ Inner layout wrapper — matches Experience/Education pattern ════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-stretch gap-0 h-full md:min-h-dvh">

        {/* ════════ LEFT COLUMN — heading + legend ════════ */}
        <div className="relative z-20 flex flex-col justify-center items-start w-full md:w-[42%] shrink-0 pt-4 pb-10 md:py-0 gap-5 pointer-events-none">
          {/* Heading */}
          <SplitText
            text="SKILLS"
            className="font-display text-[clamp(3rem,8vw,6rem)] font-bold text-white tracking-[0.12em] leading-none drop-shadow-[0_0_40px_rgba(255,255,255,0.06)]"
            delay={0}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.9 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.5}
          />

          {/* Accent line */}
          <div className="h-px w-12 bg-gradient-to-r from-brand-accent/70 to-transparent" />

          {/* Tagline */}
          <p className="font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-accent/60">
            The tech ecosystem I thrive in
          </p>

          {/* Category legend with skill names — desktop only */}
          <div className="hidden md:block w-full max-w-[320px] mt-2">
            <CategoryLegend />
          </div>
        </div>

        {/* ════════ RIGHT COLUMN — orrery (desktop + tablet) ════════ */}
        <div className="hidden md:flex flex-1 items-center justify-center relative z-10 overflow-hidden">
          <OrreryDesktop />
        </div>

        {/* ════════ MOBILE — accordion ════════ */}
        <div className="md:hidden relative z-10 w-full pb-16">
          <MobileAccordion />
        </div>

      </div>
    </section>

  );
}

