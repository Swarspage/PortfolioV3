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
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || cardsRef.current.length === 0) return;

    const cards = cardsRef.current.filter(Boolean);

    // Reset styles
    gsap.set(cards, { clearProps: "all" });

    // Set initial states: first card visible, others hidden below
    gsap.set(cards.slice(1), { y: 60, opacity: 0, filter: "blur(8px)", scale: 0.95 });
    gsap.set(cards[0], { y: 0, opacity: 1, filter: "blur(0px)", scale: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${cards.length * 100}%`,
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    });

    cards.forEach((card, index) => {
      // 1. Entrance animation (except for the first one)
      if (index > 0) {
        tl.to(card, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 1,
          ease: "power2.out"
        });
      }

      // 2. Exit animation (except for the last one)
      if (index < cards.length - 1) {
        tl.to(card, {
          y: -60,
          opacity: 0,
          filter: "blur(8px)",
          scale: 0.95,
          duration: 1,
          ease: "power2.in"
        }, "+=0.5"); // hold it briefly
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
      id="education" 
      className="relative flex flex-col justify-center items-center h-screen w-full px-6 md:px-12 lg:px-24 text-brand-text overflow-hidden"
    >
      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between">
        
        {/* Left column: Heading and Copy */}
        <div className="w-full lg:w-5/12 flex flex-col items-start gap-8">
          <div ref={headingRef}>
            <SplitText 
              text="EDUCATION" 
              className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold text-white tracking-widest leading-none" 
              delay={0} 
              duration={0.8} 
              ease="power3.out" 
              splitType="chars" 
              from={{ opacity: 0, y: 50, scale: 0.9 }} 
              to={{ opacity: 1, y: 0, scale: 1 }} 
              threshold={0.5} 
            />
            <div className="text-brand-accent tracking-widest uppercase text-sm mt-4 font-body">The academic path behind the work</div>
          </div>

          <div className="flex flex-col space-y-6 text-brand-muted text-lg leading-relaxed font-body pointer-events-auto">
            <p>
              Most of what I know came from building things, but school gave me the foundation to understand why things work — not just that they do.
            </p>
            <p>
              From CBSE to HSC to engineering, each phase added a layer: discipline, structured thinking, and now — actual software development at scale. The GPA reflects the effort, but the projects are where it shows up.
            </p>
          </div>
        </div>

        {/* Right column: Animated Progression Cards */}
        <div className="w-full lg:w-7/12 relative h-[45vh] lg:h-[50vh] pointer-events-auto mt-12 lg:mt-0 perspective-1000">
          {educationData.map((item, index) => {
            return (
              <div 
                key={index} 
                ref={setCardRef(index)}
                className="absolute inset-0 flex flex-col justify-center p-8 lg:p-10 rounded-[2rem] bg-brand-surface backdrop-blur-md border border-brand-border shadow-2xl transition-colors duration-500 hover:border-brand-accent/50 hover:bg-brand-surface-hover"
                style={{ 
                  zIndex: educationData.length - index,
                }}
              >
                {/* Academic Grid Pattern */}
                <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex justify-between items-start flex-wrap gap-4 mb-2">
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-white flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      {item.institution}
                    </h3>
                    <span className="px-5 py-2 rounded-full border border-brand-border bg-brand-bg/50 text-sm font-medium tracking-wide text-brand-accent whitespace-nowrap">
                      {item.years}
                    </span>
                  </div>
                  <p className="text-xl lg:text-2xl text-white/90 font-medium font-body">
                    {item.degree}
                  </p>
                  <p className="text-brand-muted text-lg font-body tracking-wide">
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

