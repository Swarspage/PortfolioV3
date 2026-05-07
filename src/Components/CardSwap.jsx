import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';

export const Card = forwardRef(({ customClass, ...rest }, ref) => (
    <div
        ref={ref}
        {...rest}
        className={`absolute top-1/2 left-1/2 rounded-[1.5rem] overflow-hidden bg-black shadow-[0_8px_40px_rgba(0,0,0,0.7)] [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
    />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
    x: i * distX,
    y: -i * distY,
    z: -i * distX * 1.5,
    zIndex: total - i
});

const placeNow = (el, slot, skew) =>
    gsap.set(el, {
        x: slot.x,
        y: slot.y,
        z: slot.z,
        xPercent: -50,
        yPercent: -50,
        skewY: skew,
        transformOrigin: 'center center',
        zIndex: slot.zIndex,
        force3D: true
    });

const CardSwap = ({
    width = 500,
    height = 400,
    cardDistance = 100,
    verticalDistance = 40,
    delay = 5000,
    pauseOnHover = true,
    onCardClick,
    onSwap,
    skewAmount = 1,
    easing = 'elastic',
    children
}) => {
    const config =
        easing === 'elastic'
            ? {
                ease: 'elastic.out(0.6,0.9)',
                durDrop: 2,
                durMove: 2,
                durReturn: 2,
                promoteOverlap: 0.9,
                returnDelay: 0.05
            }
            : {
                ease: 'power1.inOut',
                durDrop: 0.8,
                durMove: 0.8,
                durReturn: 0.8,
                promoteOverlap: 0.45,
                returnDelay: 0.2
            };

    const childArr = useMemo(() => Children.toArray(children), [children]);
    const refs = useMemo(
        () => childArr.map(() => React.createRef()),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [childArr.length]
    );

    const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

    const tlRef = useRef(null);
    const intervalRef = useRef();
    const container = useRef(null);

    useEffect(() => {
        const total = refs.length;
        refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

        const swap = () => {
            if (order.current.length < 2) return;

            const [front, ...rest] = order.current;
            const elFront = refs[front].current;
            const tl = gsap.timeline();
            tlRef.current = tl;

            tl.to(elFront, {
                y: '+=500',
                duration: config.durDrop,
                ease: config.ease
            });

            tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
            rest.forEach((idx, i) => {
                const el = refs[idx].current;
                const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
                tl.set(el, { zIndex: slot.zIndex }, 'promote');
                tl.to(
                    el,
                    {
                        x: slot.x,
                        y: slot.y,
                        z: slot.z,
                        duration: config.durMove,
                        ease: config.ease
                    },
                    `promote+=${i * 0.15}`
                );
            });

            const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
            tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
            tl.call(
                () => {
                    gsap.set(elFront, { zIndex: backSlot.zIndex });
                },
                undefined,
                'return'
            );
            tl.to(
                elFront,
                {
                    x: backSlot.x,
                    y: backSlot.y,
                    z: backSlot.z,
                    duration: config.durReturn,
                    ease: config.ease
                },
                'return'
            );

            // Update internal state after animation completes
            tl.call(() => {
                order.current = [...rest, front];
            });

            // Trigger the text update IMMEDIATELY when the swap starts, 
            // so it feels perfectly coordinated with the dropping card
            if (onSwap) onSwap(rest[0]);
        };

        swap();
        intervalRef.current = window.setInterval(swap, delay);

        if (pauseOnHover) {
            const node = container.current;
            const pause = () => {
                tlRef.current?.pause();
                clearInterval(intervalRef.current);
            };
            const resume = () => {
                tlRef.current?.play();
                intervalRef.current = window.setInterval(swap, delay);
            };
            node.addEventListener('mouseenter', pause);
            node.addEventListener('mouseleave', resume);
            return () => {
                node.removeEventListener('mouseenter', pause);
                node.removeEventListener('mouseleave', resume);
                clearInterval(intervalRef.current);
            };
        }
        return () => clearInterval(intervalRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

    const rendered = childArr.map((child, i) =>
        isValidElement(child)
            ? cloneElement(child, {
                key: i,
                ref: refs[i],
                style: { width, height, ...(child.props.style ?? {}) },
                onClick: e => {
                    child.props.onClick?.(e);
                    onCardClick?.(i);
                }
            })
            : child
    );

    return (
        <div
            ref={container}
            className="group perspective-[900px] overflow-visible lg:absolute lg:bottom-0 lg:right-0 lg:translate-x-[5%] lg:translate-y-[20%] relative mx-auto -translate-x-4 sm:-translate-x-8 lg:transform-none origin-bottom-right pointer-events-auto"
            style={{ width, height }}
        >
            {rendered}
            {pauseOnHover && (
                <div className="absolute top-5 right-5 z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                    <span className="text-[9px] font-mono text-white tracking-widest font-bold mt-[1px]">PAUSED</span>
                </div>
            )}
        </div>
    );
};

export default CardSwap;
