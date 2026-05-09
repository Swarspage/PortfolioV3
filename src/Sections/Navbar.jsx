import { useState, useEffect, useRef } from "react";
import { gsap } from "../lib/gsapScroll";

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("me");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);
  const listRef = useRef(null);

  const sections = [
    { id: "me", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "achievements", label: "Achievements" },
    { id: "youtube", label: "Youtube" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: "-45% 0px -45% 0px", threshold: 0 };
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => {
      sections.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
    );

    // Scroll animation for compact mode
    let lastScrollY = window.scrollY;
    let rafId = null;

    const handleScroll = () => {
      // rAF-throttle: classList mutation fires at most once per animation frame
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!listRef.current) return;
        if (window.scrollY > 50) {
          listRef.current.classList.add("py-2", "px-6", "bg-brand-surface-hover", "backdrop-blur-xl");
          listRef.current.classList.remove("py-3", "px-8", "bg-brand-surface", "backdrop-blur-md");
        } else {
          listRef.current.classList.add("py-3", "px-8", "bg-brand-surface", "backdrop-blur-md");
          listRef.current.classList.remove("py-2", "px-6", "bg-brand-surface-hover", "backdrop-blur-xl");
        }
        lastScrollY = window.scrollY;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => document.body.style.overflow = "";
  }, [isMenuOpen]);

  const scrollToSection = (sectionId) => {
    setIsMenuOpen(false); // Close mobile menu if open
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[60] w-full flex justify-center items-start pt-4 px-4 pointer-events-auto transition-transform duration-300"
      >
        <div
          ref={listRef}
          className="flex items-center justify-between w-full max-w-5xl rounded-2xl border border-brand-border bg-brand-surface backdrop-blur-md py-3 px-6 md:px-8 transition-all duration-300 shadow-lg"
        >
          <div className="font-display text-xl font-bold tracking-wider text-white relative z-10 cursor-pointer" onClick={() => scrollToSection("me")}>
            SWAR
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 no-scrollbar">
            {sections.map(({ id, label }) => (
              <li
                key={id}
                onClick={() => scrollToSection(id)}
                className={`relative cursor-pointer text-sm transition-colors duration-300 hover:text-white whitespace-nowrap ${activeSection === id ? "text-white font-bold" : "text-brand-muted font-medium"
                  }`}
              >
                {label}
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle Button */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 relative z-10 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className={`bg-white h-[2px] w-6 rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? "rotate-45 translate-y-[2px]" : "-translate-y-1"}`}></span>
            <span className={`bg-white h-[2px] w-6 rounded-full transition-all duration-300 ease-in-out ${isMenuOpen ? "-rotate-45 -translate-y-[2px]" : "translate-y-1"}`}></span>
          </button>
        </div>
      </nav>

      {/* Full-Screen Mobile Radial Menu */}
      <div
        className={`fixed inset-0 z-[55] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none scale-105"
          }`}
      >
        <ul className="flex flex-col items-center gap-6 w-full px-6 text-center">
          {sections.map(({ id, label }, index) => (
            <li
              key={id}
              onClick={() => scrollToSection(id)}
              className={`transform transition-all duration-500 cursor-pointer font-display text-4xl font-bold tracking-widest uppercase ${isMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
                }`}
              style={{ transitionDelay: isMenuOpen ? `${index * 50}ms` : "0ms" }}
            >
              <span className={`transition-colors duration-300 ${activeSection === id ? "text-white font-black" : "text-brand-muted hover:text-white font-semibold"
                }`}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Navbar;
