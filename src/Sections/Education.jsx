import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap }  from "../lib/gsapScroll";

// ─── Constants ──────────────────────────────────────────────────────────────
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Data ───────────────────────────────────────────────────────────────────
const educationData = [
  {
    institution: "Datta Meghe College of Eng.",
    degree:      "B.Tech Computer Engineering",
    details:     "GPA: 8.365 / 10",
    years:       "2023 – Present",
    active:      true,
  },
  {
    institution: "Abhishek Vidyalayam",
    degree:      "Classes 11–12, HSC",
    details:     "Science Stream",
    years:       "2021 – 2023",
    active:      false,
  },
  {
    institution: "Elpro International School",
    degree:      "Classes 7–10, CBSE",
    details:     "89%",
    years:       "2017 – 2021",
    active:      false,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
const Education = () => {
  const sectionRef  = useRef(null);
  const innerRef    = useRef(null);
  const headingRef  = useRef(null);
  const cardsRef    = useRef([]);
  const textRefs    = useRef([]);

  const setCardRef = (i) => (el) => { cardsRef.current[i] = el; };
  const setTextRef = (i) => (el) => { textRefs.current[i] = el; };

  // ── GSAP deck animation ──────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);
    const texts = textRefs.current.filter(Boolean);

    // Only clear GSAP-owned transforms — preserves React inline zIndex / willChange
    gsap.set(cards, { clearProps: "y,opacity,scale,filter" });

    // Card 0 starts visible; the rest wait below the fold (clipped by section overflow-hidden)
    gsap.set(cards[0], { y: 0, opacity: 1, scale: 1 });
    gsap.set(cards.slice(1), {
      y: "70vh",
      opacity: 0,
      scale: 0.85,
      ...(IS_MOBILE ? {} : { filter: "blur(12px)" }),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:          section,
        start:            "top top",
        end:              `+=${cards.length * 80}%`,
        pin:              true,
        scrub:            1.5,
        anticipatePin:    1,
        invalidateOnRefresh: true,
      },
    });

    // Left-column text entrance (desktop only — empty array on mobile, safe)
    tl.fromTo(
      texts,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" },
      0
    );

    // 3-D deck stacking — .fromTo() throughout so invalidateOnRefresh can't corrupt state
    cards.forEach((card, i) => {
      if (i === 0) return;

      const stepTl = gsap.timeline();

      // Push every card already on-screen deeper into the deck
      for (let j = 0; j < i; j++) {
        const prevDepth = i - 1 - j;
        const newDepth  = i - j;

        stepTl.fromTo(
          cards[j],
          {
            y:       -prevDepth * 45,
            scale:    1 - prevDepth * 0.06,
            opacity:  1 - prevDepth * 0.5,
            ...(IS_MOBILE ? {} : { filter: `blur(${prevDepth * 5}px)` }),
          },
          {
            y:       -newDepth * 45,
            scale:    1 - newDepth * 0.06,
            opacity:  1 - newDepth * 0.5,
            ...(IS_MOBILE ? {} : { filter: `blur(${newDepth * 5}px)` }),
            duration: 1,
            ease:     "power2.inOut",
          },
          0
        );
      }

      // Slide the incoming card into the front position
      stepTl.fromTo(
        card,
        {
          y:       "70vh",
          opacity: 0,
          scale:   0.85,
          ...(IS_MOBILE ? {} : { filter: "blur(12px)" }),
        },
        {
          y:       0,
          opacity: 1,
          scale:   1,
          ...(IS_MOBILE ? {} : { filter: "blur(0px)" }),
          duration: 1.1,
          ease:     "power3.out",
        },
        0
      );

      tl.add(stepTl, "+=0.2");
    });

    tl.to({}, { duration: 0.5 });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
      // Release stale compositor hints so the GPU can reclaim VRAM
      gsap.set(cards, { clearProps: "willChange" });
    };
  }, []);

  // ── JSX ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative flex items-center justify-center w-full h-dvh min-h-[640px] overflow-hidden text-brand-text px-5 sm:px-8 md:px-12 lg:px-20"
    >
      {/* Ambient dot-grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(191,219,254,0.07) 1px, transparent 1px)",
          backgroundSize:  "28px 28px",
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
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-16 xl:gap-24 pt-16 sm:pt-20 lg:pt-0"
      >

        {/* ══════════ LEFT: Heading + Stats + Copy ══════════ */}
        <div className="w-full lg:w-[42%] flex flex-col items-start gap-4 sm:gap-5 lg:gap-7 shrink-0">

          {/* Heading */}
          <div ref={headingRef}>
            <SplitText
              text="EDUCATION"
              className="font-display text-[clamp(2.6rem,9vw,6rem)] font-bold text-white tracking-[0.12em] leading-none"
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
              The academic path behind the work
            </p>
          </div>

          {/* Stats — visible on all screens */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-bold text-white leading-none">03</span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-brand-accent/55 mt-1.5">Institutions</span>
            </div>
            <div className="w-px h-9 bg-white/10" />
            <div className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-bold text-white leading-none">7+</span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-brand-accent/55 mt-1.5">Years</span>
            </div>
            <div className="w-px h-9 bg-white/10" />
            <div className="flex flex-col">
              <span className="font-display text-3xl sm:text-4xl font-bold text-white leading-none">01</span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] uppercase text-brand-accent/55 mt-1.5">Ongoing</span>
            </div>
          </div>

          {/* Body copy — desktop only; refs still exist so GSAP works, just hidden on mobile */}
          <div className="hidden lg:flex flex-col gap-4 text-brand-muted text-base leading-relaxed font-body">
            <p ref={setTextRef(0)}>
              Most of what I built came from curiosity — but the academic years gave me
              the structured thinking to know <em>why</em> things work, not just that they do.
            </p>
            <p ref={setTextRef(1)}>
              From CBSE to HSC to engineering, each phase compounded: discipline, first
              principles, and now — software development at production scale.
            </p>
          </div>

          {/* Watermark label — desktop decorative */}
          <p className="hidden lg:block font-mono text-[8px] tracking-[0.4em] uppercase text-white/8 select-none mt-2">
            Academic Record // Verified
          </p>
        </div>

        {/* ══════════ RIGHT: 3D Stacked Cards ══════════ */}
        <div
          className="w-full lg:w-[58%] relative h-[260px] sm:h-[320px] md:h-[370px] lg:h-[420px] shrink-0 mt-2 sm:mt-4 lg:mt-0"
          style={{ perspective: "1200px", willChange: "transform" }}
        >
          {educationData.map((item, index) => (
            <div
              key={index}
              ref={setCardRef(index)}
              className="absolute inset-0 flex flex-col justify-between p-5 sm:p-7 md:p-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-brand-surface/40 backdrop-blur-xl"
              style={{
                zIndex:          index + 1,
                transformOrigin: "top center",
                willChange:      "transform, opacity, filter",
              }}
            >
              {/* Top accent hairline */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent pointer-events-none" />

              {/* Subtle circuit grid */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              {/* Card content */}
              <div className="relative z-10 flex flex-col h-full gap-0">

                {/* ── TOP: institution + year ── */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-auto">
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Active pulse / inactive dot */}
                    <span className="relative flex h-2 w-2 shrink-0">
                      {item.active && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-50" />
                      )}
                      <span
                        className="relative inline-flex h-2 w-2 rounded-full"
                        style={{
                          background: item.active
                            ? "rgb(191,219,254)"
                            : "rgba(191,219,254,0.25)",
                          boxShadow: item.active
                            ? "0 0 8px rgba(191,219,254,0.8)"
                            : "none",
                        }}
                      />
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-white/45 truncate">
                      {item.institution}
                    </span>
                  </div>
                  <span className="flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/[0.06] font-mono text-[8px] sm:text-[10px] tracking-[0.18em] text-brand-accent/70 whitespace-nowrap">
                    {item.years}
                  </span>
                </div>

                {/* ── MIDDLE: Degree — hero text ── */}
                <p className="font-display text-xl sm:text-2xl md:text-[1.7rem] lg:text-3xl font-bold text-white leading-snug my-3 sm:my-4">
                  {item.degree}
                </p>

                {/* ── BOTTOM: Divider + result ── */}
                <div>
                  <div className="h-px w-full bg-white/[0.07] mb-3 sm:mb-4" />
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-brand-accent/45">
                      Result
                    </span>
                    <span className="font-mono text-xs sm:text-sm font-semibold text-white/55">
                      {item.details}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
