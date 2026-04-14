import { useEffect, useState } from "react";
import Lenis from "lenis";
import Particles from "./Components/Particles";
import Loader from "./Components/Loader";
import Me from "./Sections/Me";
import About from "./Sections/About";
import Education from "./Sections/Education";
import Achievements from "./Sections/Achievements";
import Projects from "./Sections/Projects";
import Contact from "./Sections/Contact";
import Skills from "./Sections/Skills";
import Experience from "./Sections/Experience";
import Youtube from "./Sections/Youtube";
import Navbar from "./Sections/Navbar";
import { ScrollTrigger, syncLenisWithScrollTrigger } from "./lib/gsapScroll";

// Accessibility: respect OS-level reduced motion preference
const PREFERS_REDUCED_MOTION = typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_MOBILE_TOUCH = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

function App() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);

  useEffect(() => {
    if (!loaderComplete) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [loaderComplete]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
      infinite: false,
      wheelMultiplier: 1,
      lerp: 0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });
    const cleanupScrollSync = syncLenisWithScrollTrigger(lenis);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    ScrollTrigger.refresh();

    return () => {
      cleanupScrollSync();
      lenis.destroy();
    };
  }, []);

  return (
    <>
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
        {/* Particle background — pauses on tab switch via visibilitychange */}
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
      </div>

      <Loader isAppLoaded={splineLoaded} onComplete={() => setLoaderComplete(true)} />

      <div className="relative z-10 w-full overflow-hidden text-brand-text min-h-screen bg-transparent pointer-events-none">
        <Navbar />
        <Me
          onSplineLoad={() => setSplineLoaded(true)}
          isAppReady={loaderComplete}
        />
        <About />
        <Projects />
        <Skills />
        <Experience />
        <Education />
        <Achievements />
        <Youtube />
        <Contact />
      </div>
    </>
  );
}

export default App;
