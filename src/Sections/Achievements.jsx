import { useRef, useEffect, useState } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../Components/SplitText";
import CardSwap, { Card } from "../Components/CardSwap";

// ─── Asset imports ──────────────────────────────────────────────────────────
import codeAThon from "../assets/Achievements/CodeAThonehackthon.webp";
import codeAThonTeam from "../assets/Achievements/codeAThon2.0withTeam.webp";
import soloInternHOD from "../assets/Achievements/soloInternHODPic.webp";
import internGroup from "../assets/Achievements/internshipGroupPhoto.webp";
import internCert from "../assets/Achievements/InternCertificate.webp";
import LOA from "../assets/Achievements/LOA.webp";
import letterOfAppreciation from "../assets/Achievements/LetterofAppreciationInternship.webp";
import ttDoubles from "../assets/Achievements/Tabletennisdoubles2ndprize.webp";

// ─── Constants ──────────────────────────────────────────────────────────────
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Achievement Data ───────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    img: codeAThon,
    title: "Top 8 Finalist · Code-A-Thon 2.0",
    category: "Competition",
    date: "2026",
    description:
      "Out of 100+ submissions, Singularity placed Top 8. Built over 1.5 months — not a weekend sprint — it pulled real-time telemetry from NASA, SpaceX, and ISRO into a single mission control. Orbital mechanics, 3D globe rendering, AI integration, live ISS tracking.",
    accent: "#FBB924",
  },
  {
    img: codeAThonTeam,
    title: "The Team Behind Singularity",
    category: "Competition",
    date: "2026",
    description:
      "Code-A-Thon 2.0 wasn't a solo mission. The team that built Singularity — each member owning a critical subsystem. From backend architecture to 3D rendering, the project came together through late nights and relentless iteration.",
    accent: "#BFDBFE",
  },
  {
    img: soloInternHOD,
    title: "Shipped to 500+ Users · SIMS",
    category: "Deployment",
    date: "2026",
    description:
      "Most portfolio projects live on localhost. SIMS lives at a college domain and gets used by over 500 students every day. Built during my internship under the HOD — I owned the entire frontend. Seeing something you built actually get used is a different kind of validation.",
    accent: "#86EFAC",
  },
  {
    img: internGroup,
    title: "Internship · Full Dev Team",
    category: "Deployment",
    date: "2026",
    description:
      "The full development team behind the Student Information Management System. A real-world deployment serving an entire college — built from scratch during a structured internship program under direct mentorship of the Head of Department.",
    accent: "#D8B4FE",
  },
  {
    img: internCert,
    title: "Internship Certificate · DMCE",
    category: "Recognition",
    date: "2026",
    description:
      "Official internship completion certificate from Datta Meghe College of Engineering. Formal recognition of the full-stack development work and contribution to the SIMS platform deployed across the institution.",
    accent: "#BFDBFE",
  },
  {
    img: LOA,
    title: "Letter of Appreciation",
    category: "Recognition",
    date: "2026",
    description:
      "Received an official Letter of Appreciation for outstanding contribution during the internship. A formal acknowledgment from the institution for the quality and impact of the development work delivered.",
    accent: "#FBB924",
  },
  {
    img: letterOfAppreciation,
    title: "Official Certificate · TT Doubles",
    category: "Sports",
    date: "2025",
    description:
      "The official certificate for securing 2nd place in the DMCE Milestone 2025 Table Tennis Doubles. A reminder that agility and strategy apply just as much on the table as they do in code.",
    accent: "#86EFAC",
  },
  {
    img: ttDoubles,
    title: "2nd Place · Table Tennis Doubles",
    category: "Sports",
    date: "2025",
    description:
      "Partnered with a senior and competed in the DMCE Milestone 2025 Table Tennis Doubles tournament. Fought our way to the finals and secured 2nd place — as a first-year in Sem 2. Proof that competitive drive isn't limited to a keyboard.",
    accent: "#D8B4FE",
  },
];

