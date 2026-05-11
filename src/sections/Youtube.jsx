import { useRef, useEffect, useState } from "react";
import { gsap } from "../lib/gsapScroll";
import pfp from "../assets/image.webp";
import bannerImg from "../assets/utubebanner.webp";

// Skip filter:blur on mobile — prevents expensive GPU layer compositing on low-power devices
const IS_MOBILE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Data ───────────────────────────────────────────────────────────────────
import youtubeData from "../data/YoutubeData.json";
const { featuredVideo, recentVideos } = youtubeData;

// ─── Component ──────────────────────────────────────────────────────────────
const Youtube = () => {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const videoListRef = useRef([]);
  // Click-to-play: defer iframe (and all YouTube JS/analytics) until user interaction
  const [playing, setPlaying] = useState(false);
  const featuredThumb = `https://img.youtube.com/vi/${featuredVideo.id}/maxresdefault.jpg`;

  const setVideoRef = (i) => (el) => { videoListRef.current[i] = el; };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!section || !inner || !left || !right) return;

    const videos = videoListRef.current.filter(Boolean);

    // Initial state
    gsap.set(inner, { opacity: 0, scale: 0.92, ...(IS_MOBILE ? {} : { filter: "blur(10px)" }) });
    gsap.set(left, { opacity: 0, x: -60 });
    gsap.set(right, { opacity: 0, x: 60 });
    gsap.set(videos, { opacity: 0, y: 20 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // ENTRANCE
    masterTl.to(inner, { opacity: 1, scale: 1, ...(IS_MOBILE ? {} : { filter: "blur(0px)" }), duration: 0.8, ease: "power3.out" });
    masterTl.to(left, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");
    masterTl.to(right, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.55");
    masterTl.to(videos, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: "power2.out" }, "-=0.2");

    // HOLD
    masterTl.to({}, { duration: 1.2 });

    // EXIT
    masterTl.to(inner, { opacity: 0, scale: 0.88, ...(IS_MOBILE ? {} : { filter: "blur(10px)" }), duration: 0.8, ease: "power2.in" });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-dvh w-full overflow-hidden text-brand-text"
    >
      {/* Subtle red glow */}
      <div className="absolute right-[-5%] top-[20%] w-[40vw] h-[40vw] bg-red-700/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Opacity / scale wrapper */}
      <div ref={innerRef} className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 lg:px-20 pt-16 lg:pt-0">

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full max-w-7xl mx-auto h-auto lg:h-[calc(100dvh-12rem)] lg:max-h-[600px] mt-8 lg:mt-0">

          {/* ── LEFT: Featured Video ── */}
          <div ref={leftRef} className="flex-1 flex flex-col gap-2 lg:gap-3 min-w-0">

            {/* Label — inside left column so it aligns with the video on desktop */}
            <p className="text-brand-muted tracking-[0.3em] uppercase text-[10px] lg:text-xs font-body mb-1 lg:mb-3">Building in Public</p>

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

            {/* Featured video — iframe deferred until user clicks play */}
            <div className="relative w-full aspect-video lg:h-full lg:aspect-auto rounded-xl lg:rounded-[2rem] overflow-hidden bg-black ring-1 ring-brand-border shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto shrink-0 will-change-transform">
              {playing ? (
                <iframe
                  src={`https://www.youtube.com/embed/${featuredVideo.id}?rel=0&modestbranding=1&autoplay=1`}
                  title="Featured Video"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  aria-label="Play featured video"
                  className="absolute inset-0 w-full h-full group"
                  data-cursor="card"
                  data-cursor-label="PLAY"
                >
                  <img
                    src={featuredThumb}
                    alt="Featured video thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:scale-110">
                      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
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
          <div ref={rightRef} className="w-full lg:w-80 flex flex-col gap-3 lg:gap-4 min-w-0 shrink-0 will-change-[opacity,transform]">
            <p className="text-brand-muted text-[10px] lg:text-xs tracking-widest uppercase font-body">Recent Uploads</p>

            <div className="flex flex-col gap-2 lg:gap-3 flex-1 pointer-events-auto">
              {recentVideos.map((v, i) => {
                const isLocked = v.isLocked;
                return (
                  <div
                    key={i}
                    ref={setVideoRef(i)}
                    onClick={() => !isLocked && window.open(v.link, "_blank")}
                    className={`group flex items-center gap-3 p-2.5 lg:p-3 rounded-xl bg-brand-surface border border-brand-border transition-all duration-300 pointer-events-auto ${i === 2 ? "hidden lg:flex" : ""} ${isLocked ? "opacity-60 grayscale-[0.5]" : "hover:bg-brand-surface-hover hover:border-brand-accent/30 cursor-pointer"}`}
                    data-cursor="card"
                    data-cursor-label={isLocked ? "SOON" : "WATCH"}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-12 lg:w-24 lg:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${!isLocked ? "group-hover:scale-105" : "blur-[2px]"}`}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex flex-col min-w-0">
                      <p className={`text-white text-xs lg:text-sm font-body font-medium leading-snug line-clamp-2 transition-colors ${!isLocked && "group-hover:text-brand-accent"}`}>{v.title}</p>
                      <p className="text-brand-muted text-[10px] lg:text-xs mt-0.5">{isLocked ? "Locked Content" : v.label}</p>
                    </div>
                  </div>
                );
              })}
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