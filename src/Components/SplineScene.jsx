import { Suspense, lazy, useState, useEffect } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className, onSplineLoad, isAppReady, isVisible = true }) {
  const [splineApp, setSplineApp] = useState(null);

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
