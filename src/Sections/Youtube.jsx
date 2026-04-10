import { useRef, useEffect } from "react";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";
import pfp from "../assets/image.png";
import bannerImg from "../assets/utubebanner.png";

// Placeholder data for YouTube
const channelStats = {
  subscribers: "1.2K+",
  views: "150K+",
  videos: "24",
};

const videosData = [
  {
    title: "Project Showcase",
    views: "Live Stream",
    time: "Recently",
    thumbnail: "https://img.youtube.com/vi/lDWuxWCVywc/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=lDWuxWCVywc&t=337s"
  },
  {
    title: "Building Session #1",
    views: "Live Stream",
    time: "Past stream",
    thumbnail: "https://img.youtube.com/vi/ZVaLEBNFlzc/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=ZVaLEBNFlzc&t=3790s"
  },
  {
    title: "Building Session #2",
    views: "Live Stream",
    time: "Past stream",
    thumbnail: "https://img.youtube.com/vi/5Y-RAEXeUjU/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=5Y-RAEXeUjU&t=1497s"
  }
];

const Youtube = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const playerRef = useRef(null);
  const cardsRef = useRef([]);

  const setCardRef = (index) => (el) => {
    cardsRef.current[index] = el;
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Timeline for YouTube section entrance
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });

    // Main Player reveal
    tl.fromTo(playerRef.current,
      { opacity: 0, scale: 0.9, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Video cards reveal
    tl.fromTo(cardsRef.current,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" },
      "-=0.5"
    );

  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="youtube" 
      className="relative flex flex-col justify-start items-center min-h-screen w-full px-6 md:px-12 lg:px-24 pt-32 pb-32 text-brand-text overflow-hidden"
    >
      {/* Background Red/Pink Glow for YouTube Brand vibe */}
      {/* Background Red/Pink Glow - Removed */ }

      <div className="z-10 w-full max-w-7xl flex flex-col items-center mb-16">
        {/* Section Heading */}
        <div ref={headingRef} className="text-center">
          <SplitText 
            text="YOUTUBE" 
            className="font-display text-[clamp(3.5rem,8vw,7rem)] font-bold text-white tracking-widest leading-none" 
            delay={0} 
            duration={0.8} 
            ease="power3.out" 
            splitType="chars" 
            from={{ opacity: 0, y: 50, scale: 0.9 }} 
            to={{ opacity: 1, y: 0, scale: 1 }} 
            threshold={0.5} 
          />
          <div className="text-red-400 tracking-widest uppercase text-sm mt-4 font-body font-medium">Building in public</div>
        </div>
      </div>

      <div className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 lg:gap-12 pointer-events-auto">
        
        {/* Main "Player" Panel (Channel Stats & Featured Content) */}
        <div 
          ref={playerRef}
          className="w-full lg:w-2/3 flex flex-col rounded-[2rem] bg-brand-surface backdrop-blur-md border border-brand-border shadow-2xl overflow-hidden group hover:border-red-500/30 transition-colors duration-500"
        >
          {/* Faux Video Player Header */}
          <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
            {/* Play Button Pulse */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </div>
              <div className="absolute w-20 h-20 bg-red-600/30 rounded-full animate-ping z-[-1]"></div>
            </div>
            {/* Thumbnail background */}
            <img 
              src={bannerImg} 
              alt="Channel Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-700 blur-[2px] group-hover:blur-0 transform scale-105 group-hover:scale-100"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-transparent to-transparent z-10"></div>
          </div>

          {/* Channel Info & Stats */}
            <div className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-20 -mt-16 bg-gradient-to-b from-transparent to-brand-surface">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-border border-2 border-brand-bg flex-shrink-0 overflow-hidden shadow-lg">
                <img src={pfp} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white">Swardevv</h3>
                <a href="https://www.youtube.com/@Swardevv" target="_blank" rel="noreferrer" className="text-brand-muted font-body hover:text-brand-accent transition-colors">@Swardevv</a>
              </div>
            </div>
            
            <div className="flex gap-6 w-full md:w-auto">
              {Object.entries(channelStats).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center md:items-end">
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-xs uppercase tracking-widest text-brand-muted">{key}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="px-8 pb-8">
            <a href="https://www.youtube.com/@Swardevv" target="_blank" rel="noreferrer" className="inline-block px-8 py-3 w-full text-center rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide transition-colors duration-300">
              Subscribe to Channel
            </a>
            <p className="mt-6 text-brand-muted font-body text-sm text-center italic opacity-80 leading-relaxed px-4">
              "Occasionally I hit record while building. The project showcase is worth your time. The streams are... a work in progress."
            </p>
          </div>
        </div>

        {/* Recent Videos Sidebar */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <h4 className="text-lg font-medium text-white/80 tracking-wide font-body mb-2 pl-2">Recent Uploads</h4>
          
          <div className="flex flex-col gap-4">
            {videosData.map((video, index) => (
              <a 
                key={index} 
                href={video.link}
                ref={setCardRef(index)}
                className="group flex gap-4 p-3 rounded-2xl bg-brand-surface/50 border border-brand-border/50 hover:bg-brand-surface hover:border-red-500/30 transition-all duration-300"
              >
                {/* Thumb */}
                <div className="w-32 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[10px] text-white">10:42</div>
                </div>
                {/* Meta */}
                <div className="flex flex-col justify-between py-0.5">
                  <h5 className="text-white text-sm font-medium line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h5>
                  <div className="text-xs text-brand-muted mt-1 font-body">
                    <p>{video.views} • {video.time}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <a href="#" className="mt-4 text-center text-sm font-medium text-brand-muted hover:text-white transition-colors py-2 border border-brand-border rounded-xl hover:bg-brand-surface">
            View All Videos
          </a>

        </div>

      </div>
    </section>
  );
};

export default Youtube;