import { Suspense, lazy, useState, useEffect } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Reduce canvas resolution on mobile to prevent GPU memory crashes on lower-end devices
const IS_MOBILE_TOUCH = typeof window !== 'undefined' &&
  window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export function SplineScene({ scene, className, onSplineLoad, isAppReady, isVisible = true }) {
  const [splineApp, setSplineApp] = useState(null);

  // ── Mobile bypass ────────────────────────────────────────────────────────
  // On touch/mobile devices: skip the entire Spline scene (saves ~4.5 MB of JS chunks —
  // physics engine, navmesh, gaussian-splat renderer, howler audio, etc.).
  // Signal the Loader immediately so it can complete its sequence.
  useEffect(() => {
    if (IS_MOBILE_TOUCH && onSplineLoad) {
      onSplineLoad();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On mobile: render a lightweight CSS visual so the hero isn't completely empty
  if (IS_MOBILE_TOUCH) {
    return (
      <div
        className={className}
        aria-hidden="true"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(191,219,254,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
    );
  }

  // ── Desktop: full Spline scene ───────────────────────────────────────────
  const handleLoad = (app) => {
    app.stop(); // Freeze instantly upon load to wait for Loader.jsx cinematic!
    setSplineApp(app);
    if (onSplineLoad) onSplineLoad();
  };

  useEffect(() => {
    if (isAppReady && splineApp) {
      if (isVisible) {
        splineApp.play(); // Execute robust intro zoom animation once loader clears!
      } else {
        splineApp.stop(); // Pause computation to resolve lag when off-screen
      }
    }
  }, [isAppReady, splineApp, isVisible]);

  return (
    <Suspense fallback={null}>
      <Spline
        scene={scene}
        className={className}
        onLoad={handleLoad}
      />
    </Suspense>
  )
}
