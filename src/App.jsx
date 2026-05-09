import { useEffect, useState, Suspense, lazy } from "react";
import Lenis from "lenis";

// ─── Eagerly loaded (critical path) ──────────────────────────────────────────
import Loader  from "./Components/Loader";
import Navbar  from "./Sections/Navbar";
import Me      from "./Sections/Me";

// ─── Lazy: Particles ──────────────────────────────────────────────────────────
// Deferred so the heavy `ogl` WebGL bundle doesn't block the initial parse.
// A 100 ms render-gate prevents any background flash while the chunk downloads.
const Particles = lazy(() => import("./Components/Particles"));

// ─── Lazy: Sections (below-the-fold) ─────────────────────────────────────────
// Each section's chunk is fetched only when LazySection's IntersectionObserver
// fires (300px before the section enters the viewport).
const About       = lazy(() => import("./Sections/About"));
const Projects    = lazy(() => import("./Sections/Projects"));
const Skills      = lazy(() => import("./Sections/Skills"));
const Experience  = lazy(() => import("./Sections/Experience"));
const Education   = lazy(() => import("./Sections/Education"));
const Achievements = lazy(() => import("./Sections/Achievements"));
const Youtube     = lazy(() => import("./Sections/Youtube"));
const Contact     = lazy(() => import("./Sections/Contact"));

// ─── Lazy-section infrastructure ─────────────────────────────────────────────
import LazySection from "./Components/LazySection";

// ─── GSAP scroll setup ────────────────────────────────────────────────────────
import { gsap, ScrollTrigger, syncLenisWithScrollTrigger } from "./lib/gsapScroll";

// ─── Accessibility / device flags ─────────────────────────────────────────────
const PREFERS_REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const IS_MOBILE_TOUCH =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);

  // Delay-gate for Particles — avoids a background "flash" while the ogl
  // bundle is downloading. 100 ms is enough for the black bg div to paint.
  const [particlesReady, setParticlesReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setParticlesReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  // Lock / unlock body scroll around the loader sequence
  useEffect(() => {
    document.body.style.overflow = loaderComplete ? "auto" : "hidden";
  }, [loaderComplete]);

  // Lenis smooth-scroll setup
  // Skipped on touch devices — native iOS/Android momentum scroll is faster
  // and consumes 0 JS. Lenis on mobile also fights native overscroll/inertia.
  useEffect(() => {
    if (IS_MOBILE_TOUCH) {
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
      ScrollTrigger.refresh();
      return;
    }

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      infinite: false,
      wheelMultiplier: 1,
      lerp: 0.1,
    });

    const cleanupScrollSync = syncLenisWithScrollTrigger(lenis);

    // Piggyback on GSAP’s existing RAF ticker instead of creating a competing
    // requestAnimationFrame loop. This guarantees Lenis and GSAP always share
    // the same animation frame and never step on each other.
    const tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    // Pause when the tab is backgrounded — stops Lenis burning CPU/battery
    // in tabs the user can’t see.
    const handleVisibility = () => {
      document.hidden ? lenis.stop() : lenis.start();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(tickerFn);
      document.removeEventListener("visibilitychange", handleVisibility);
      cleanupScrollSync();
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Fixed particle background ── */}
      <div
        style={{
          width: "100%",
          height: "100dvh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: "black",
        }}
      >
        {/*
          Particles is lazy-loaded.
          particlesReady gate: wait 100 ms before rendering so the black
          background div is already painted — no canvas flash on initial load.
          Suspense fallback is null (background stays plain black, undetectable).
        */}
        {particlesReady && (
          <Suspense fallback={null}>
            <Particles
              particleColors={["#ffffff", "#ffffff"]}
              particleCount={IS_MOBILE_TOUCH ? 100 : 200}
              particleSpread={10}
              speed={0.04}
              particleBaseSize={100}
              moveParticlesOnHover={!IS_MOBILE_TOUCH}
              alphaParticles={false}
              disableRotation={false}
            />
          </Suspense>
        )}
      </div>

      {/* ── Loading screen (eager) ── */}
      <Loader isAppLoaded={splineLoaded} onComplete={() => setLoaderComplete(true)} />

      {/* ── Page content ── */}
      <div className="relative z-10 w-full overflow-hidden text-brand-text min-h-screen bg-transparent pointer-events-none">

        {/* Navbar — eager, always visible */}
        <Navbar />

        {/* Me — eager, owns the SplineScene → Loader callback chain */}
        <Me
          onSplineLoad={() => setSplineLoaded(true)}
          isAppReady={loaderComplete}
        />

        {/* ── Below-the-fold sections — each mounted on first viewport entry ── */}

        <LazySection>
          <About />
        </LazySection>

        <LazySection>
          <Projects />
        </LazySection>

        <LazySection>
          <Skills />
        </LazySection>

        <LazySection>
          <Experience />
        </LazySection>

        <LazySection>
          <Education />
        </LazySection>

        <LazySection>
          <Achievements />
        </LazySection>

        <LazySection>
          <Youtube />
        </LazySection>

        {/* Contact is the last section — use a tighter margin so it loads
            promptly without waiting for a full scroll */}
        <LazySection rootMargin="500px" height="auto">
          <Contact />
        </LazySection>
      </div>
    </>
  );
}

export default App;
