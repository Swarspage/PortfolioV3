import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export function syncLenisWithScrollTrigger(lenis) {
  const handleLenisScroll = () => {
    ScrollTrigger.update();
  };

  lenis.on("scroll", handleLenisScroll);

  return () => {
    if (typeof lenis.off === "function") {
      lenis.off("scroll", handleLenisScroll);
    }
  };
}
