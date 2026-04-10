import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GridMotion = ({
    items = [],
    gradientColor = 'transparent',
    autoScrollSpeed = 0.4,
    cellClassName = 'rounded-[10px] bg-[#111]',
    fadeMask = false,
}) => {
    const gridRef = useRef(null);
    const rowRefs = useRef([]);
    const mouseXRef = useRef(window.innerWidth / 2);
    const autoOffsetRef = useRef(0);

    const totalItems = 40;
    const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
    const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

    useEffect(() => {
        gsap.ticker.lagSmoothing(0);

        const handleMouseMove = e => {
            mouseXRef.current = e.clientX;
        };

        const updateMotion = () => {
            autoOffsetRef.current += autoScrollSpeed;

            const maxMoveAmount = 300;
            const baseDuration = 0.8;
            const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

            rowRefs.current.forEach((row, index) => {
                if (row) {
                    const direction = index % 2 === 0 ? 1 : -1;
                    const mouseMove =
                        ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) *
                        direction;
                    const autoMove = autoOffsetRef.current * direction;
                    const moveAmount = mouseMove + autoMove;

                    gsap.to(row, {
                        x: moveAmount,
                        duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
                        ease: 'power3.out',
                        overwrite: 'auto',
                    });
                }
            });
        };

        const removeAnimationLoop = gsap.ticker.add(updateMotion);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            removeAnimationLoop();
        };
    }, [autoScrollSpeed]);

    const maskStyle = fadeMask
        ? {
              maskImage:
                  'radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%)',
              WebkitMaskImage:
                  'radial-gradient(ellipse 75% 65% at 50% 50%, black 30%, transparent 100%)',
          }
        : {};

    return (
        <div ref={gridRef} className="h-full w-full overflow-hidden" style={maskStyle}>
            <section
                className="w-full h-full min-h-screen overflow-hidden relative flex items-center justify-center"
                style={
                    gradientColor !== 'transparent'
                        ? { background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)` }
                        : {}
                }
            >
                <div className="absolute inset-0 pointer-events-none z-[4]"></div>
                <div className="gap-3 flex-none relative w-[140vw] h-[140vh] grid grid-rows-5 grid-cols-1 rotate-[-15deg] origin-center z-[2]">
                    {[...Array(5)].map((_, rowIndex) => (
                        <div
                            key={rowIndex}
                            className="grid gap-3 grid-cols-8 h-full"
                            style={{ willChange: 'transform, filter' }}
                            ref={el => (rowRefs.current[rowIndex] = el)}
                        >
                            {[...Array(8)].map((_, itemIndex) => {
                                const content = combinedItems[rowIndex * 8 + itemIndex];
                                return (
                                    <div key={itemIndex} className="relative h-full">
                                        <div
                                            className={`relative w-full h-full overflow-hidden flex items-center justify-center text-white text-[1.5rem] ${cellClassName}`}
                                        >
                                            {typeof content === 'string' &&
                                            content.startsWith('http') ? (
                                                <div
                                                    className="w-full h-full bg-cover bg-center absolute top-0 left-0"
                                                    style={{ backgroundImage: `url(${content})` }}
                                                ></div>
                                            ) : (
                                                <div className="p-4 text-center z-[1] w-full h-full flex items-center justify-center">
                                                    {content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
                <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
            </section>
        </div>
    );
};

export default GridMotion;
