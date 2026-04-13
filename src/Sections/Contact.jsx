import { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import discord from "../assets/discord.webp";
import linkedin from "../assets/linkedin-logo.webp";
import github from "../assets/github.webp";
import x from "../assets/X.webp";
import emailIcon from "../assets/email.webp";
import SplitText from "../Components/SplitText";
import { gsap } from "../lib/gsapScroll";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const scrollRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);
  const formCardRef = useRef(null);
  const infoCardRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const m = window.matchMedia("(max-width: 1024px)");
    setIsMobile(m.matches);
    const handler = (e) => setIsMobile(e.matches);
    m.addEventListener("change", handler);

    return () => {
      window.clearInterval(timer);
      m.removeEventListener("change", handler);
    };
  }, []);

  // Interactive Glow Effect
  const handleMouseMove = (e, ref) => {
    if (isMobile || !ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    ref.current.style.setProperty("--mouse-x", `${x}px`);
    ref.current.style.setProperty("--mouse-y", `${y}px`);
  };

  const formatISTTime = () =>
    currentTime.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      window.alert("Please fill out all the fields.");
      return;
    }

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        window.alert("Message sent successfully.");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("EmailJS Error:", error);
        window.alert("Something went wrong while sending the message.");
      });
  };

  const handleResumeDownload = () => {
    const link = document.createElement("a");
    link.href = "/Swar-Resume.pdf";
    link.download = "Swar-Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const scroll = scrollRef.current;
    if (!section || !inner || !scroll) return;

    // Responsive GSAP Values
    const moveX = isMobile ? 30 : 100;
    const pinDistance = isMobile ? "+=150%" : "+=200%";
    const scrubY = isMobile ? "-80vh" : "-15vh";

    // Reset styles for GSAP
    gsap.set(inner, { opacity: 0, scale: 0.95, filter: "blur(4px)" });
    gsap.set(formRef.current, { opacity: 0, x: -moveX, scale: 0.9 });
    gsap.set(infoRef.current, { opacity: 0, x: moveX, scale: 0.9 });
    
    const formItems = formRef.current.querySelectorAll('.animate-stagger');
    const socialItems = infoRef.current.querySelectorAll('.social-stagger');
    const hudItem = infoRef.current.querySelector('.hud-animate');

    gsap.set([formItems, socialItems, hudItem], { opacity: 0, y: 30 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: pinDistance,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // Phase 2: Entrance
    masterTl.to(inner, { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)", 
      duration: 1, 
      ease: "expo.out" 
    });

    masterTl.to([formRef.current, infoRef.current], { 
      opacity: 1, 
      x: 0, 
      scale: 1, 
      duration: 1, 
      stagger: isMobile ? 0 : 0.2, // Faster on mobile
      ease: "power4.out" 
    }, "-=0.5");

    // Phase 3: Staggered Fade-in
    masterTl.to(formItems, {
       opacity: 1,
       y: 0,
       duration: 0.6,
       stagger: 0.1,
       ease: "power2.out"
    }, "-=0.3");

    masterTl.to(socialItems, {
       opacity: 1,
       y: 0,
       duration: 0.6,
       stagger: 0.08,
       ease: "power2.out"
    }, "-=0.4");

    masterTl.to(hudItem, {
       opacity: 1,
       y: 0,
       duration: 0.8,
       ease: "back.out(1.7)"
    }, "-=0.2");

    // Phase 4: Vertical scrub
    masterTl.to(scroll, { y: scrubY, duration: 2, ease: "none" });

    // Final Hold
    masterTl.to({}, { duration: 1.5 });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, [isMobile]); // Re-run when screen size changes significantly

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative h-screen w-full overflow-hidden bg-transparent text-brand-text"
    >
      <div ref={innerRef} className="absolute inset-0 flex flex-col">
        <div ref={scrollRef} className="w-full px-4 sm:px-12 lg:px-24 pt-20 pb-32 flex flex-col items-center will-change-transform">
          
          <div className="z-10 w-full max-w-7xl flex flex-col items-center mb-8 sm:mb-12">
            <div ref={headingRef} className="text-center">
              <SplitText
                text="CONTACT"
                className="font-display text-[clamp(2.5rem,10vw,8rem)] font-bold text-white tracking-[0.15em] sm:tracking-[0.2em] leading-none"
                delay={0}
                duration={1.2}
                ease="expo.out"
                splitType="chars"
                from={{ opacity: 0, y: 100, rotateX: -90, scale: 0.8 }}
                to={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                threshold={0.5}
              />
              <div className="text-brand-accent tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[10px] sm:text-sm mt-4 sm:mt-6 font-body opacity-80 animate-pulse">
                Initiate Connection Sequence
              </div>
            </div>
          </div>

          <div className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-6 sm:gap-12 pointer-events-auto items-stretch">
            
            {/* Left: Form Panel */}
            <div ref={formRef} className="w-full lg:w-[55%] flex flex-col">
              <div 
                ref={formCardRef}
                onMouseMove={(e) => handleMouseMove(e, formCardRef)}
                className="group relative p-6 sm:p-12 rounded-[1.5rem] sm:rounded-[2rem] bg-brand-surface/40 backdrop-blur-2xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] h-full overflow-hidden transition-all duration-500 hover:border-brand-accent/20"
                style={{
                  '--mouse-x': '50%',
                  '--mouse-y': '50%'
                }}
              >
                {!isMobile && (
                  <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(191, 219, 254, 0.08), transparent 40%)`
                    }}
                  />
                )}
                
                <h3 className="animate-stagger text-2xl sm:text-3xl font-display font-medium text-white mb-6 sm:mb-10 flex items-center gap-4">
                  <span className="w-6 sm:w-8 h-px bg-brand-accent/50" />
                  Send a Message
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
                  <div className="animate-stagger group/input relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder=" "
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 text-white font-body text-base sm:text-lg focus:outline-none focus:border-brand-accent/50 focus:bg-brand-accent/5 focus:ring-1 focus:ring-brand-accent/50 transition-all duration-300 peer"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-5 sm:left-6 top-3.5 sm:top-4 text-brand-muted text-base sm:text-lg transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-brand-accent peer-focus:text-sm font-body
                      ${formData.name ? '-top-3 left-4 text-sm text-brand-accent' : ''}"
                    >
                      Your Name
                    </label>
                  </div>

                  <div className="animate-stagger group/input relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder=" "
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 text-white font-body text-base sm:text-lg focus:outline-none focus:border-brand-accent/50 focus:bg-brand-accent/5 focus:ring-1 focus:ring-brand-accent/50 transition-all duration-300 peer"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-5 sm:left-6 top-3.5 sm:top-4 text-brand-muted text-base sm:text-lg transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-brand-accent peer-focus:text-sm font-body"
                    >
                      Your Email
                    </label>
                  </div>

                  <div className="animate-stagger group/input relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={isMobile ? 3 : 4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder=" "
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-5 sm:px-6 py-3.5 sm:py-4 text-white font-body text-base sm:text-lg focus:outline-none focus:border-brand-accent/50 focus:bg-brand-accent/5 focus:ring-1 focus:ring-brand-accent/50 transition-all duration-300 peer resize-none"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-5 sm:left-6 top-3.5 sm:top-4 text-brand-muted text-base sm:text-lg transition-all duration-300 pointer-events-none peer-placeholder-shown:top-3.5 sm:peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:left-4 peer-focus:text-brand-accent peer-focus:text-sm font-body"
                    >
                      Your Message
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="animate-stagger group relative mt-2 sm:mt-4 self-start rounded-xl p-[1px] overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(191,219,254,0.1)] hover:shadow-[0_0_30px_rgba(191,219,254,0.3)] w-full sm:w-auto"
                  >
                    <div className="absolute inset-[-1000%] animate-[shimmer_2s_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#bfdbfe_50%,#E2E8F0_100%)] group-hover:block" />
                    <div className="relative z-10 flex h-full w-full items-center justify-center rounded-xl bg-brand-bg px-8 sm:px-10 py-4 sm:py-5 transition-all duration-300 group-hover:bg-brand-accent group-hover:text-black">
                      <span className="text-base sm:text-lg font-display tracking-widest uppercase font-bold">Deploy Message</span>
                    </div>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Social & Status Panel */}
            <div ref={infoRef} className="w-full lg:w-[45%] flex flex-col gap-6 sm:gap-8">
              
              {/* Socials Card */}
              <div 
                ref={infoCardRef}
                onMouseMove={(e) => handleMouseMove(e, infoCardRef)}
                className="group relative p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] bg-brand-surface/40 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col overflow-hidden transition-all duration-500 hover:border-brand-accent/20"
                style={{ '--mouse-x': '50%', '--mouse-y': '50%' }}
              >
                {!isMobile && (
                  <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(191, 219, 254, 0.08), transparent 40%)`
                    }}
                  />
                )}

                <h3 className="text-xl sm:text-2xl font-display font-medium text-white mb-6 sm:mb-8 flex items-center gap-4">
                  <span className="w-5 sm:w-6 h-px bg-brand-accent/50" />
                  Digital Footprint
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { label: "Discord", icon: discord, val: "itsme.3974", color: "#5865F2", onClick: () => { navigator.clipboard.writeText("itsme.3974"); alert("Copied Discord ID!") } },
                    { label: "LinkedIn", icon: linkedin, val: "swar-shinde", color: "#0A66C2", onClick: () => window.open("https://www.linkedin.com/in/swar-shinde-91131a2b9/", "_blank") },
                    { label: "Github", icon: github, val: "Swarspage", color: "#333", onClick: () => window.open("https://github.com/Swarspage", "_blank") },
                    { label: "X", icon: x, val: "@Swars_page", color: "#fff", onClick: () => window.open("https://x.com/Swars_page", "_blank") },
                    { label: "Email", icon: emailIcon, val: "shindeswar@hotmail.com", color: "#EA4335", onClick: () => window.open("mailto:shindeswar@hotmail.com", "_blank") },
                  ].map((social) => (
                    <button
                      key={social.label}
                      type="button"
                      onClick={social.onClick}
                      className="social-stagger group/btn relative flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-[1rem] sm:rounded-[1.2rem] bg-black/20 border border-white/5 hover:border-brand-accent/40 transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                      <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg sm:rounded-xl bg-white/5 border border-white/10 group-hover/btn:border-brand-accent/30 transition-colors">
                        <img src={social.icon} alt={social.label} className="w-5 h-5 sm:w-6 sm:h-6 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover/btn:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
                        <span className="text-white font-body text-xs sm:text-sm font-medium tracking-wide">{social.label}</span>
                        <span className="text-[8px] sm:text-[10px] text-brand-muted font-mono uppercase tracking-tighter group-hover/btn:text-brand-accent transition-colors truncate max-w-[80px] sm:max-w-none">{social.val}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Status HUD Widget */}
              <div className="hud-animate p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-brand-surface/40 backdrop-blur-2xl border border-white/5 shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-accent/[0.02] pointer-events-none" />
                <div className="relative z-10 flex flex-col gap-1.5 text-center sm:text-left w-full sm:w-auto">
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-0.5">
                        <div className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-accent"></span>
                        </div>
                        <span className="text-[9px] sm:text-xs font-mono text-brand-accent tracking-[.25em] sm:tracking-[.3em] uppercase">Status: Live</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl sm:text-3xl font-mono font-bold text-white tabular-nums tracking-wider leading-none sm:leading-normal">
                            {formatISTTime()}
                        </span>
                        <span className="text-[7px] sm:text-[10px] font-mono text-brand-muted uppercase tracking-[.15em] sm:tracking-[.2em] mt-1 sm:mt-1 opacity-70">
                            Navi Mumbai // GPS: 19.03N, 73.02E
                        </span>
                    </div>
                </div>

                <button
                  type="button"
                  onClick={handleResumeDownload}
                  className="group relative px-6 sm:px-8 py-3.5 sm:py-4 overflow-hidden rounded-lg sm:rounded-xl border border-white/10 hover:border-brand-accent/50 transition-all duration-500 bg-black/40 w-full sm:w-auto hover:shadow-[0_0_20px_rgba(191,219,254,0.15)]"
                >
                  <div className="relative z-10 text-white font-display text-[10px] sm:text-sm tracking-[.2em] uppercase flex items-center justify-center gap-3">
                    Access CV
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-brand-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Edge fades */}
        <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20"
          style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }} />
      </div>
    </section>
  );
};

export default Contact;


