import { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import discord from "../assets/discord.webp";
import linkedin from "../assets/linkedin-logo.webp";
import github from "../assets/github.webp";
import x from "../assets/X.webp";
import emailIcon from "../assets/email.webp";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

// ─── Constants ────────────────────────────────────────────────────────────────
const IS_COARSE = typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

// ─── Social data ──────────────────────────────────────────────────────────────
const SOCIALS = [
  { label: "Discord", icon: discord, val: "itsme.3974", onClick: () => { navigator.clipboard.writeText("itsme.3974"); alert("Copied Discord ID!"); } },
  { label: "LinkedIn", icon: linkedin, val: "swar-shinde", onClick: () => window.open("https://www.linkedin.com/in/swar-shinde-91131a2b9/", "_blank") },
  { label: "Github", icon: github, val: "Swarspage", onClick: () => window.open("https://github.com/Swarspage", "_blank") },
  { label: "X", icon: x, val: "@Swars_page", onClick: () => window.open("https://x.com/Swars_page", "_blank") },
  { label: "Email", icon: emailIcon, val: "shindeswar@hotmail.com", onClick: () => window.open("mailto:shindeswar@hotmail.com", "_blank") },
];

// ─── Reusable input field (static label above — reliable across all browsers) ─
function Field({ id, label, as: Tag = "input", type = "text", value, onChange, rows, className = "" }) {
  return (
    <div className={`animate-stagger flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={id}
        className="text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-brand-accent/70 select-none"
      >
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={`Enter your ${label.toLowerCase()}`}
        className={`w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-accent/5 focus:ring-1 focus:ring-brand-accent/25 transition-all duration-300 placeholder:text-white/20 resize-none`}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const COOLDOWN_MINUTES = 5;
  const COOLDOWN_MS = COOLDOWN_MINUTES * 60 * 1000;
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches
  );
  // Toast notification — replaces window.alert() which froze all animations
  const [toast, setToast] = useState(null); // { msg: string, type: 'error'|'success' }
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const formCardRef = useRef(null);
  const infoCardRef = useRef(null);

  // ── Responsive listener ────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Clock — only ticks while Contact section is visible ────────────────
  // Prevents a setCurrentTime re-render every second while the user is
  // reading the hero or any other section above.
  useEffect(() => {
    const section = sectionRef.current;
    let timer = null;

    const startClock = () => {
      if (timer) return; // already running
      timer = window.setInterval(() => setCurrentTime(new Date()), 1000);
    };
    const stopClock = () => {
      window.clearInterval(timer);
      timer = null;
    };

    const observer = new IntersectionObserver(
      ([entry]) => { entry.isIntersecting ? startClock() : stopClock(); },
      { threshold: 0.05 }
    );

    if (section) observer.observe(section);
    return () => { observer.disconnect(); stopClock(); };
  }, []);

  // ── Mouse radial glow (desktop only, rAF-throttled) ────────────────────────
  const handleMouseMove = (e, ref) => {
    if (IS_COARSE || !ref.current) return;
    if (ref.current._ticking) return;
    ref.current._ticking = true;
    requestAnimationFrame(() => {
      if (ref.current) {
        const { left, top } = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--mouse-x", `${e.clientX - left}px`);
        ref.current.style.setProperty("--mouse-y", `${e.clientY - top}px`);
        ref.current._ticking = false;
      }
    });
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatISTTime = () =>
    currentTime.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // 1. LocalStorage Cooldown Check
    const lastSent = localStorage.getItem("lastEmailSent");
    if (lastSent) {
      const timeElapsed = Date.now() - parseInt(lastSent, 10);
      if (timeElapsed < COOLDOWN_MS) {
        const minutesLeft = Math.ceil((COOLDOWN_MS - timeElapsed) / 60000);
        showToast(`Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''} before sending another message.`, "error");
        return;
      }
    }

    // 2. Validation
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill out all fields.", "error");
      return;
    }

    // 3. Lock UI
    setIsSubmitting(true);

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { from_name: formData.name, from_email: formData.email, message: formData.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        showToast("Message sent successfully! I'll be in touch.", "success");
        setFormData({ name: "", email: "", message: "" });
        localStorage.setItem("lastEmailSent", Date.now().toString());
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        showToast("Something went wrong. Please try again.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/Swar-Resume.pdf"; link.download = "Swar-Resume.pdf";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // ── One-time entrance animation ────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const form = formRef.current;
    const info = infoRef.current;
    if (!section || !inner || !form || !info) return;

    const formItems = [...form.querySelectorAll(".animate-stagger")];
    const socialItems = [...info.querySelectorAll(".social-stagger")];
    const hudItem = info.querySelector(".hud-animate");

    gsap.set(inner, { autoAlpha: 0 });
    gsap.set(form, { autoAlpha: 0, x: -50 });
    gsap.set(info, { autoAlpha: 0, x: 50 });
    gsap.set([...formItems, ...socialItems, hudItem].filter(Boolean), { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none none" },
    });

    tl.to(inner, { autoAlpha: 1, duration: 0.5, ease: "power3.out" })
      .to(form, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.2")
      .to(info, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.6")
      .to(formItems, { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.45, ease: "power2.out" }, "-=0.3")
      .to(socialItems, { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" }, "-=0.4")
      .to(hudItem, { autoAlpha: 1, y: 0, duration: 0.55, ease: "back.out(1.7)" }, "-=0.15");

    return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill(); };
  }, []);

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    /*
      Desktop (lg+): h-dvh — everything on screen, no scroll within section.
      Mobile: natural height — scrolls normally, keyboard won't break layout.
    */
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full lg:h-dvh bg-transparent text-brand-text"
    >
      {/* Decorative ambient glow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[60vw] h-[40vh] rounded-full pointer-events-none blur-[120px] opacity-15"
        style={{ background: "radial-gradient(ellipse, rgba(191,219,254,0.18) 0%, transparent 70%)" }}
      />

      {/* ── Full-height inner flex column ── */}
      <div
        ref={innerRef}
        className="relative z-10 w-full h-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-20 flex flex-col lg:justify-center pt-20 md:pt-24 lg:pt-0 pb-8 lg:pb-0"
      >

        {/* ── Heading (Absolute on mobile for consistent layout and space, relative on desktop) ── */}
        <div className="absolute top-0 left-0 right-0 md:relative flex-shrink-0 text-center mb-0 md:mb-7 lg:mb-10 z-20 pointer-events-none">
          <div className="p-6 pt-24 pb-6 md:p-0 flex flex-col items-center drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] md:drop-shadow-none">
            <SplitText
              text="CONTACT"
              className="font-display text-[clamp(2.5rem,8vw,6.5rem)] font-bold text-white tracking-[0.15em] leading-none drop-shadow-2xl md:drop-shadow-none"
              delay={0} duration={1.1} ease="expo.out" splitType="chars"
              from={{ opacity: 0, y: 80, rotateX: -80, scale: 0.85 }}
              to={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              threshold={0.5}
            />
            <p className="text-brand-accent tracking-[0.3em] uppercase text-[10px] sm:text-xs mt-3 font-body opacity-90 drop-shadow-lg md:drop-shadow-none md:opacity-75">
              Initiate Connection Sequence
            </p>
          </div>
        </div>

        {/* ── Two panels — centered instead of stretched ── */}
        <div className="mt-28 md:mt-0 w-full flex flex-col lg:flex-row gap-4 md:gap-5 pointer-events-auto items-stretch">

          {/* ═══════════ LEFT: Form Panel ═══════════ */}
          <div ref={formRef} className="w-full lg:w-[58%] flex flex-col">
            <div
              ref={formCardRef}
              onMouseMove={(e) => handleMouseMove(e, formCardRef)}
              className="group relative flex flex-col flex-1 p-5 sm:p-8 lg:p-7 rounded-[2rem] bg-brand-surface/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 hover:border-brand-accent/20"
              style={{ "--mouse-x": "50%", "--mouse-y": "50%" }}
            >
              {!IS_COARSE && (
                <div aria-hidden="true"
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(191,219,254,0.07), transparent 40%)" }}
                />
              )}

              <h3 className="animate-stagger flex-shrink-0 text-xl sm:text-2xl lg:text-xl font-display font-medium text-white mb-4 sm:mb-6 lg:mb-4 flex items-center gap-4">
                <span className="w-5 h-px bg-brand-accent/50 flex-shrink-0" />
                Send a Message
              </h3>

              {/* form uses natural height */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 flex-1">
                <Field id="name" label="Your Name" type="text" value={formData.name} onChange={handleChange} />
                <Field id="email" label="Your Email" type="email" value={formData.email} onChange={handleChange} />

                {/* Message textarea uses fixed rows instead of flex-1 stretch */}
                <div className="animate-stagger flex flex-col gap-1.5 flex-1">
                  <label htmlFor="message" className="flex-shrink-0 text-[10px] font-body font-semibold tracking-[0.25em] uppercase text-brand-accent/70 select-none">
                    Your Message
                  </label>
                  <textarea
                    id="message" name="message"
                    value={formData.message} onChange={handleChange}
                    rows={isMobile ? 4 : 5}
                    placeholder="Enter your message"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white font-body text-sm focus:outline-none focus:border-brand-accent/60 focus:bg-brand-accent/5 focus:ring-1 focus:ring-brand-accent/25 transition-all duration-300 placeholder:text-white/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`animate-stagger flex-shrink-0 group relative overflow-hidden rounded-xl border border-white/15 px-7 py-3 transition-all duration-300 w-full sm:w-auto ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-white/5' : 'hover:border-brand-accent/50 hover:shadow-[0_0_24px_rgba(191,219,254,0.15)] active:scale-95'}`}
                >
                  {!isSubmitting && <div className="absolute inset-0 bg-brand-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />}
                  <span className={`relative z-10 font-display text-sm tracking-widest uppercase font-bold transition-colors duration-300 flex items-center justify-center gap-2 ${isSubmitting ? 'text-white' : 'text-white group-hover:text-brand-accent'}`}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Deploying...
                      </>
                    ) : (
                      "Deploy Message"
                    )}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* ═══════════ RIGHT: Socials + HUD ═══════════ */}
          <div ref={infoRef} className="w-full lg:w-[42%] flex flex-col gap-4">

            {/* Socials card — flex-1 so it grows to fill */}
            <div
              ref={infoCardRef}
              onMouseMove={(e) => handleMouseMove(e, infoCardRef)}
              className="group relative flex-1 min-h-0 p-5 sm:p-7 lg:p-6 rounded-[2rem] bg-brand-surface/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 hover:border-brand-accent/20 flex flex-col"
              style={{ "--mouse-x": "50%", "--mouse-y": "50%" }}
            >
              {!IS_COARSE && (
                <div aria-hidden="true"
                  className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: "radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(191,219,254,0.07), transparent 40%)" }}
                />
              )}

              <h3 className="flex-shrink-0 text-lg sm:text-xl font-display font-medium text-white mb-4 flex items-center gap-3">
                <span className="w-5 h-px bg-brand-accent/50 flex-shrink-0" />
                Digital Footprint
              </h3>

              <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2.5 flex-1 content-start">
                {SOCIALS.map((social) => (
                  <button
                    key={social.label}
                    type="button"
                    onClick={social.onClick}
                    className="social-stagger group/btn relative flex items-center gap-3 p-3 sm:p-3.5 rounded-[1rem] bg-black/20 border border-white/8 hover:border-brand-accent/35 transition-all duration-300 overflow-hidden text-left min-h-[52px]"
                  >
                    <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover/btn:border-brand-accent/30 transition-colors">
                      <img src={social.icon} alt={social.label} className="w-4 h-4 object-contain group-hover/btn:scale-110 transition-transform duration-300" />
                    </div>
                    <div className="relative z-10 flex flex-col items-start min-w-0">
                      <span className="text-white font-body text-xs font-medium tracking-wide leading-tight">{social.label}</span>
                      <span className="text-[9px] text-brand-muted font-mono group-hover/btn:text-brand-accent transition-colors truncate max-w-[100px] sm:max-w-[130px]">{social.val}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Status HUD */}
            <div className="hud-animate flex-shrink-0 p-4 sm:p-6 rounded-[2rem] bg-brand-surface/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-brand-accent/[0.025] pointer-events-none" />

              <div className="relative z-10 flex flex-col gap-1 text-center sm:text-left w-full sm:w-auto">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="flex h-1.5 w-1.5 relative flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent" />
                  </div>
                  <span className="text-[9px] font-mono text-brand-accent tracking-[0.25em] uppercase">Status: Live</span>
                </div>
                <span className="text-xl sm:text-2xl font-mono font-bold text-white tabular-nums tracking-wider leading-none">
                  {formatISTTime()}
                </span>
                <span className="text-[8px] font-mono text-brand-muted uppercase tracking-[0.12em] mt-0.5 opacity-60">
                  Navi Mumbai | Pune
                </span>
              </div>

              <button
                type="button"
                onClick={handleResumeDownload}
                className="group relative px-5 sm:px-7 py-3 overflow-hidden rounded-xl border border-white/10 hover:border-brand-accent/50 transition-all duration-300 bg-black/40 w-full sm:w-auto hover:shadow-[0_0_20px_rgba(191,219,254,0.15)] active:scale-95"
              >
                <div className="absolute inset-0 bg-brand-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative z-10 text-white font-display text-xs sm:text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2.5">
                  Access CV
                  <svg className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* ── Toast notification (replaces window.alert) ────────────────── */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            padding: "0.75rem 1.4rem",
            borderRadius: "999px",
            background: toast.type === "error"
              ? "rgba(239,68,68,0.18)"
              : "rgba(34,197,94,0.18)",
            border: `1px solid ${toast.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(34,197,94,0.4)"}`,
            backdropFilter: "blur(16px)",
            color: "#fff",
            fontSize: "0.875rem",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.01em",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            pointerEvents: "none",
            animation: "fadeSlideIn 0.35s ease-out both",
          }}
        >
          <span style={{ fontSize: "1rem" }}>
            {toast.type === "error" ? "✕" : "✓"}
          </span>
          {toast.msg}
        </div>
      )}
    </section>
  );
};

export default Contact;
