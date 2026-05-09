import { useLayoutEffect } from "react";
import { gsap } from "../lib/gsapScroll";

const useGsapScene = (setup, dependencies = []) => {
  useLayoutEffect(() => {
    const context = gsap.context(setup);

    return () => {
      context.revert();
    };
  }, dependencies);
};

export default useGsapScene;
