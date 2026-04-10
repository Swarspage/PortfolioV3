import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

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
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const nodeRefs = useRef([]);
  const cardRefs = useRef([]);

  const setNodeRef = (index) => (el) => {
    nodeRefs.current[index] = el;
  };
  
  const setCardRef = (index) => (el) => {
    cardRefs.current[index] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Timeline Line Drawing Animation
    gsap.fromTo(lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 50%",
          end: "bottom 80%",
          scrub: true,
        }
      }
    );

    // Nodes and Cards entrance animations
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      const node = nodeRefs.current[index];
      const isLeft = index % 2 === 0;

      // Node glow entrance
      gsap.fromTo(node,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            once: true
          }
        }
      );

      // Card slide and fade
      gsap.fromTo(card,
        { 
          x: isLeft ? -100 : 100, 
          opacity: 0,
          scale: 0.95
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            once: true
          }
        }
      );
    });

  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="experience" 
      className="relative flex flex-col justify-start items-center min-h-screen w-full px-6 md:px-12 lg:px-24 pt-32 pb-32 text-brand-text overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute left-[-10%] top-[40%] w-[50vw] h-[50vw] bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-6xl flex flex-col items-center mb-24">
        {/* Section Heading */}
        <div ref={headingRef} className="text-center">
          <SplitText 
            text="EXPERIENCE" 
            className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold text-white tracking-widest leading-none" 
            delay={0} 
            duration={0.8} 
            ease="power3.out" 
            splitType="chars" 
            from={{ opacity: 0, y: 50, scale: 0.9 }} 
            to={{ opacity: 1, y: 0, scale: 1 }} 
            threshold={0.5} 
          />
          <div className="text-brand-accent tracking-widest uppercase text-sm mt-4 font-body">What I've been building and contributing to</div>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Central Line */}
        <div className="absolute md:left-1/2 left-4 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-brand-border/50">
          <div 
            ref={lineRef} 
            className="w-full h-full bg-gradient-to-b from-brand-accent to-transparent origin-top"
          ></div>
        </div>

        {/* Timeline Items */}
        <div className="flex flex-col w-full gap-24">
          {experienceData.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`relative flex w-full justify-end md:justify-between items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
              >
                {/* Node */}
                <div 
                  ref={setNodeRef(index)}
                  className="absolute md:left-1/2 left-4 top-12 md:top-10 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-brand-bg bg-brand-accent z-10 shadow-[0_0_20px_rgba(191,219,254,0.6)]"
                ></div>

                {/* Card Container (Empty side for spacing) */}
                <div className="hidden md:block w-[45%]"></div>

                {/* Content Card */}
                <div 
                  ref={setCardRef(index)}
                  className="w-full md:w-[45%] pl-12 md:pl-0 flex pointer-events-auto"
                >
                  <div className="relative group p-8 rounded-[2rem] bg-brand-surface border border-brand-border backdrop-blur-md transition-all duration-500 hover:bg-brand-surface-hover hover:border-brand-accent/30 w-full overflow-hidden">
                    
                    {/* Glowing side accent bar */}
                    <div className={`absolute top-0 bottom-0 w-1 bg-gradient-to-b from-brand-accent to-transparent opacity-50 group-hover:opacity-100 transition-opacity ${isLeft ? 'right-0' : 'left-0'}`}></div>

                    <p className="text-brand-accent font-medium text-sm tracking-widest uppercase mb-2 font-body">
                      {item.duration}
                    </p>
                    <h3 className="text-2xl lg:text-3xl font-display font-bold text-white mb-1">
                      {item.role}
                    </h3>
                    <p className="text-brand-muted text-lg mb-6 font-display opacity-80">
                      {item.org}
                    </p>
                    <p className="text-[#a0a0a0] leading-relaxed font-body">
                      {item.description}
                    </p>
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

export default Experience;

