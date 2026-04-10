import { useRef, useEffect } from "react";
import Skilltube from "../assets/Skilltube.png";
import Vayu from "../assets/Vayu.png";
import projectsData from "../Components/ProjectsData.json";
import { gsap } from "../lib/gsapScroll";

const imageMap = {
  SkillTube: Skilltube,
  Vayu,
};

const Projects = () => {
  const sectionRef = useRef(null);
  const panelsRef = useRef([]);

  const setPanelRef = (index) => (el) => {
    if (el) panelsRef.current[index] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || panelsRef.current.length === 0) return;

    const cards = panelsRef.current.filter(Boolean);

    // Same pattern as About.jsx: first card visible, rest blurred below
    gsap.set(cards, { clearProps: "all" });
    gsap.set(cards.slice(1), { y: 60, opacity: 0, filter: "blur(6px)" });
    gsap.set(cards[0], { y: 0, opacity: 1, filter: "blur(0px)" });

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

    cards.forEach((card, index) => {
      // Entrance: slide up from below, clear blur
      if (index > 0) {
        tl.to(card, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1,
          ease: "power2.out",
        });
      }
      // Exit: float upward, blur out
      if (index < cards.length - 1) {
        tl.to(
          card,
          {
            y: -60,
            opacity: 0,
            filter: "blur(6px)",
            duration: 1,
            ease: "power2.in",
          },
          "+=0.5"
        );
      }
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative h-screen w-full overflow-hidden bg-transparent"
    >
      {/* Ghost watermark — decorative, transparent so particles show */}
      <span
        aria-hidden="true"
        className="absolute right-[-2vw] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none text-white/[0.04]"
        style={{ fontSize: "clamp(8rem,20vw,18rem)", letterSpacing: "-0.05em" }}
      >
        WORK
      </span>

      <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-16 lg:gap-24 relative pt-20 md:pt-0 pb-6 md:pb-0">

        {/* ── LEFT: Animated Project Cards ── */}
        <div className="relative w-full md:w-[52%] h-[55vh] sm:h-[60vh] md:h-[82vh] shrink-0">
          {projectsData.projectsData.map((project, index) => (
            <div
              key={project.name}
              ref={setPanelRef(index)}
              className="absolute inset-0 flex flex-col mt-2 md:mt-0 pt-2 md:pt-20"
              style={{ zIndex: projectsData.projectsData.length - index }}
            >
              {/* Screenshot / mockup image */}
              <div
                className="w-full rounded-2xl overflow-hidden mb-5 shrink-0 border border-white/10"
                style={{
                  height: "52%",
                  background: "rgba(255,255,255,0.04)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <img
                  className="w-full h-full object-cover object-top"
                  src={imageMap[project.name]}
                  alt={project.name}
                  draggable={false}
                />
              </div>

              {/* Card text content */}
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Tech tag pill */}
                <div className="mb-2 md:mb-3">
                  <span
                    className="inline-block text-[10px] md:text-[11px] font-semibold tracking-[0.25em] uppercase px-3 py-1 rounded-full border font-body"
                    style={{
                      color: "var(--color-brand-accent)",
                      borderColor: "rgba(191,219,254,0.25)",
                      background: "rgba(191,219,254,0.06)",
                    }}
                  >
                    {project.technologies.join(" · ")}
                  </span>
                </div>

                {/* Project name */}
                <h3
                  className="font-display font-black leading-[1] text-white mb-2 md:mb-3"
                  style={{ fontSize: "clamp(2rem,4vw,3.25rem)" }}
                >
                  {project.name}
                </h3>

                {/* Description */}
                <p
                  className="font-body leading-relaxed mb-3 md:mb-5 line-clamp-3 md:line-clamp-none flex-shrink"
                  style={{
                    color: "var(--color-brand-muted)",
                    fontSize: "clamp(0.8rem,1.2vw,0.95rem)",
                    maxWidth: "44ch",
                  }}
                >
                  {project.description}
                </p>

                {/* CTA link */}
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 font-body font-semibold uppercase tracking-[0.2em] text-[11px] md:text-[12px] transition-all duration-300"
                  style={{ color: "var(--color-brand-accent)" }}
                >
                  View on GitHub
                  <span
                    className="inline-block h-px w-8 group-hover:w-14 transition-all duration-300 rounded-full"
                    style={{ background: "var(--color-brand-accent)" }}
                  />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── RIGHT: Section Label + Heading ── */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start pointer-events-none select-none w-full text-center md:text-left mt-4 md:mt-0 shrink-0">

          {/* Label */}
          <p
            className="font-body font-semibold tracking-[0.3em] uppercase mb-2 md:mb-6 text-brand-accent opacity-70"
            style={{ fontSize: "clamp(0.6rem,0.9vw,0.75rem)" }}
          >
            Latest Ventures
          </p>

          {/* Heading */}
          <h2
            className="font-display font-black text-white leading-[1.0] mb-3 md:mb-6"
            style={{ fontSize: "clamp(2.5rem,6vw,5.5rem)" }}
          >
            Selected&nbsp;
            <br className="hidden md:block" />
            <span className="text-brand-muted" style={{ fontStyle: "italic" }}>
              Stories
            </span>
          </h2>

          {/* Divider */}
          <div className="w-full mb-3 md:mb-5 border-t border-brand-border md:block hidden" />

          {/* Subtext */}
          <p
            className="font-body leading-relaxed text-brand-muted hidden md:block"
            style={{
              fontSize: "clamp(0.75rem,1.1vw,0.9rem)",
              maxWidth: "32ch",
            }}
          >
            Things I built and shipped — where engineering meets design.
          </p>

          {/* Project dots counter */}
          <div className="mt-4 md:mt-8 flex items-center gap-3 hidden md:flex">
            {projectsData.projectsData.map((_, i) => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  width: i === 0 ? "2rem" : "0.5rem",
                  height: "0.5rem",
                  background:
                    i === 0
                      ? "var(--color-brand-accent)"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Projects;
