import { useRef, useEffect, useState } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../Components/SplitText";
import achievementsData from "../Components/AchievementsData.json";
import { HiTrophy, HiRocketLaunch, HiUsers, HiAcademicCap, HiStar, HiSparkles } from "react-icons/hi2";

const IconMap = {
  trophy: HiTrophy,
  rocket: HiRocketLaunch,
  volunteer: HiUsers,
  academic: HiAcademicCap,
  star: HiStar,
  award: HiSparkles
};

const Achievements = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);   
  const scrollRef = useRef(null);   
  const headingRef = useRef(null);
  const cardRefs = useRef([]);

  const setCardRef = (index) => (el) => { cardRefs.current[index] = el; };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const scroll = scrollRef.current;
    const heading = headingRef.current;
    if (!section || !inner || !scroll) return;

    const cards = cardRefs.current.filter(Boolean);

    // Initial state
    gsap.set(inner, { opacity: 0, scale: 0.94, filter: "blur(12px)" });
    gsap.set(scroll, { opacity: 0 });
    gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // 1. Entrance: container reveals
    masterTl.to(inner, { 
      opacity: 1, scale: 1, filter: "blur(0px)", 
      duration: 1, ease: "power3.out" 
    });

    // 2. HOLD heading centered
    masterTl.to({}, { duration: 1.2 });

    // 3. ASCENT: Glide heading up to make space
    masterTl.to(heading, { 
      y: "-32vh", scale: 0.85, 
      duration: 1.2, ease: "power3.inOut" 
    });

    // 4. Reveal grid container
    masterTl.to(scroll, { opacity: 1, duration: 0.5 }, "-=0.2");

    // 5. CARDS STAGGER IN
    masterTl.to(cards, { 
      opacity: 1, y: 0, scale: 1, 
      stagger: 0.1, duration: 0.8, ease: "power2.out" 
    }, "-=0.3");

    // 6. DEEP SCRUB: Move inner up if content overflows
    // Using a function-based value for dynamic height calculation
    masterTl.to(inner, { 
      y: (i, target) => {
        const contentH = scroll.scrollHeight;
        const availableH = window.innerHeight * 0.5; // Roughly the space below heading
        const overflow = Math.max(0, contentH - availableH);
        return overflow > 0 ? -overflow - 100 : 0;
      }, 
      duration: 2.5, ease: "power1.inOut" 
    });

    // 7. HOLD & EXIT
    masterTl.to({}, { duration: 0.8 });
    masterTl.to(inner, { 
      opacity: 0, scale: 0.88, filter: "blur(10px)", 
      duration: 1, ease: "power2.in" 
    });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative h-screen w-full overflow-hidden text-brand-text bg-transparent"
    >
      {/* Decorative Watermark */}
      <span
        aria-hidden="true"
        className="absolute left-[-2vw] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none leading-none text-white/[0.03] z-0"
        style={{ fontSize: "clamp(8rem,20vw,18rem)", letterSpacing: "-0.05em" }}
      >
        WINS
      </span>

      {/* Opacity / scale wrapper */}
      <div ref={innerRef} className="absolute inset-0 flex flex-col pt-20 items-center z-10">
        
        {/* Heading — Starts centered */}
        <div 
          ref={headingRef} 
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex flex-col items-center will-change-transform"
        >
          <div className="text-center">
            <SplitText
              text="ACHIEVEMENTS"
              className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold text-white tracking-widest leading-none drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              delay={0} duration={0.8} ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50, scale: 0.9 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.5}
            />
            <div className="text-brand-accent tracking-widest uppercase text-xs md:text-sm mt-4 font-body opacity-80">
              Recognitions, Milestones & Technical Wins
            </div>
          </div>
        </div>

        {/* Scrollable Content wrapper */}
        <div ref={scrollRef} className="w-full max-w-6xl px-6 md:px-12 mt-[35vh] pb-40 will-change-transform">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievementsData.map((item, index) => {
              const Icon = IconMap[item.iconName] || HiSparkles;
              return (
                <div
                  key={index}
                  ref={setCardRef(index)}
                  className="group relative flex flex-col gap-4 p-6 md:p-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.06] hover:border-brand-accent/40 hover:shadow-[0_0_40px_rgba(191,219,254,0.08)] pointer-events-auto overflow-hidden"
                >
                  {/* Subtle Shimmer Effect on Hover */}
                  <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl bg-brand-surface-hover border border-white/10 text-white group-hover:text-brand-accent group-hover:scale-110 transition-all duration-500">
                      <Icon size={isMobileDevice() ? 24 : 28} />
                    </div>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-medium tracking-widest text-brand-muted uppercase">
                      {item.date}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="h-px w-4 bg-brand-accent/50" />
                       <p className="text-brand-accent font-medium text-[10px] md:text-xs tracking-[0.2em] uppercase font-body">
                        {item.category}
                      </p>
                    </div>
                    <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-wide mb-3 group-hover:text-brand-accent transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-brand-muted text-sm md:text-base leading-relaxed font-body opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                      {item.description}
                    </p>
                  </div>

                  {/* Decorative corner glow */}
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-brand-accent/10 blur-[40px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Simple helper to check mobile for icon scaling
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

export default Achievements;
