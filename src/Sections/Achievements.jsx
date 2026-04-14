import { useRef, useEffect } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../Components/SplitText";
import achievementsData from "../Components/AchievementsData.json";
import { HiTrophy, HiRocketLaunch, HiUsers, HiAcademicCap, HiStar, HiSparkles } from "react-icons/hi2";

// ─── Constants ──────────────────────────────────────────────────────────────
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const ICON_MAP = {
  trophy:    HiTrophy,
  rocket:    HiRocketLaunch,
  volunteer: HiUsers,
  academic:  HiAcademicCap,
  star:      HiStar,
  award:     HiSparkles,
};

// Per-card accent palette
const CARD_ACCENTS = [
  { glow: "rgba(251,191,36,0.10)",  border: "rgba(251,191,36,0.30)",  icon: "#FBB924" },
  { glow: "rgba(191,219,254,0.10)", border: "rgba(191,219,254,0.28)", icon: "#BFDBFE" },
  { glow: "rgba(134,239,172,0.10)", border: "rgba(134,239,172,0.25)", icon: "#86EFAC" },
  { glow: "rgba(216,180,254,0.10)", border: "rgba(216,180,254,0.25)", icon: "#D8B4FE" },
];

// ─── Component ───────────────────────────────────────────────────────────────
const Achievements = () => {
  const sectionRef = useRef(null);
  const innerRef   = useRef(null);
  const contentRef = useRef(null); // heading + grid — scroll as one unit
  const gridRef    = useRef(null);
  const cardRefs   = useRef([]);

  const setCardRef = (i) => (el) => { cardRefs.current[i] = el; };

  // ── GSAP ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const inner   = innerRef.current;
    const content = contentRef.current;
    const grid    = gridRef.current;
    if (!section || !inner || !content || !grid) return;

    const cards = cardRefs.current.filter(Boolean);

    gsap.set(inner, { autoAlpha: 0, scale: 0.96, ...(IS_MOBILE ? {} : { filter: "blur(12px)" }) });
    gsap.set(cards, { autoAlpha: 0, y: 32 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger:            section,
        start:              "top top",
        end:                "+=260%",
        pin:                true,
        scrub:              1,
        anticipatePin:      1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          gsap.set(inner,   { autoAlpha: 0, scale: 0.96, y: 0, clearProps: "filter" });
          gsap.set(cards,   { autoAlpha: 0, y: 32 });
          gsap.set(content, { y: 0 });
        },
      },
    });

    // Phase 1: Section entrance — heading is perfectly centered
    masterTl.to(inner, {
      autoAlpha: 1, scale: 1,
      ...(IS_MOBILE ? {} : { filter: "blur(0px)" }),
      duration: 0.8, ease: "power3.out",
    });

    // Phase 2: Achievement cards stagger in (heading visible at top, cards below)
    masterTl.fromTo(cards,
      { autoAlpha: 0, y: 32 },
      { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.65, ease: "power2.out" },
      "-=0.3"
    );

    // Phase 3: Hold — user reads all cards
    masterTl.to({}, { duration: 0.6 });

    // Phase 4: Scroll contentRef (heading + grid) upward together.
    // Heading exits top, cards remain readable. Top-edge-fade masks the transition.
    masterTl.to(content, {
      y: () => -Math.max(0, content.scrollHeight - window.innerHeight + 40),
      ease: "none", duration: 1.5,
    });

    // Phase 5: Hold at full scroll
    masterTl.to({}, { duration: 0.4 });

    // Phase 6: Cinematic exit
    masterTl.to(inner, {
      autoAlpha: 0, scale: 0.9,
      ...(IS_MOBILE ? {} : { filter: "blur(10px)" }),
      duration: 0.8, ease: "power2.in",
    });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative h-dvh w-full overflow-hidden text-brand-text bg-transparent"
    >
      {/* Ambient dot-grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(rgba(191,219,254,0.07) 1px, transparent 1px)",
          backgroundSize:  "28px 28px",
        }}
      />

      {/* Decorative watermark */}
      <span
        aria-hidden="true"
        className="absolute right-[-2vw] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none z-0"
        style={{ fontSize: "clamp(7rem,20vw,18rem)", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.022)" }}
      >
        WINS
      </span>

      {/* Top edge fade */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-28 z-20 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #050508 0%, transparent 100%)" }}
      />

      {/* ── GSAP entrance / exit wrapper ── */}
      <div ref={innerRef} className="absolute inset-0 z-10 overflow-hidden">

        {/* ── contentRef: heading + grid scroll as one unit ── */}
        <div ref={contentRef} className="flex flex-col will-change-transform">

          {/* ══ Heading — at the top, same pattern as Skills section ══ */}
          <div className="flex-none text-center pt-20 md:pt-24 pb-4 md:pb-6 px-6">
            <SplitText
              text="ACHIEVEMENTS"
              className="font-display text-[clamp(2.4rem,7vw,6rem)] font-bold text-white tracking-widest leading-none"
              delay={0}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.9 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.5}
            />
            <div className="mt-3 h-px w-14 bg-gradient-to-r from-brand-accent/70 to-transparent mx-auto" />
            <p className="mt-2.5 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-accent/60 opacity-70">
              Recognitions, milestones &amp; technical wins
            </p>
          </div>

          {/* ══ Cards Grid — flows below the heading viewport ══ */}
          <div
            ref={gridRef}
            className="px-5 sm:px-8 md:px-12 lg:px-20 pb-28"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 max-w-7xl mx-auto">
              {(achievementsData ?? []).map((item, index) => {
                const Icon   = ICON_MAP[item.iconName] || HiSparkles;
                const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];

                return (
                  <div
                    key={index}
                    ref={setCardRef(index)}
                    className="group relative flex flex-col gap-4 p-6 sm:p-8 rounded-[2rem] overflow-hidden border border-white/10 bg-brand-surface/40 backdrop-blur-xl transition-colors duration-500 hover:border-white/[0.18]"
                    style={{ willChange: "transform, opacity" }}
                  >
                    {/* Per-card top accent hairline */}
                    <div
                      className="absolute top-0 left-10 right-10 h-px pointer-events-none"
                      style={{ background: `linear-gradient(to right, transparent, ${accent.border}, transparent)` }}
                    />

                    {/* Circuit grid watermark */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
                        backgroundSize:  "36px 36px",
                      }}
                    />

                    {/* Corner glow on hover */}
                    <div
                      className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-[56px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      style={{ background: accent.glow }}
                    />

                    {/* Card content */}
                    <div className="relative z-10 flex flex-col gap-4">

                      {/* Row 1: Icon + meta */}
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-xl border shrink-0 transition-transform duration-500 group-hover:scale-110"
                          style={{ background: accent.glow, borderColor: accent.border }}
                        >
                          <Icon size={IS_MOBILE ? 20 : 22} style={{ color: accent.icon }} />
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/35">
                            {item.date}
                          </span>
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full border font-mono text-[8px] tracking-[0.18em] uppercase"
                            style={{ borderColor: accent.border, color: accent.icon, background: accent.glow }}
                          >
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Row 2: Title */}
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug">
                        {item.title}
                      </h3>

                      {/* Divider */}
                      <div className="h-px bg-white/[0.07]" />

                      {/* Row 3: Description */}
                      <p className="font-body text-[13px] sm:text-sm leading-relaxed text-brand-muted opacity-80 group-hover:opacity-100 transition-opacity duration-300 line-clamp-4 md:line-clamp-none">
                        {item.description}
                      </p>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Achievements;
