import { useRef, useEffect, useState } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../Components/SplitText";
import CoverFlow from "../Components/CoverFlow";

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
  }, {
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
    img: ttDoubles,
    title: "2nd Place · Table Tennis Doubles",
    category: "Sports",
    date: "2025",
    description:
      "Partnered with a senior and competed in the DMCE Milestone 2025 Table Tennis Doubles tournament. Fought our way to the finals and secured 2nd place — as a first-year in Sem 2. Proof that competitive drive isn't limited to a keyboard.",
    accent: "#D8B4FE",
  },
];

const ACCENT_COLORS = {
  "#FBB924": { glow: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.4)", text: "#FBB924" },
  "#BFDBFE": { glow: "rgba(191,219,254,0.15)", border: "rgba(191,219,254,0.4)", text: "#BFDBFE" },
  "#86EFAC": { glow: "rgba(134,239,172,0.15)", border: "rgba(134,239,172,0.4)", text: "#86EFAC" },
  "#D8B4FE": { glow: "rgba(216,180,254,0.15)", border: "rgba(216,180,254,0.4)", text: "#D8B4FE" },
};

// ─── Component ───────────────────────────────────────────────────────────────
const Achievements = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const infoRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);

  // GSAP Entrance Animation (No Pinning, just elegant entrance)
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    gsap.set(inner, { autoAlpha: 0, y: 50, ...(IS_MOBILE ? {} : { filter: "blur(10px)" }) });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(inner, {
      autoAlpha: 1,
      y: 0,
      ...(IS_MOBILE ? {} : { filter: "blur(0px)" }),
      duration: 1.2,
      ease: "power3.out",
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  // Animate Info Panel on Data Change
  useEffect(() => {
    if (!infoRef.current) return;

    // Smooth crossfade/slide effect for the text when activeIndex changes
    const el = infoRef.current;
    gsap.fromTo(el,
      { opacity: 0, y: 15, filter: "blur(4px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }
    );
  }, [activeIndex]);

  const active = ACHIEVEMENTS[activeIndex] || ACHIEVEMENTS[0];
  const accentStyle = ACCENT_COLORS[active.accent] || ACCENT_COLORS["#BFDBFE"];

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative min-h-dvh w-full overflow-hidden text-brand-text bg-transparent flex flex-col pt-24 pb-12 lg:pt-32 lg:pb-16"
    >
      {/* Decorative watermark */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none z-0"
        style={{ fontSize: "clamp(8rem,25vw,25rem)", letterSpacing: "-0.05em", color: "rgba(255,255,255,0.015)" }}
      >
        WINS
      </span>

      <div ref={innerRef} className="relative z-10 w-full h-full flex flex-col flex-1 max-w-[1600px] mx-auto">

        {/* ══════════ TOP: Heading ══════════ */}
        <div className="w-full px-4 sm:px-8 text-center shrink-0 mb-6 sm:mb-10 lg:mb-14">
          <SplitText
            text="ACHIEVEMENTS"
            className="font-display text-[clamp(2.2rem,7vw,5rem)] font-bold text-white tracking-widest leading-none drop-shadow-2xl"
            delay={0}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50, scale: 0.9 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.5}
          />
          <div className="mt-3 sm:mt-4 h-px w-16 bg-gradient-to-r from-transparent via-brand-accent/70 to-transparent mx-auto" />
          <p className="mt-3 font-mono text-[9px] sm:text-[11px] tracking-[0.3em] uppercase text-brand-accent/60 opacity-80">
            Recognitions, milestones & technical wins
          </p>
        </div>

        {/* ══════════ MIDDLE: Cover Flow Carousel ══════════ */}
        <div className="relative flex-1 w-full min-h-[250px] sm:min-h-[350px] lg:min-h-[450px] z-30 flex items-center justify-center">
          <CoverFlow
            items={ACHIEVEMENTS}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>

        {/* ══════════ BOTTOM: Interactive Info Panel ══════════ */}
        <div className="w-full max-w-[800px] mx-auto px-4 sm:px-8 shrink-0 z-40 mt-6 sm:mt-12 lg:mt-16">
          <div
            className="relative rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 lg:p-10 overflow-hidden border bg-brand-surface/30 backdrop-blur-xl transition-colors duration-700 mx-auto"
            style={{ borderColor: accentStyle.border, boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 0 40px ${accentStyle.glow}` }}
          >
            <div ref={infoRef} className="relative z-10 flex flex-col items-center text-center gap-3 sm:gap-4">

              {/* Category + Date */}
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-all duration-700"
                  style={{ borderColor: accentStyle.border, color: accentStyle.text, background: accentStyle.glow }}
                >
                  {active.category}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase text-white/40">
                  {active.date}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-white leading-tight mt-1">
                {active.title}
              </h3>

              {/* Divider */}
              <div className="h-px w-24 bg-white/10 my-1" />

              {/* Description */}
              <p className="font-body text-[13px] sm:text-[15px] lg:text-base leading-relaxed text-brand-muted opacity-90 max-w-[650px]">
                {active.description}
              </p>

              {/* Card Pagination Indicators */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-4">
                {ACHIEVEMENTS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Go to achievement ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-500 cursor-pointer"
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

      </div>
    </section>
  );
};

export default Achievements;
