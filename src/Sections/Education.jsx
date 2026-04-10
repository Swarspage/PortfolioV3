import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

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

    // Initial states: Card 0 up and ready, rest tucked below
    gsap.set(cards[0], { y: 0, opacity: 1, filter: "blur(0px)", scale: 1 });
    gsap.set(cards.slice(1), { y: "60vh", opacity: 0, filter: "blur(8px)", scale: 0.8 });
    gsap.set(texts, { opacity: 0, y: 30 }); // hide left text

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${cards.length * 150}%`, // lots of scroll depth for the stacking
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    // 1. Instantly fade up the beautiful left column intro texts
    tl.to(texts, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power2.out"
    }, 0);

    // 2. The 3D Deck Stacking
    cards.forEach((card, i) => {
      if (i === 0) return; // card 0 is already front and center

      const stepTl = gsap.timeline();

      // Dim and push ALL previous cards back
      for (let j = 0; j < i; j++) {
        const depth = i - j; // how deep this card is now
        stepTl.to(cards[j], {
          y: -depth * 40,              // drift upwards slightly
          scale: 1 - depth * 0.055,    // shrink down
          opacity: 1 - depth * 0.45,   // aggressively darken
          filter: `blur(${depth * 2.5}px)`, // blur it
          duration: 1,
          ease: "power2.inOut"
        }, 0);
      }

      // Slide the NEW card securely into the front
      stepTl.to(card, {
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power3.out"
      }, 0); // sync with pushback

      tl.add(stepTl, `+=${0.1}`); // tiny hold between card swaps
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
      className="relative flex flex-col justify-center items-center px-6 md:px-12 lg:px-24 text-brand-text overflow-hidden h-screen w-full"
      style={{ minHeight: "600px" }}
    >
      <div ref={innerRef} className="z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-center justify-between pt-16 md:pt-0">

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
        <div className="w-full lg:w-[45%] relative h-[40vh] sm:h-[45vh] lg:h-[38vh] pointer-events-auto mt-4 lg:mt-0 perspective-1000 shrink-0">
          {educationData.map((item, index) => {
            return (
              <div
                key={index}
                ref={setCardRef(index)}
                className="absolute inset-0 flex flex-col justify-center p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-brand-surface/80 backdrop-blur-xl border border-brand-border/60 shadow-[0_12px_40px_rgba(0,0,0,0.4)] transition-colors duration-500 hover:border-brand-accent/50 hover:bg-brand-surface-hover"
                style={{
                  zIndex: educationData.length - index,
                  transformOrigin: "top center",
                }}
              >
                {/* Academic Grid Pattern modified for richer depth */}
                <div className="absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] bg-[linear-gradient(to_right,#ffffff05_2px,transparent_2px),linear-gradient(to_bottom,#ffffff05_2px,transparent_2px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-2 md:gap-3">
                  <div className="flex justify-between items-start flex-wrap gap-2 md:gap-3 mb-1">
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white flex items-center gap-3">
                      {/* Subtly Animated Glowing Ring */}
                      <span className="relative flex h-4 w-4 md:h-5 md:w-5 justify-center items-center shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-30"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 md:h-3 md:w-3 bg-brand-accent shadow-[0_0_12px_rgba(191,219,254,0.8)]"></span>
                      </span>
                      <span className="leading-tight">{item.institution}</span>
                    </h3>
                    <span className="px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-brand-border bg-brand-bg/60 text-xs md:text-sm font-medium tracking-wider text-brand-accent whitespace-nowrap shadow-inner">
                      {item.years}
                    </span>
                  </div>
                  <p className="text-lg md:text-xl text-white/95 font-medium font-body tracking-tight">
                    {item.degree}
                  </p>
                  <p className="text-brand-muted text-base font-body tracking-wide opacity-90 line-clamp-2 md:line-clamp-none">
                    {item.details}
                  </p>
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

