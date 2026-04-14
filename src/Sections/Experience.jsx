import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

// Skip filter:blur on mobile — prevents expensive GPU layer compositing on low-power devices
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const experienceData = [
  {
    role: "Intern / Team Member",
    org: "Datta Meghe College",
    duration: "2023 - Present",
    description: "Building and maintaining features across the stack — React on the front, Express and MongoDB in the back. Integrated real-world APIs like OpenWeather and Leaflet into student-facing applications that actually get used.",
  },
  {
    role: "Contributor",
    org: "CSI-CATT Tech Team",
    duration: "2023 - Present",
    description: "Fast-paced collaboration, rapid prototyping, and hackathon-mode shipping. Worked across frontend and backend, and genuinely enjoy the pressure of building something meaningful under a deadline.",
  },
  {
    role: "Freelance / Personal Projects",
    org: "Self-employed",
    duration: "2022 - Present",
    description: "End-to-end ownership: design decisions, MERN stack development, deployment, and polish. Every project has been a lesson in what it actually takes to ship something you're proud of.",
  }
];

const Experience = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);   // opacity / scale wrapper
  const scrollRef = useRef(null);   // timeline container
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const cardRefs = useRef([]);

  const setNodeRef = (index) => (el) => { nodeRefs.current[index] = el; };
  const setCardRef = (index) => (el) => { cardRefs.current[index] = el; };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const scroll = scrollRef.current;
    if (!section || !inner || !scroll) return;

    const cards = cardRefs.current.filter(Boolean);
    const nodes = nodeRefs.current.filter(Boolean);

    // Initial hidden state using autoAlpha to prevent Safari opacity composition bleeding
    gsap.set(inner, { autoAlpha: 0, scale: 0.92, ...(IS_MOBILE ? {} : { filter: "blur(10px)" }) });
    gsap.set(scroll, { autoAlpha: 0 }); // hide timeline entirely
    gsap.set(lineRef.current, { scaleY: 0 });
    gsap.set(cards, { opacity: 0, x: (i) => i % 2 === 0 ? -80 : 80, scale: 0.95 });
    gsap.set(nodes, { scale: 0, opacity: 0 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          // On resize: snap everything back to initial pre-animation state
          gsap.set(inner, { autoAlpha: 0, scale: 0.92, y: 0, clearProps: "filter" });
          gsap.set(scroll, { autoAlpha: 0 });
          gsap.set(lineRef.current, { scaleY: 0 });
          gsap.set(headingRef.current, { y: 0, scale: 1 });
        },
      },
    });

    // 1. Entrance: container reveals, SplitText handles its own characters
    masterTl.to(inner, { autoAlpha: 1, scale: 1, ...(IS_MOBILE ? {} : { filter: "blur(0px)" }), duration: 0.8, ease: "power3.out" });

    // 2. HOLD isolated heading perfectly center
    masterTl.to({}, { duration: 1.2 });

    // 3. ASCENT: Glide heading gracefully slightly upwards (leaves room for timeline)
    masterTl.to(headingRef.current, {
      y: () => -(window.innerHeight * 0.30),
      scale: 0.9, duration: 1.2, ease: "power3.inOut"
    });

    // 4. Reveal invisible timeline wrapper right below heading
    masterTl.to(scroll, { autoAlpha: 1, duration: 0.4 }, "-=0.4");

    // 5. LINE DROP
    masterTl.to(lineRef.current, { scaleY: 1, duration: 0.8, ease: "power2.out" });

    // 6. CARDS STAGGER IN
    cards.forEach((card, i) => {
      masterTl.to([nodes[i], card], {
        opacity: 1, scale: 1, x: 0,
        duration: 0.6, ease: "power3.out",
      }, "-=0.65");
    });

    // 7. HOLD before scrub
    masterTl.to({}, { duration: 0.5 });

    // 8. DEEP SCRUB: Move inner up robustly so ALL cards come fully into view!
    masterTl.to(inner, { y: () => -(window.innerHeight * 0.70), duration: 2.5, ease: "power1.inOut" });

    // 9. HOLD at end of content
    masterTl.to({}, { duration: 0.5 });

    // 10. EXIT
    masterTl.to(inner, { autoAlpha: 0, scale: 0.88, ...(IS_MOBILE ? {} : { filter: "blur(10px)" }), duration: 0.8, ease: "power2.in" });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative h-dvh w-full overflow-hidden text-brand-text"
    >
      {/* Opacity / scale wrapper */}
      <div ref={innerRef} className="absolute inset-0 w-full h-full">

        {/* Heading: Starts perfectly centered */}
        <div
          ref={headingRef}
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex flex-col items-center z-30 will-change-transform"
        >
          <div className="text-center">
            <SplitText
              text="EXPERIENCE"
              className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold text-white tracking-widest leading-none drop-shadow-md"
              delay={0} duration={0.8} ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.9 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.5}
            />
            <div className="text-brand-accent tracking-widest uppercase text-sm mt-3 font-body opacity-80">
              What I've been building and <br />contributing to
            </div>
          </div>
        </div>

        {/* Scrub-scroll container for TIMELINE ONLY */}
        <div
          ref={scrollRef}
          className="absolute left-0 right-0 top-[28vh] px-6 md:px-12 lg:px-24 pb-[60vh] flex flex-col items-center will-change-transform z-20"
        >
          {/* Timeline */}
          <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center pt-8">

            {/* Central Line */}
            <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-brand-border/50">
              <div ref={lineRef} className="w-full h-full bg-gradient-to-b from-brand-accent to-transparent origin-top" />
            </div>

            {/* Items */}
            <div className="flex flex-col w-full gap-10 lg:gap-14">
              {experienceData.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className={`relative flex w-full items-start ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row justify-end md:justify-between`}
                  >
                    {/* Node */}
                    <div
                      ref={setNodeRef(index)}
                      className="absolute md:left-1/2 left-4 top-6 -translate-x-1/2 w-5 h-5 rounded-full border-4 border-brand-bg bg-brand-accent z-10 shadow-[0_0_16px_rgba(191,219,254,0.6)]"
                    />

                    {/* Empty side */}
                    <div className="hidden md:block w-[45%]" />

                    {/* Card */}
                    <div ref={setCardRef(index)} className="w-full md:w-[45%] pl-10 md:pl-0 flex pointer-events-auto">
                      <div className={`relative group p-6 md:p-8 rounded-2xl bg-brand-surface backdrop-blur-sm md:backdrop-blur-md transition-all duration-500 hover:bg-brand-surface-hover hover:shadow-[0_8px_30px_rgba(191,219,254,0.08)] w-full overflow-hidden`}>
                        <p className="text-brand-accent font-medium text-xs tracking-widest uppercase mb-2 font-body">{item.duration}</p>
                        <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-1.5">{item.role}</h3>
                        <p className="text-brand-muted text-sm md:text-base font-display opacity-80 mb-4">{item.org}</p>
                        <p className="text-[#a0a0a0] text-sm md:text-base leading-relaxed font-body">{item.description}</p>
                      </div>
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

export default Experience;
