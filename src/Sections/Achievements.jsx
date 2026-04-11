import { useRef, useEffect } from "react";
import { gsap } from "../lib/gsapScroll";
import achievementsData from "../Components/AchievementsData.json";

const Achievements = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);   // opacity / scale wrapper
  const scrollRef = useRef(null);   // scrubs upward for in-section scroll  
  const headingRef = useRef(null);
  const trophyRefs = useRef([]);

  const setTrophyRef = (index) => (el) => { trophyRefs.current[index] = el; };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const scroll = scrollRef.current;
    if (!section || !inner || !scroll) return;

    const trophies = trophyRefs.current.filter(Boolean);

    // Initial state — headingRef is a plain element, no SplitText conflict
    gsap.set(inner, { opacity: 0, scale: 0.92, filter: "blur(10px)" });
    gsap.set(headingRef.current, { opacity: 0, y: 25 });
    gsap.set(trophies, { opacity: 0, y: 50, scale: 0.88 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=160%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // ENTRANCE: wrapper fades in
    masterTl.to(inner, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
    masterTl.to(headingRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.5");
    masterTl.to(trophies, { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: "back.out(1.4)" }, "-=0.2");

    // IN-SECTION SCROLL: scrub grid upward to reveal any overflow
    masterTl.to(scroll, { y: "-20vh", duration: 1.2, ease: "none" });

    // HOLD
    masterTl.to({}, { duration: 0.8 });

    // EXIT
    masterTl.to(inner, { opacity: 0, scale: 0.88, filter: "blur(10px)", duration: 0.8, ease: "power2.in" });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="relative h-screen w-full overflow-hidden text-brand-text"
    >
      {/* Opacity / scale wrapper */}
      <div ref={innerRef} className="absolute inset-0 flex flex-col">

        {/* Scrub-scroll container */}
        <div ref={scrollRef} className="w-full px-6 md:px-12 lg:px-24 pt-20 pb-32 flex flex-col items-center will-change-transform">

          {/* Heading — plain element (no SplitText) so GSAP controls it cleanly */}
          <div ref={headingRef} className="text-center mb-8">
            <h2 className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-brand-accent tracking-widest leading-none">
              ACHIEVEMENTS
            </h2>
            <div className="text-brand-accent tracking-widest uppercase text-sm mt-3 font-body">
              Milestones & Wins
            </div>
          </div>

          {/* Trophy Grid */}
          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-5 pointer-events-auto">
            {achievementsData.map((achievement, index) => (
              <div
                key={index}
                ref={setTrophyRef(index)}
                className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-brand-surface border border-brand-border backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-yellow-500/50 hover:shadow-[0_8px_30px_rgba(234,179,8,0.12)] overflow-hidden"
              >
                {/* Shimmer */}
                <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-brand-surface-hover border border-brand-border text-2xl group-hover:scale-110 transition-transform duration-500">
                    {achievement.icon}
                  </div>
                  <span className="px-3 py-1 rounded-full border border-brand-border bg-brand-bg/50 text-xs font-medium tracking-wide text-brand-muted uppercase">
                    {achievement.date}
                  </span>
                </div>

                <div>
                  <p className="text-yellow-500/80 font-medium text-xs tracking-widest uppercase mb-1 font-body group-hover:text-yellow-400 transition-colors">
                    {achievement.category}
                  </p>
                  <h3 className="text-xl font-display font-bold text-white tracking-[0.05em] leading-snug mb-2">{achievement.title}</h3>
                  <p className="text-brand-muted text-sm leading-relaxed font-body group-hover:text-white/80 transition-colors duration-300">
                    {achievement.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Achievements;
