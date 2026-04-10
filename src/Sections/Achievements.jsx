import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

// Provide placeholder achievements since we don't have the real data yet.
const achievementsData = [
  {
    title: "1st Place — National Hackathon",
    category: "Hackathon",
    date: "Aug 2023",
    description: "Built a full-stack emergency response system in 24 hours. First place out of 200+ teams.",
    icon: "🏆"
  },
  {
    title: "Open Source Contributor",
    category: "Community",
    date: "2023",
    description: "Merged PRs into React UI libraries focused on accessibility improvements. Small diffs, real impact.",
    icon: "🌟"
  },
  {
    title: "Best UI/UX Award",
    category: "Design",
    date: "Dec 2023",
    description: "SkillTube took home best design at the regional tech fest. The interface did the talking.",
    icon: "🎨"
  },
  {
    title: "Top 10% on LeetCode",
    category: "Problem Solving",
    date: "2024",
    description: "Consistent problem-solving practice, not just contest grinding. Top 10% globally.",
    icon: "💻"
  }
];

const Achievements = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const trophyRefs = useRef([]);

  const setTrophyRef = (index) => (el) => {
    trophyRefs.current[index] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Trophies entrance
    gsap.fromTo(trophyRefs.current,
      { 
        y: 100, 
        opacity: 0, 
        scale: 0.8,
        rotateX: 15
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 0.9,
        stagger: 0.2,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="achievements" 
      className="relative flex flex-col justify-start items-center min-h-screen w-full px-6 md:px-12 lg:px-24 pt-32 pb-32 text-brand-text overflow-hidden"
    >
      <div className="w-full max-w-7xl flex flex-col items-center mb-24">
        {/* Section Heading */}
        <div ref={headingRef} className="text-center">
          <SplitText 
            text="ACHIEVEMENTS" 
            className="font-display text-[clamp(2.5rem,6vw,6rem)] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-brand-accent tracking-widest leading-none" 
            delay={0} 
            duration={0.8} 
            ease="power3.out" 
            splitType="chars" 
            from={{ opacity: 0, y: 50, scale: 0.9 }} 
            to={{ opacity: 1, y: 0, scale: 1 }} 
            threshold={0.5} 
          />
          <div className="text-brand-accent tracking-widest uppercase text-sm mt-4 font-body">Milestones & Wins</div>
        </div>
      </div>

      {/* Trophy Wall Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 pointer-events-auto">
        {achievementsData.map((achievement, index) => (
          <div 
            key={index}
            ref={setTrophyRef(index)}
            className="group relative flex flex-col gap-6 p-8 rounded-[2rem] bg-brand-surface border border-brand-border backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-yellow-500/50 hover:shadow-[0_10px_40px_rgba(234,179,8,0.15)] overflow-hidden"
          >
            {/* Golden Glow Effect on Hover */}
            <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

            <div className="flex justify-between items-start">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-brand-surface-hover border border-brand-border text-3xl group-hover:scale-110 transition-transform duration-500">
                {achievement.icon}
              </div>
              <span className="px-4 py-1.5 rounded-full border border-brand-border bg-brand-bg/50 text-xs font-medium tracking-wide text-brand-muted uppercase">
                {achievement.date}
              </span>
            </div>

            <div>
              <p className="text-yellow-500/80 font-medium text-xs tracking-widest uppercase mb-2 font-body group-hover:text-yellow-400 transition-colors">
                {achievement.category}
              </p>
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                {achievement.title}
              </h3>
              <p className="text-brand-muted text-[1.05rem] leading-relaxed font-body group-hover:text-white/80 transition-colors duration-300">
                {achievement.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Achievements;