// Per-card accent palette derived from achievement data
const ACCENT_COLORS = {
  "#FBB924": { glow: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)", text: "#FBB924" },
  "#BFDBFE": { glow: "rgba(191,219,254,0.12)", border: "rgba(191,219,254,0.30)", text: "#BFDBFE" },
  "#86EFAC": { glow: "rgba(134,239,172,0.12)", border: "rgba(134,239,172,0.30)", text: "#86EFAC" },
  "#D8B4FE": { glow: "rgba(216,180,254,0.12)", border: "rgba(216,180,254,0.30)", text: "#D8B4FE" },
};

// ─── Component ───────────────────────────────────────────────────────────────
const Achievements = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const infoPanelRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches
  );
  const [isLaptop, setIsLaptop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 1025px) and (max-width: 1440px)").matches
  );

  // ── Responsive listener ────────────────────────────────────────────────
  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 1024px)");
    const mqLaptop = window.matchMedia("(min-width: 1025px) and (max-width: 1440px)");
    
    const handlerMobile = (e) => setIsMobile(e.matches);
    const handlerLaptop = (e) => setIsLaptop(e.matches);
    
    mqMobile.addEventListener("change", handlerMobile);
    mqLaptop.addEventListener("change", handlerLaptop);
    
    return () => {
      mqMobile.removeEventListener("change", handlerMobile);
      mqLaptop.removeEventListener("change", handlerLaptop);
    };
  }, []);

  // ── GSAP entrance / exit ───────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    gsap.set(inner, { autoAlpha: 0, scale: 0.96, ...(IS_MOBILE ? {} : { filter: "blur(12px)" }) });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=180%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          gsap.set(inner, { autoAlpha: 0, scale: 0.96, y: 0, clearProps: "filter" });
        },
      },
    });

    // Phase 1: Entrance
    masterTl.to(inner, {
      autoAlpha: 1, scale: 1,
      ...(IS_MOBILE ? {} : { filter: "blur(0px)" }),
      duration: 0.8, ease: "power3.out",
    });

    // Phase 2: Hold — user watches cards cycle and reads info
    masterTl.to({}, { duration: 1.8 });

    // Phase 3: Cinematic exit
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

  // ── Derived state ─────────────────────────────────────────────────────
  const active = ACHIEVEMENTS[activeIndex] || ACHIEVEMENTS[0];
  const accentStyle = ACCENT_COLORS[active.accent] || ACCENT_COLORS["#BFDBFE"];

  // CardSwap sizing — explicitly adjusted for laptops to prevent clipping
  const cardW = isMobile ? 260 : isLaptop ? 340 : 580;
  const cardH = isMobile ? 180 : isLaptop ? 240 : 450;
  const cardDist = isMobile ? 30 : isLaptop ? 20 : 60;
  const vertDist = isMobile ? 12 : isLaptop ? 15 : 30;

  // ── JSX ────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative h-dvh w-full overflow-hidden text-brand-text bg-transparent"
    >
      {/* Decorative watermark */}
      <span
        aria-hidden="true"
        className="absolute right-[-2vw] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none z-0"
        style={{ fontSize: "clamp(7rem,20vw,18rem)", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.022)" }}
      >
        WINS
      </span>

      {/* ── GSAP entrance / exit wrapper ── */}
      <div
        ref={innerRef}
        className="absolute inset-0 z-10 flex flex-col"
      >
        <div className="w-full px-4 sm:px-8 pt-20 md:pt-28 lg:pt-32 pb-2 md:pb-8 text-center relative z-20">
          <SplitText
            text="ACHIEVEMENTS"
            className="font-display text-[clamp(2.2rem,7vw,5rem)] font-bold text-white tracking-widest leading-none"
            delay={0}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.9 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.5}
          />
          <div className="mt-3 h-px w-14 bg-gradient-to-r from-transparent via-brand-accent/70 to-transparent mx-auto" />
          <p className="mt-2.5 font-mono text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-brand-accent/60 opacity-70">
            Recognitions, milestones &amp; technical wins
          </p>
        </div>

        {/* ── Main Content: LEFT = info, RIGHT = CardSwap ── */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 px-4 sm:px-8 lg:px-16 xl:px-20 max-w-[1400px] mx-auto w-full pb-4 lg:pb-12">

          {/* ═══ LEFT: Info Panel ═══ */}
          <div className="w-full lg:w-[380px] xl:w-[480px] 2xl:w-[540px] flex-shrink-0 flex flex-col order-2 lg:order-1 pt-4 lg:pt-0">
            <div
              ref={infoPanelRef}
              className="w-full"
            >
              <div
                className="relative rounded-[2rem] p-5 sm:p-8 overflow-hidden border border-white/10 bg-brand-surface/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] lg:min-h-[350px] xl:min-h-[450px] 2xl:min-h-[500px] flex flex-col justify-center"
              >
                {/* Top accent hairline */}
                <div
                  className="absolute top-0 left-10 right-10 h-px pointer-events-none transition-all duration-700"
                  style={{ background: `linear-gradient(to right, transparent, ${accentStyle.border}, transparent)` }}
                />

                {/* Corner glow */}
                <div
                  className="absolute -bottom-8 -right-8 w-36 h-36 rounded-full blur-[56px] pointer-events-none transition-all duration-700"
                  style={{ background: accentStyle.glow }}
                />

                <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
                  {/* Category + Date */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className="inline-flex items-center px-3 py-1 rounded-full border font-mono text-[8px] tracking-[0.2em] uppercase transition-all duration-500"
                      style={{ borderColor: accentStyle.border, color: accentStyle.text, background: accentStyle.glow }}
                    >
                      {active.category}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/35">
                      {active.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    key={activeIndex}
                    className="font-display text-xl sm:text-2xl font-bold text-white leading-snug animate-fade-in"
                  >
                    {active.title}
                  </h3>

                  {/* Divider */}
                  <div className="h-px bg-white/[0.07]" />

                  {/* Description */}
                  <p
                    key={`desc-${activeIndex}`}
                    className="font-body text-[13px] sm:text-sm leading-relaxed text-brand-muted opacity-80 animate-fade-in"
                  >
                    {active.description}
                  </p>

                  {/* Card counter */}
                  <div className="flex items-center gap-2 pt-2">
                    {ACHIEVEMENTS.map((_, i) => (
                      <div
                        key={i}
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                          width: i === activeIndex ? 24 : 8,
                          background: i === activeIndex ? accentStyle.text : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* end info panel */}
          </div>
          {/* end LEFT column */}

          {/* ═══ RIGHT: CardSwap Area ═══ */}
          <div
            className="relative w-full lg:flex-1 order-1 lg:order-2 flex items-end justify-center lg:block pb-4 lg:pb-0 pointer-events-auto z-50"
            style={{
              minHeight: isMobile ? cardH + (ACHIEVEMENTS.length - 1) * vertDist + 20 : isLaptop ? 380 : 550
            }}
          >
            <CardSwap
              width={cardW}
              height={cardH}
              cardDistance={cardDist}
              verticalDistance={vertDist}
              delay={5000}
              easing="elastic"
              skewAmount={isMobile ? 0 : 1}
              pauseOnHover={!isMobile}
              onSwap={(nextIndex) => setActiveIndex(nextIndex)}
            >
              {ACHIEVEMENTS.map((item, i) => (
                <Card key={i}>
                  <img
                    src={item.img}
                    alt={item.title}
                    draggable={false}
                    className="absolute inset-0 w-full h-full object-cover select-none"
                  />
                  {/* Bottom gradient overlay with title */}
                  <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex items-end p-4 sm:p-5">
                    <span className="font-display text-sm sm:text-base font-bold text-white tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {item.title}
                    </span>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>

        </div>
      </div>

      {/* Fade-in animation keyframe */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeSlideIn 0.5s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default Achievements;
