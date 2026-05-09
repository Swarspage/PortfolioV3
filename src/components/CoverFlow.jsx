import { useState, useCallback, useEffect } from "react";

const CoverFlow = ({ items, activeIndex, setActiveIndex, onCardClick }) => {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < items.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1);
  }, [activeIndex, setActiveIndex]);

  const handleNext = useCallback(() => {
    if (activeIndex < items.length - 1) setActiveIndex(activeIndex + 1);
  }, [activeIndex, items.length, setActiveIndex]);

  // Keydown listener for accessibility and ease of use
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center perspective-[1200px] overflow-visible"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 
        The Carousel track. 
        Width and height dictate the size of the *center* card.
        Cards are positioned absolutely within this track.
      */}
      <div className="relative w-[280px] sm:w-[380px] lg:w-[600px] xl:w-[700px] aspect-[16/10] sm:aspect-[16/9] flex justify-center items-center transform-style-3d pointer-events-none">
        {items.map((item, i) => {
          const offset = i - activeIndex;
          const absOffset = Math.abs(offset);
          const direction = Math.sign(offset); // -1 (left), 0 (center), 1 (right)
          
          // CSS Math for Cover Flow
          // baseTranslateX: How far % wise adjacent cards shift
          const baseTranslateX = isMobile ? 65 : 85; 
          // zDistance: How far back in pixels they are pushed
          const zDistance = isMobile ? 100 : 150; 
          // rotateAngle: The 3D rotation angle
          const rotateAngle = isMobile ? 40 : 50;

          const translateX = direction === 0 ? 0 : direction * (baseTranslateX + (absOffset - 1) * (baseTranslateX * 0.4));
          const translateZ = direction === 0 ? 0 : -absOffset * zDistance;
          const rotateY = direction === 0 ? 0 : -direction * rotateAngle;
          
          // Scale down items further away to simulate depth and prevent clipping
          const scale = direction === 0 ? 1 : Math.max(1 - absOffset * 0.15, 0.6);
          // Base opacity: Adjacent cards stay fully opaque to prevent 'ghosting' against the background.
          // Cards further away than 1 fade out.
          const cardOpacity = direction === 0 ? 1 : Math.max(1 - (absOffset - 1) * 0.4, 0);

          return (
            <div
              key={i}
              onClick={() => {
                if (offset === 0 && onCardClick) onCardClick(i);
                else setActiveIndex(i);
              }}
              className="absolute top-0 left-0 w-full h-full rounded-2xl sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-auto"
              style={{
                transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                zIndex: items.length - absOffset,
                opacity: cardOpacity,
                // Only allow clicking on the center card or immediate adjacent cards
                visibility: cardOpacity === 0 ? 'hidden' : 'visible',
                cursor: offset === 0 ? 'default' : 'pointer',
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover select-none"
              />
              
              {/* Premium Dimmer Overlay for inactive cards */}
              <div 
                className="absolute inset-0 bg-black transition-opacity duration-700 pointer-events-none" 
                style={{ opacity: offset === 0 ? 0 : 0.85 + (absOffset * 0.05) }}
              />

              {/* Minimalist Title overlay for center card only */}
              <div 
                className={`absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-700 ${offset === 0 ? 'opacity-100' : 'opacity-0'}`}
              >
                <span className="font-display text-sm sm:text-lg lg:text-2xl font-bold text-white tracking-wide leading-snug drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {item.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={handlePrev}
        disabled={activeIndex === 0}
        aria-label="Previous Achievement"
        className="absolute left-2 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-4 lg:p-5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:scale-110 disabled:opacity-0 disabled:scale-90 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="m15 18-6-6 6-6"/></svg>
      </button>

      <button 
        onClick={handleNext}
        disabled={activeIndex === items.length - 1}
        aria-label="Next Achievement"
        className="absolute right-2 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-50 p-3 sm:p-4 lg:p-5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all duration-300 hover:bg-white/10 hover:scale-110 disabled:opacity-0 disabled:scale-90 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-brand-accent/50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 lg:w-6 lg:h-6"><path d="m9 18 6-6-6-6"/></svg>
      </button>

    </div>
  );
};

export default CoverFlow;
