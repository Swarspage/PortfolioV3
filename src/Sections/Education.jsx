import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

// Skip filter:blur on mobile — prevents expensive GPU layer compositing on low-power devices
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

const educationData = [
  {
    institution: "Datta Meghe College of Eng.",
    degree: "B.Tech Computer Engineering",
    details: "GPA: 8.365/10",
    years: "2023 - Present",
  },
  {
    institution: "Abhishek Vidyalayam",
    degree: "Classes 11-12, HSC",
    details: "Science",
    years: "2021 - 2023",
  },
  {
    institution: "Elpro International School",
    degree: "Classes 7-10, CBSE",
    details: "89%",
    years: "2017 - 2021",
  }
];

const Education = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);
  const textRefs = useRef([]);

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };
  const setTextRef = (index) => (el) => {
    textRefs.current[index] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);
    const texts = textRefs.current.filter(Boolean);

    // Reset styles
    gsap.set(cards, { clearProps: "all" });

    // Initial states: Card 0 visible at front, rest waiting below the viewport
    gsap.set(cards[0], { y: 0, opacity: 1, scale: 1 });
    gsap.set(cards.slice(1), {
      y: "75vh",
      opacity: 0,
      scale: 0.85,
      ...(IS_MOBILE ? {} : { filter: "blur(12px)" }),
    });
    gsap.set(texts, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${cards.length * 80}%`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // 1. Instantly fade up the beautiful left column intro texts
    tl.to(texts, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      stagger: 0.1,
      ease: "power2.out"
    }, 0);

    // 2. The 3D Deck Stacking
    cards.forEach((card, i) => {
      if (i === 0) return; // card 0 is already front and center

      const stepTl = gsap.timeline();

      // Dim and push ALL previous cards back into the deck
      for (let j = 0; j < i; j++) {
        const depth = i - j; // how deep this card is now
        stepTl.to(cards[j], {
          y: -depth * 45,             // drift up into deck
          scale: 1 - depth * 0.06,   // shrink
          opacity: 1 - depth * 0.5,  // fade aggressively
          filter: IS_MOBILE ? "none" : `blur(${depth * 5}px)`, // strong blur
          duration: 1,
          ease: "power2.inOut"
        }, 0);
      }

      // Slide the NEW card securely into the front
      stepTl.to(card, {
        y: 0,
        opacity: 1,
        scale: 1,
        ...(IS_MOBILE ? {} : { filter: "blur(0px)" }),
        duration: 1.1,
        ease: "power3.out"
      }, 0);

      tl.add(stepTl, `+=0.2`); // brief hold between swaps
    });

    // Hold at end
    tl.to({}, { duration: 0.5 });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="education"
      className="relative flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 text-brand-text overflow-hidden h-dvh min-h-[700px] w-full"
    >
      <div ref={innerRef} className="z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20 items-center justify-between pt-28 md:pt-20 lg:pt-0 will-change-[opacity,transform,filter]">

        {/* Left column: Heading and Copy */}
        <div className="w-full lg:w-5/12 flex flex-col items-start gap-4 md:gap-8">
          <div ref={headingRef}>
            <SplitText
              text="EDUCATION"
              className="font-display text-[clamp(2rem,10vw,6rem)] font-bold text-white tracking-widest leading-none"
              delay={0}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.9 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.5}
            />
            <div className="text-brand-accent tracking-widest uppercase text-xs md:text-sm mt-2 md:mt-4 font-body">The academic path behind the work</div>
          </div>

          <div className="flex flex-col space-y-4 md:space-y-6 text-brand-muted text-base md:text-lg leading-relaxed font-body pointer-events-auto">
            <p ref={setTextRef(0)}>
              Most of what I know came from building things, but school gave me the foundation to understand why things work — not just that they do.
            </p>
            <p ref={setTextRef(1)} className="hidden sm:block">
              From CBSE to HSC to engineering, each phase added a layer: discipline, structured thinking, and now — actual software development at scale. The GPA reflects the effort, but the projects are where it shows up.
            </p>
          </div>
        </div>

        {/* Right column: Animated Progression Cards */}
        <div className="w-full lg:w-[45%] relative min-h-[300px] h-[42vh] sm:h-[40vh] lg:h-[44vh] max-h-[420px] pointer-events-auto mt-8 lg:mt-0 perspective-1000 shrink-0">
          {educationData.map((item, index) => {
            return (
              <div
                key={index}
                ref={setCardRef(index)}
                className="absolute inset-0 flex flex-col justify-center p-7 md:p-10 rounded-[2rem] bg-brand-surface/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-all duration-500 hover:border-brand-accent/30 overflow-hidden"
                style={{
                  // Cards added LATER in the array get HIGHER zIndex so they
                  // render on top when they slide into the front position
                  zIndex: index + 1,
                  transformOrigin: "top center",
                }}
              >
                {/* Top accent hairline */}
                <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-brand-accent/35 to-transparent pointer-events-none" />

                {/* Subtle grid watermark */}
                <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

                {/* Hover inner glow */}
                <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-brand-accent/[0.06] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-4 md:gap-5">

                  {/* Row 1: ping dot + institution name + year badge */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-30" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent shadow-[0_0_10px_rgba(191,219,254,0.85)]" />
                      </span>
                      <h3 className="font-display text-base md:text-lg font-semibold text-white/75 leading-snug tracking-wide truncate">
                        {item.institution}
                      </h3>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center px-3 py-1 rounded-full border border-brand-accent/20 bg-brand-accent/[0.07] font-mono text-[10px] tracking-[0.2em] text-brand-accent/80 whitespace-nowrap">
                      {item.years}
                    </span>
                  </div>

                  {/* Row 2: Degree as hero text */}
                  <p className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
                    {item.degree}
                  </p>

                  {/* Divider */}
                  <div className="h-px w-full bg-white/[0.06]" />

                  {/* Row 3: Result details */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-brand-accent/55">Result</span>
                    <div className="h-px flex-1 bg-white/5" />
                    <span className="font-mono text-sm font-semibold text-white/65">{item.details}</span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
export default Education;

