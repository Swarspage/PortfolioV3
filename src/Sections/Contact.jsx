import { useEffect, useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import discord from "../assets/discord.png";
import linkedin from "../assets/linkedin-logo.png";
import github from "../assets/github.png";
import x from "../assets/X.png";
import emailIcon from "../assets/email.png";
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

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

  // MASTER PIN: last section — pins, content scrubs in then scrolls up so all is accessible
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const scroll = scrollRef.current;
    if (!section || !inner || !scroll) return;

    gsap.set(inner, { opacity: 0, scale: 0.92, filter: "blur(10px)" });
    gsap.set(formRef.current, { opacity: 0, x: -50 });
    gsap.set(infoRef.current, { opacity: 0, x: 50 });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // ENTRANCE
    masterTl.to(inner, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
    masterTl.to(formRef.current, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.4");
    masterTl.to(infoRef.current, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" }, "-=0.5");

    // IN-SECTION SCROLL: scrub content up so Send button is reachable
    masterTl.to(scroll, { y: "-20vh", duration: 1.2, ease: "none" });

    // HOLD (contact is last, no exit)
    masterTl.to({}, { duration: 1.5 });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative h-screen w-full overflow-hidden text-brand-text"
    >
      {/* Background Dimming Overlay - Removed */}

      {/* Opacity / scale wrapper */}
      <div ref={innerRef} className="absolute inset-0 flex flex-col">

        {/* Scrub-scroll container */}
        <div ref={scrollRef} className="w-full px-6 md:px-12 lg:px-24 pt-16 pb-32 flex flex-col items-center will-change-transform">

          <div className="z-10 w-full max-w-7xl flex flex-col items-center mb-4">
            <div ref={headingRef} className="text-center">
              <SplitText
                text="CONTACT"
                className="font-display text-[clamp(3.5rem,8vw,7rem)] font-bold text-white tracking-widest leading-none"
                delay={0}
                duration={0.8}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 50, scale: 0.9 }}
                to={{ opacity: 1, y: 0, scale: 1 }}
                threshold={0.5}
              />
              <div className="text-brand-accent tracking-widest uppercase text-sm mt-4 font-body">Let's build something worth showing off.</div>
            </div>
          </div>

          <div className="z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-16 pointer-events-auto items-stretch">

            {/* Left: Form */}
            <div ref={formRef} className="w-full lg:w-1/2 flex flex-col gap-8">
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-brand-surface backdrop-blur-md border border-brand-border shadow-2xl h-full">
                <h3 className="text-3xl font-display font-medium text-white mb-8">Send a Message</h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="group relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      className="w-full bg-transparent border-b border-brand-border/60 py-4 text-white font-body text-lg focus:outline-none focus:border-brand-accent transition-colors peer placeholder-transparent"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-0 top-4 text-brand-muted text-lg transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-brand-accent peer-focus:text-sm font-body cursor-text
                  ${formData.name ? '-top-3 text-sm text-brand-accent' : ''}"
                    >
                      {formData.name ? '' : 'Your Name'}
                    </label>
                  </div>

                  <div className="group relative mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      className="w-full bg-transparent border-b border-brand-border/60 py-4 text-white font-body text-lg focus:outline-none focus:border-brand-accent transition-colors peer placeholder-transparent"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 top-4 text-brand-muted text-lg transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-brand-accent peer-focus:text-sm font-body cursor-text"
                    >
                      {formData.email ? '' : 'Your Email'}
                    </label>
                  </div>

                  <div className="group relative mt-2">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      className="w-full bg-transparent border-b border-brand-border/60 py-4 text-white font-body text-lg focus:outline-none focus:border-brand-accent transition-colors peer placeholder-transparent resize-none"
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-0 top-4 text-brand-muted text-lg transition-all duration-300 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-brand-accent peer-focus:text-sm font-body cursor-text"
                    >
                      {formData.message ? '' : 'Your Message'}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="group relative mt-8 overflow-hidden rounded-full self-start"
                  >
                    <div className="relative z-10 px-10 py-4 bg-white text-black font-semibold tracking-wide transition-colors duration-300 group-hover:text-white">
                      Send Message
                    </div>
                    <div className="absolute inset-0 bg-brand-accent transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></div>
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Social & Info */}
            <div ref={infoRef} className="w-full lg:w-1/2 flex flex-col gap-8">

              {/* Socials Box */}
              <div className="p-8 md:p-12 rounded-[2.5rem] bg-brand-surface backdrop-blur-md border border-brand-border shadow-2xl flex-1 flex flex-col">
                <h3 className="text-2xl font-display font-medium text-white mb-6">Connect</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 content-start">
                  {[
                    { label: "Discord", icon: discord, val: "itsme.3974", onClick: () => { navigator.clipboard.writeText("itsme.3974"); alert("Copied Discord ID to clipboard!") } },
                    { label: "LinkedIn", icon: linkedin, val: "swar-shinde", onClick: () => window.open("https://www.linkedin.com/in/swar-shinde-91131a2b9/", "_blank") },
                    { label: "Github", icon: github, val: "Swarspage", onClick: () => window.open("https://github.com/Swarspage", "_blank") },
                    { label: "X", icon: x, val: "@Swars_page", onClick: () => window.open("https://x.com/Swars_page", "_blank") },
                    { label: "E-mail", icon: emailIcon, val: "shindeswar@hotmail.com", onClick: () => window.open("mailto:shindeswar@hotmail.com", "_blank") },
                  ].map((social) => (
                    <button
                      key={social.label}
                      type="button"
                      onClick={social.onClick}
                      className="group flex flex-col items-start gap-3 p-6 rounded-2xl bg-brand-bg/30 border border-brand-border/40 hover:bg-brand-surface-hover hover:border-brand-accent/50 transition-all duration-300"
                    >
                      <img src={social.icon} alt={social.label} className="w-8 h-8 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-300" />
                      <div className="flex flex-col items-start">
                        <span className="text-white font-medium">{social.label}</span>
                        <span className="text-xs text-brand-muted group-hover:text-brand-accent transition-colors truncate max-w-[150px]">{social.val}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time & Location Box */}
              <div className="p-8 rounded-[2.5rem] bg-brand-surface backdrop-blur-md border border-brand-border shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex flex-col gap-1 text-center sm:text-left">
                  <span className="text-brand-muted text-sm tracking-widest uppercase font-medium">Local Time</span>
                  <span className="text-2xl font-display font-bold text-white tracking-wider flex items-center justify-center sm:justify-start gap-2">
                    {formatISTTime()}
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
                    </span>
                  </span>
                  <span className="text-brand-muted text-sm">Navi Mumbai, India</span>
                </div>

                <button
                  type="button"
                  onClick={handleResumeDownload}
                  className="group relative px-8 py-3 overflow-hidden rounded-full border border-brand-border hover:border-brand-accent transition-colors duration-300 bg-brand-bg/50"
                >
                  <div className="relative z-10 text-white font-medium tracking-wide flex items-center gap-2">
                    Download CV
                    <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  </div>
                </button>
              </div>

            </div>{/* end infoRef */}
          </div>{/* end content row */}
        </div>{/* end scrollRef */}
      </div>{/* end innerRef */}
    </section>
  );
};

export default Contact;

