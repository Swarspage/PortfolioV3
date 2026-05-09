import { useState, useEffect, useRef, Suspense } from "react";
import SectionSkeleton from "./SectionSkeleton";

/**
 * LazySection
 * ─────────────────────────────────────────────────────────────────
 * Defers mounting of children until the placeholder sentinel is
 * within `rootMargin` pixels of the viewport.
 *
 * Why not just Suspense alone?
 *   React.lazy() + Suspense starts the network fetch at *render time*.
 *   If every lazy section renders in the same tree simultaneously
 *   (they all have height so the page is long from the start),
 *   all chunk requests fire at once — negating the benefit.
 *
 *   LazySection solves this by *not rendering children at all* until
 *   the IntersectionObserver fires, ensuring truly deferred mounting.
 *
 * Props
 *   children     — lazy component wrapped in <Suspense>
 *   rootMargin   — IntersectionObserver margin (default "300px")
 *                  Pre-loads chunk 300px before section enters viewport
 *   fallback     — custom Suspense fallback (defaults to SectionSkeleton)
 *   placeholder  — element rendered before first intersection;
 *                  defaults to a 100dvh transparent div to keep scroll
 *                  height stable
 */
const LazySection = ({
  children,
  rootMargin = "300px",
  fallback = <SectionSkeleton />,
  placeholder,
  height = "100dvh",
  id,
}) => {
  const containerRef = useRef(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
        }
      },
      { rootMargin, threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div 
      id={id} 
      ref={containerRef} 
      className="w-full relative" 
      style={{ minHeight: height }}
    >
      {shouldRender ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        placeholder ?? <div style={{ width: "100%", height, background: "transparent" }} aria-hidden="true" />
      )}
    </div>
  );
};

export default LazySection;
