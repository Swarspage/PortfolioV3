import { useRef, useEffect } from "react";
import { gsap } from "../lib/gsapScroll";
import pfp from "../assets/image.png";
import bannerImg from "../assets/utubebanner.png";

// ─── Data ───────────────────────────────────────────────────────────────────
const recentVideos = [
  {
    title: "Project Showcase",
    label: "Live Stream",
    thumbnail: "https://img.youtube.com/vi/lDWuxWCVywc/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=lDWuxWCVywc",
  },
  {
    title: "Building Session #1",
    label: "Past Stream",
    thumbnail: "https://img.youtube.com/vi/ZVaLEBNFlzc/maxresdefault.jpg",
    link: "https://www.youtube.com/watch?v=ZVaLEBNFlzc",
  },
  {
    title: "Building Session #2",
    label: "Past Stream",
    thumbnail: "https://img.youtube.com/vi/5Y-RAEXeUjU/hqdefault.jpg",
    link: "https://www.youtube.com/watch?v=5Y-RAEXeUjU",
  },
];

const featuredVideo = {
  id: "lDWuxWCVywc",
  link: "https://www.youtube.com/watch?v=lDWuxWCVywc",
};

// ─── Component ──────────────────────────────────────────────────────────────
const Youtube = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const videoListRef = useRef([]);

  const setVideoRef = (i) => (el) => { videoListRef.current[i] = el; };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !inner || !left || !right) return;

    const videos = videoListRef.current.filter(Boolean);

    // Initial state
    gsap.set(inner, { opacity: 0, scale: 0.92, filter: "blur(10px)" });
    gsap.set(left, { opacity: 0, x: -60 });
    gsap.set(right, { opacity: 0, x: 60 });
    gsap.set(videos, { opacity: 0, y: 20 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=260%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // ENTRANCE
    masterTl.to(inner, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
    masterTl.to(left, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");
    masterTl.to(right, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.55");
    masterTl.to(videos, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.2");

    // HOLD
    masterTl.to({}, { duration: 1.2 });

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
      id="youtube"
      className="relative h-screen w-full overflow-hidden text-brand-text"
    >
      {/* Subtle red glow */}
      <div className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] bg-red-700/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Opacity / scale wrapper */}
      <div ref={innerRef} className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-20 pt-16 lg:pt-0">

        {/* ── Label ── */}
        <p className="text-brand-muted tracking-[0.3em] uppercase text-[10px] lg:text-xs font-body mb-3 lg:mb-6">Building in Public</p>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 w-full max-w-7xl mx-auto h-auto lg:h-[calc(100vh-12rem)] lg:max-h-[560px]">

          {/* ── LEFT: Featured Video ── */}
          <div ref={leftRef} className="flex-1 flex flex-col gap-2 lg:gap-3 min-w-0">

            {/* Channel identity row */}
            <div className="flex items-center gap-3">
              <img src={pfp} alt="Swardevv" className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-border" />
              <div>
                <p className="font-display font-bold text-white text-sm leading-none">Swardevv</p>
                <p className="text-brand-muted text-xs">@Swardevv</p>
              </div>
              <a
                href="https://www.youtube.com/@Swardevv"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 transition-colors text-white text-xs font-body font-semibold pointer-events-auto"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.5 6.2S23.2 4.1 22.3 3.2c-1-.9-2.2-.9-2.7-.9C16.4 2 12 2 12 2s-4.4 0-7.6.3c-.5.1-1.7.1-2.7 1C.8 4.2.5 6.2.5 6.2S.2 8.6.2 11v2.2c0 2.4.3 4.8.3 4.8s.3 2.1 1.2 3c1 .9 2.3.9 2.9 1C5.6 22 12 22 12 22s4.4 0 7.6-.3c.5-.1 1.7-.1 2.7-1 .9-.9 1.2-3 1.2-3s.3-2.4.3-4.8V11c0-2.4-.3-4.8-.3-4.8zM9.7 15.5V8l6.5 3.8-6.5 3.7z" />
                </svg>
                Subscribe
              </a>
            </div>

            {/* Featured video embed */}
            <div className="relative w-full aspect-video lg:flex-1 lg:aspect-auto rounded-xl lg:rounded-2xl overflow-hidden bg-black ring-1 ring-brand-border shadow-2xl pointer-events-auto shrink-0">
              <iframe
                src={`https://www.youtube.com/embed/${featuredVideo.id}?rel=0&modestbranding=1`}
                title="Featured Video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Stats row / bottom padding */}
            <div className="flex items-center justify-end shrink-0 pt-1">
              <a
                href="https://www.youtube.com/@Swardevv/videos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] lg:text-xs font-body text-brand-muted hover:text-white transition-colors tracking-wide pointer-events-auto"
              >
                View all <span className="hidden sm:inline">videos</span> →
              </a>
            </div>
          </div>

          {/* ── RIGHT: Recent Uploads ── */}
          <div ref={rightRef} className="w-full lg:w-72 flex flex-col gap-2 lg:gap-3 min-w-0 shrink-0">
            <p className="text-brand-muted text-[10px] lg:text-xs tracking-widest uppercase font-body">Recent Uploads</p>

            <div className="flex flex-col gap-2 lg:gap-3 flex-1 pointer-events-auto">
              {recentVideos.map((v, i) => (
                <a
                  key={i}
                  ref={setVideoRef(i)}
                  href={v.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 p-2.5 lg:p-3 rounded-xl bg-brand-surface border border-brand-border hover:bg-brand-surface-hover hover:border-brand-accent/30 transition-all duration-300 pointer-events-auto ${i === 2 ? "hidden lg:flex" : ""}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-12 lg:w-24 lg:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                    <img
                      src={v.thumbnail}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                  </div>
                  {/* Info */}
                  <div className="flex flex-col min-w-0">
                    <p className="text-white text-xs lg:text-sm font-body font-medium leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">{v.title}</p>
                    <p className="text-brand-muted text-[10px] lg:text-xs mt-0.5">{v.label}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Banner strip */}
            <div className="relative rounded-xl overflow-hidden h-16 lg:h-20 flex-shrink-0 hidden sm:block pointer-events-none mt-auto">
              <img src={bannerImg} alt="Channel Banner" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-4">
                <p className="text-white text-xs font-body tracking-wide">Swardevv — building in public</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Youtube;