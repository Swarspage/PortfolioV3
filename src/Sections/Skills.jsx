import { useCallback, useEffect, useMemo, useRef, useState, forwardRef } from "react";
import { gsap } from "../lib/gsapScroll";
import SplitText from "../Components/SplitText";

import C from "../assets/C.webp";
import Cpp from "../assets/cpp.webp";
import Java from "../assets/java.webp";
import Python from "../assets/Python.webp";
import JavaScript from "../assets/js.webp";
import HTML from "../assets/html.webp";
import CSS from "../assets/css.webp";
import ReactLogo from "../assets/react.webp";
import NodeLogo from "../assets/node-js.webp";
import Express from "../assets/express.webp";
import MongoDB from "../assets/MongoDB.webp";
import MySQL from "../assets/MySQL.webp";
import Git from "../assets/Git.webp";
import GitHub from "../assets/github.webp";
import VSCode from "../assets/VS.webp";
import Canva from "../assets/canva.webp";
import Postman from "../assets/postman.webp";
import ProblemSolving from "../assets/problemsolving.webp";

// ─── Card dimensions ──────────────────────────────────────────────────────────
const DESKTOP_CARD_W = 104;
const DESKTOP_CARD_H = 92;
const MOBILE_CARD_W = 80; // Reduced from 88
const MOBILE_CARD_H = 70; // Reduced from 78

// ─── Physics constants ────────────────────────────────────────────────────────
const SPRING_K = 0.038;
const DAMPING = 0.87;
const COLLISION_FORCE = 0.55;
const MIN_SEP_DESKTOP = 116;
const MIN_SEP_MOBILE = 92; // Slightly reduced to match smaller card size
const EDGE_PAD_DESKTOP = 68;
const EDGE_PAD_MOBILE = 40; // Reduced to allow cards to utilize more width on small phones
const BOUNDARY_FORCE = 0.45;
const ATTRACT_RADIUS = 185;
const ATTRACT_STRENGTH = 0.026;
const AVOID_R_DESKTOP = 130;
const AVOID_R_MOBILE = 80;

// ─── Skills data ──────────────────────────────────────────────────────────────
const SKILLS = [
  { skill: "React", img: ReactLogo, glow: "#61DAFB", dx: 10, dy: 12, related: ["JavaScript", "Node.js", "HTML", "CSS"], category: "Frontend" },
  { skill: "JavaScript", img: JavaScript, glow: "#F7DF1E", dx: 36, dy: 9, related: ["React", "Node.js", "HTML", "CSS"], category: "Frontend" },
  { skill: "Python", img: Python, glow: "#4B8BBE", dx: 62, dy: 12, related: ["MySQL", "MongoDB", "Problem Solving"], category: "Backend" },
  { skill: "Node.js", img: NodeLogo, glow: "#339933", dx: 84, dy: 17, related: ["Express", "MongoDB", "JavaScript"], category: "Backend" },
  { skill: "MongoDB", img: MongoDB, glow: "#47A248", dx: 7, dy: 37, related: ["Node.js", "Express"], category: "Database" },
  { skill: "Express", img: Express, glow: "#AAAAAA", dx: 27, dy: 33, related: ["Node.js", "MongoDB", "JavaScript"], category: "Backend" },
  { skill: "MySQL", img: MySQL, glow: "#00618A", dx: 54, dy: 31, related: ["Node.js", "Python", "Express"], category: "Database" },
  { skill: "HTML", img: HTML, glow: "#E34F26", dx: 77, dy: 39, related: ["CSS", "JavaScript", "React"], category: "Frontend" },
  { skill: "CSS", img: CSS, glow: "#1572B6", dx: 89, dy: 54, related: ["HTML", "JavaScript", "React"], category: "Frontend" },
  { skill: "Java", img: Java, glow: "#ED8B00", dx: 15, dy: 61, related: ["C", "C++", "Problem Solving"], category: "Backend" },
  { skill: "C", img: C, glow: "#A8B9CC", dx: 42, dy: 67, related: ["C++", "Java", "Problem Solving"], category: "Tools & Languages" },
  { skill: "C++", img: Cpp, glow: "#00599C", dx: 65, dy: 71, related: ["C", "Java", "Problem Solving"], category: "Tools & Languages" },
  { skill: "Git", img: Git, glow: "#F05032", dx: 5, dy: 79, related: ["GitHub", "VS Code"], category: "Tools & Languages" },
  { skill: "GitHub", img: GitHub, glow: "#D0D0D0", dx: 30, dy: 83, related: ["Git", "VS Code"], category: "Tools & Languages" },
  { skill: "VS Code", img: VSCode, glow: "#007ACC", dx: 56, dy: 81, related: ["Git", "GitHub"], category: "Tools & Languages" },
  { skill: "Canva", img: Canva, glow: "#00C4CC", dx: 80, dy: 75, related: ["HTML", "CSS"], category: "Tools & Languages" },
  { skill: "Postman", img: Postman, glow: "#FF6C37", dx: 91, dy: 29, related: ["Express", "Node.js", "MongoDB"], category: "Tools & Languages" },
  { skill: "Problem Solving", img: ProblemSolving, glow: "#BFDBFE", dx: 47, dy: 86, related: ["C", "C++", "Java", "Python"], category: "Tools & Languages" },
];

const MOBILE_POSITIONS = [
  { dx: 8, dy: 10 }, { dx: 42, dy: 8 }, { dx: 70, dy: 11 },
  { dx: 84, dy: 22 }, { dx: 7, dy: 26 }, { dx: 30, dy: 24 },
  { dx: 58, dy: 30 }, { dx: 85, dy: 40 }, { dx: 6, dy: 48 },
  { dx: 27, dy: 55 }, { dx: 52, dy: 60 }, { dx: 76, dy: 57 },
  { dx: 88, dy: 68 }, { dx: 8, dy: 72 }, { dx: 35, dy: 78 },
  { dx: 62, dy: 76 }, { dx: 85, dy: 83 }, { dx: 46, dy: 87 },
];

// ─── Grid Calculation Helper ──────────────────────────────────────────────────
function calculateGridLayout(W, usableH, topOffset, isMobile, cardsData, cardW, cardH) {
  const maxCols = isMobile ? 2 : 5;
  const colGap = isMobile ? 16 : 30; // Increased horizontal gap
  const rowGap = isMobile ? 26 : 34; // Increased vertical gap for row breathing room
  const sectionGap = isMobile ? 90 : 60; // MASSIVE increase to separate categories clearly
  const headerHeight = isMobile ? 24 : 30;

  const categories = ["Frontend", "Backend", "Database", "Tools & Languages"];
  const positions = new Array(cardsData.length);
  const headerPositions = [];

  // Pushed down to clear the "SKILLS" title phase 3 position
  let currentY = topOffset + (isMobile ? 180 : 180);

  categories.forEach((cat) => {
    const items = cardsData
      .map((s, idx) => ({ ...s, idx }))
      .filter((s) => s.category === cat);

    if (items.length === 0) return;

    // Header position (centered horizontally)
    headerPositions.push({
      label: cat,
      x: W / 2,
      y: currentY + headerHeight / 2
    });

    currentY += headerHeight + (isMobile ? 10 : 15);

    // Card positions for this category
    const rows = [];
    for (let i = 0; i < items.length; i += maxCols) {
      rows.push(items.slice(i, i + maxCols));
    }

    rows.forEach((row) => {
      const rowWidth = row.length * cardW + (row.length - 1) * colGap;
      const startX = (W - rowWidth) / 2;
      const y = currentY + cardH / 2;

      row.forEach((item, colIndex) => {
        const x = startX + colIndex * (cardW + colGap) + cardW / 2;
        positions[item.idx] = { x, y };
      });

      currentY += cardH + rowGap;
    });

    currentY += sectionGap - rowGap; // Adjust for next section
  });

  let totalHeight = currentY - topOffset;
  
  // Compression logic for smaller screens
  if (totalHeight > usableH) {
    const scaleFactor = Math.max(0.5, usableH / totalHeight);
    const scaledRowGap = rowGap * scaleFactor;
    const scaledSectionGap = sectionGap * scaleFactor;
    
    // Recalculate with scaled gaps if content overflows
    currentY = topOffset + (isMobile ? 170 : 160);
    categories.forEach((cat) => {
      const items = cardsData
        .map((s, idx) => ({ ...s, idx }))
        .filter((s) => s.category === cat);
      if (items.length === 0) return;

      const hp = headerPositions.find(h => h.label === cat);
      if (hp) hp.y = currentY + (headerHeight * scaleFactor) / 2;

      currentY += (headerHeight * scaleFactor) + (isMobile ? 5 : 10);

      const rows = [];
      for (let i = 0; i < items.length; i += maxCols) rows.push(items.slice(i, i + maxCols));

      rows.forEach((row) => {
        const rowWidth = row.length * cardW + (row.length - 1) * colGap;
        const startX = (W - rowWidth) / 2;
        const y = currentY + cardH / 2;
        row.forEach((item, colIndex) => {
          const x = startX + colIndex * (cardW + colGap) + cardW / 2;
          positions[item.idx] = { x, y };
        });
        currentY += cardH + scaledRowGap;
      });
      currentY += scaledSectionGap - scaledRowGap;
    });
    totalHeight = currentY - topOffset;
  }

  if (totalHeight < usableH) {
    const shiftY = (usableH - totalHeight) / 2;
    positions.forEach(p => { if (p) p.y += shiftY; });
  }

  return { positions, headerPositions, totalHeight };
}

// ─── Physics helpers ──────────────────────────────────────────────────────────
function applyCollisionForces(nodes, minSep) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
      if (dist < minSep) {
        const overlap = (minSep - dist) / dist;
        const fx = dx * overlap * COLLISION_FORCE * 0.5;
        const fy = dy * overlap * COLLISION_FORCE * 0.5;
        nodes[i].vx -= fx; nodes[i].vy -= fy;
        nodes[j].vx += fx; nodes[j].vy += fy;
      }
    }
  }
}

function applyBoundaryForce(node, W, H, pad, topOffset = 0) {
  if (node.x < pad) node.vx += (pad - node.x) * BOUNDARY_FORCE;
  if (node.x > W - pad) node.vx -= (node.x - (W - pad)) * BOUNDARY_FORCE;
  if (node.y < pad + topOffset) node.vy += (pad + topOffset - node.y) * BOUNDARY_FORCE;
  if (node.y > H - pad) node.vy -= (node.y - (H - pad)) * BOUNDARY_FORCE;
}

function applyHeadingAvoidance(node, cx, cy, r) {
  const dx = node.x - cx;
  const dy = node.y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
  if (dist < r) {
    const force = ((r - dist) / dist) * 0.38;
    node.vx += dx * force;
    node.vy += dy * force;
  }
}

function applyMagneticForce(node, mouse) {
  if (!mouse) return;
  const dx = mouse.x - node.x;
  const dy = mouse.y - node.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < ATTRACT_RADIUS && dist > 1) {
    const strength = (1 - dist / ATTRACT_RADIUS) * ATTRACT_STRENGTH;
    node.vx += dx * strength;
    node.vy += dy * strength;
  }
}

// ─── Hex → rgba helper (Safari rejects 8-digit hex in canvas gradients) ─────
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── Constellation drawing ────────────────────────────────────────────────────
// nodes[i].x / .y = center X/Y of card i, in CSS pixels relative to section
function drawConstellation(ctx, cssW, cssH, nodes, hoveredIdx, dashOffset) {
  if (hoveredIdx === null || hoveredIdx === undefined) return;

  const hNode = nodes[hoveredIdx];
  const relNames = SKILLS[hoveredIdx].related;
  const glowColor = SKILLS[hoveredIdx].glow;

  relNames.forEach((name) => {
    const ti = SKILLS.findIndex((s) => s.skill === name);
    if (ti === -1) return;
    const tNode = nodes[ti];

    // Gradient line (use rgba — 8-digit hex is unsupported in Safari canvas)
    const grad = ctx.createLinearGradient(hNode.x, hNode.y, tNode.x, tNode.y);
    grad.addColorStop(0, hexToRgba(glowColor, 0.80));
    grad.addColorStop(1, hexToRgba(glowColor, 0.13));

    ctx.beginPath();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([9, 6]);
    ctx.lineDashOffset = -dashOffset;
    ctx.globalAlpha = 0.8;
    ctx.moveTo(hNode.x, hNode.y);
    ctx.lineTo(tNode.x, tNode.y);
    ctx.stroke();

    // Pulse dot at target
    ctx.setLineDash([]);
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.arc(tNode.x, tNode.y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.fill();
  });

  ctx.setLineDash([]);
  ctx.globalAlpha = 1;
}

// ─── Skills component ─────────────────────────────────────────────────────────
export default function Skills() {
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const gridContainerRef = useRef(null);
  const headingRef = useRef(null);
  const canvasRef = useRef(null);
  const cardRefs = useRef([]);
  const headerRefs = useRef([]);
  const physicsRef = useRef([]);
  const mouseRef = useRef(null);
  const hoveredIdxRef = useRef(null);
  const rafRef = useRef(null);
  const dashOffsetRef = useRef(0);
  const sizeRef = useRef({ W: 0, H: 0 });
  const totalGridHeightRef = useRef(0);
  const usableHRef = useRef(0);
  const physicsActiveRef = useRef(false);
  const hasEnteredRef = useRef(false);
  const isSectionVisibleRef = useRef(false);
  const [gridHeaders, setGridHeaders] = useState([
    { label: "Frontend", x: -1000, y: -1000 },
    { label: "Backend", x: -1000, y: -1000 },
    { label: "Database", x: -1000, y: -1000 },
    { label: "Tools & Languages", x: -1000, y: -1000 }
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      isSectionVisibleRef.current = entry.isIntersecting;
    });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Detect mobile after mount (avoids SSR mismatch)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsMobile(m.matches);
  }, []);

  const cardW = isMobile ? MOBILE_CARD_W : DESKTOP_CARD_W;
  const cardH = isMobile ? MOBILE_CARD_H : DESKTOP_CARD_H;

  const homePositions = useMemo(
    () => isMobile ? MOBILE_POSITIONS : SKILLS.map((s) => ({ dx: s.dx, dy: s.dy })),
    [isMobile]
  );

  const setCardRef = useCallback((i) => (el) => { cardRefs.current[i] = el; }, []);
  const handleHoverChange = useCallback((idx, active) => {
    if (active) {
      hoveredIdxRef.current = idx;
    } else if (hoveredIdxRef.current === idx) {
      // Only clear if this card is still the active one.
      // Prevents a trailing onPointerLeave from wiping a newer onPointerEnter.
      hoveredIdxRef.current = null;
    }
  }, []);

  // ── MASTER PIN: multi-phase ScrollTrigger sequence ──────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    const cards = cardRefs.current.filter(Boolean);
    const distances = [130, 165, 105, 185, 145, 95, 205, 115, 155, 135, 175, 98, 190, 125, 165, 105, 150, 130];
    let hasTriggered = false;

    // Start inner hidden — will appear as pin begins
    gsap.set(inner, { opacity: 0, scale: 0.92, filter: "blur(10px)" });
    
    // Preset cards with their explosion coordinates to avoid .fromTo calculation flashes
    cards.forEach((card, i) => {
      const angle = Math.random() * Math.PI * 2;
      const r = distances[i % distances.length];
      gsap.set(card, { opacity: 0, scale: 0.2, x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    });

    const masterTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=250%", // Snappier overall duration
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });

    // ── Phase 1 (Entrance) ──
    masterTl.to(inner, {
      opacity: 1, scale: 1, filter: "blur(0px)",
      duration: 1, ease: "power3.out",
    });

    // Grid Transition Proxy (hoisted here to monitor progress in burstTl)
    const proxy = { progress: 0 };
    let startNodes = [];
    let endNodes = [];

    // Kick off time-based card burst-in once we pass the threshold
    masterTl.call(() => {
      if (hasTriggered) return;
      hasTriggered = true;
      const burstTl = gsap.timeline({
        onComplete: () => {
          hasEnteredRef.current = true;
          // Prevent activating physics if user aggressively scrolled into Phase 3
          if (proxy.progress === 0) {
            physicsActiveRef.current = true;
          }
        },
      });
      cards.forEach((card, i) => {
        burstTl.to(
          card,
          { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.8, ease: "back.out(1.4)" },
          i * 0.055
        );
      });
    });

    // ── Phase 2 (Cloud Hold) ──
    masterTl.to({}, { duration: 0.75 });

    // ── Phase 3 (The Transition) ──
    masterTl.add("phase3");

    // Animate heading up (Higher values for mobile to leave a clear stage for grid content)
    masterTl.to(headingRef.current, {
      y: isMobile ? "-38vh" : "-35vh", // Pushed higher on mobile
      scale: isMobile ? 0.55 : 0.65, // Slightly smaller on mobile to reduce visual weight
      opacity: 0.95, 
      duration: 1.0,
      ease: "power2.inOut"
    }, "phase3");

    // Fade out canvas lines smoothly
    masterTl.to(canvasRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut"
    }, "phase3");

    // Grid Transition Proxy Tween
    masterTl.to(proxy, {
      progress: 1,
      duration: 1.0,
      ease: "power2.inOut",
      onStart: () => {
        // Pause the physics maths cleanly
        physicsActiveRef.current = false;
        const { W, H } = sizeRef.current;
        const topOffset = isMobile ? 100 : 140;
        const usableH = H - topOffset;
        
        // Calculate the grid layout with headers
        const layout = calculateGridLayout(W, usableH, topOffset, isMobile, SKILLS, cardW, cardH);
        endNodes = layout.positions;
        setGridHeaders(layout.headerPositions);
        totalGridHeightRef.current = layout.totalHeight;
        usableHRef.current = usableH;
        
        // Lock in current organic positions dynamically
        startNodes = physicsRef.current.map((n) => ({ x: n.x, y: n.y }));
      },
      onReverseComplete: () => {
        // Restart physics maths cleanly when scrolling back out to cloud mode
        physicsActiveRef.current = true;
        physicsRef.current.forEach(n => { n.vx = 0; n.vy = 0; });
        // Don't empty headers, just hide them via the timeline opacity to prevent null targets
        gsap.set(gridContainerRef.current, { y: 0 });
      },
      onUpdate: function() {
        const p = this.progress();
        physicsRef.current.forEach((node, i) => {
          if (!startNodes[i] || !endNodes[i]) return;
          node.x = startNodes[i].x + (endNodes[i].x - startNodes[i].x) * p;
          node.y = startNodes[i].y + (endNodes[i].y - startNodes[i].y) * p;
        });
      }
    }, "phase3");

    // Fade in Category Headers alongside the grid transition
    masterTl.fromTo(".category-header", 
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" },
      "phase3+=0.5"
    );

    // ── Phase 4 (Internal Scroll) ──
    // This allows both the grid and the heading to scroll up together if layout overflow exists
    masterTl.to([gridContainerRef.current, headingRef.current], {
      y: (i, target) => {
        const overflow = Math.max(0, totalGridHeightRef.current - usableHRef.current);
        if (overflow <= 0) return gsap.getProperty(target, "y");
        
        // If it's the heading, we subtract the overflow from its current GSAP y transform
        if (target === headingRef.current) {
          return `-=${overflow}`;
        }
        // If it's the grid container, we move it to -overflow
        return -overflow;
      },
      duration: 2, 
      ease: "none"
    });

    // ── Phase 5 (Grid Hold & Exit) ──
    masterTl.to({}, { duration: 1 });

    // ── EXIT Phase ──
    masterTl.to(inner, {
      opacity: 0, scale: 0.88, filter: "blur(10px)",
      duration: 1, ease: "power2.in",
    });

    return () => {
      if (masterTl.scrollTrigger) masterTl.scrollTrigger.kill();
      masterTl.kill();
    };
  }, [isMobile, cardW, cardH]);

  // ── Physics rAF loop ───────────────────────────────────────────────────────
  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section) return;

    // Canvas sizing — canvas coordinate space = CSS pixels (ctx.scale handles DPR)
    const updateSize = () => {
      const r = section.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      sizeRef.current = { W: r.width, H: r.height };

      if (canvas) {
        canvas.width = Math.round(r.width * dpr);
        canvas.height = Math.round(r.height * dpr);
        canvas.style.width = `${r.width}px`;
        canvas.style.height = `${r.height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // reset + scale in one call
        }
      }
    };
    updateSize();

    const { W, H } = sizeRef.current;
    const positions = homePositions;
    const topOffset = isMobile ? 100 : 140;
    const usableH = H - topOffset;

    // Physics nodes store card center position (CSS px from section top-left)
    physicsRef.current = SKILLS.map((_, i) => {
      const pos = positions[i];
      const homeX = (pos.dx / 100) * W;
      const homeY = (pos.dy / 100) * usableH + topOffset;
      return { x: homeX, y: homeY, vx: 0, vy: 0, homeX, homeY, phase: i * 0.71 };
    });

    const ctx = canvas ? canvas.getContext("2d") : null;
    let frame = 0;

    const minSep = isMobile ? MIN_SEP_MOBILE : MIN_SEP_DESKTOP;
    const edgePad = isMobile ? EDGE_PAD_MOBILE : EDGE_PAD_DESKTOP;
    const avoidR = isMobile ? AVOID_R_MOBILE : AVOID_R_DESKTOP;

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      if (!isSectionVisibleRef.current) return;
      frame++;

      const nodes = physicsRef.current;
      const { W: cW, H: cH } = sizeRef.current;

      // Ensure canvas clears its layout regardless of physics
      if (ctx) ctx.clearRect(0, 0, cW, cH);

      // We only apply natural fluid dynamics and springing if grid transition is inactive
      if (physicsActiveRef.current) {
        // Spring drift
        nodes.forEach((node) => {
          const t = frame * 0.007 + node.phase;
          const px = Math.sin(t * 0.65) * 16;
          const py = Math.cos(t * 0.48) * 13;
          node.vx += (node.homeX + px - node.x) * SPRING_K;
          node.vy += (node.homeY + py - node.y) * SPRING_K;
          node.vx *= DAMPING;
          node.vy *= DAMPING;
        });

        applyCollisionForces(nodes, minSep);

        const currentTopOffset = isMobile ? 100 : 140;

        nodes.forEach((node) => {
          applyBoundaryForce(node, cW, cH, edgePad, currentTopOffset);
          applyHeadingAvoidance(node, cW / 2, cH / 2, avoidR);
          if (!isMobile) applyMagneticForce(node, mouseRef.current);
          node.x += node.vx;
          node.y += node.vy;
        });
      }

      // Apply the physics offset (or GSAP proxy offset) to the DOM wrapper universally
      nodes.forEach((node, i) => {
        const card = cardRefs.current[i];
        if (!card) return;
        // node.x/y is the card *center*; the card is centrally anchored to homeX/homeY 
        // so applying delta creates visually perfectly positioned coordinates.
        const ox = node.x - node.homeX;
        const oy = node.y - node.homeY;
        card.style.transform = `translate3d(${ox}px,${oy}px,0)`;
      });

      // Draw constellation only after Entrance animation burst finishes
      if (ctx && !isMobile && hasEnteredRef.current) {
        dashOffsetRef.current += 0.38;
        // Will always try to draw, smoothly handing over fade to CSS opacity in Phase 3
        drawConstellation(ctx, cW, cH, nodes, hoveredIdxRef.current, dashOffsetRef.current);
      }
    };

    rafRef.current = requestAnimationFrame(loop);

    // Mouse tracking (relative to section, CSS pixels)
    const onMouseMove = (e) => {
      const r = section.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMouseLeave = () => { mouseRef.current = null; };

    const onResize = () => {
      updateSize();
      const { W: nW, H: nH } = sizeRef.current;
      const currTopOffset = isMobile ? 100 : 140;
      const currUsableH = nH - currTopOffset;
      physicsRef.current.forEach((node, i) => {
        const pos = homePositions[i];
        node.homeX = (pos.dx / 100) * nW;
        node.homeY = (pos.dy / 100) * currUsableH + currTopOffset;
      });
    };

    if (!isMobile) {
      section.addEventListener("mousemove", onMouseMove);
      section.addEventListener("mouseleave", onMouseLeave);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (!isMobile) {
        section.removeEventListener("mousemove", onMouseMove);
        section.removeEventListener("mouseleave", onMouseLeave);
      }
      window.removeEventListener("resize", onResize);
    };
  }, [homePositions, isMobile]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative h-screen w-full overflow-hidden bg-transparent"
    >
      {/* Inner wrapper — exit transition animates this, not individual cards */}
      <div ref={innerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Canvas sits BEHIND cards; pointer-events disabled so events reach cards */}
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
        />

        {/* Skill cloud & Headers wrapped in a container for internal scrolling */}
        <div ref={gridContainerRef} style={{ position: "absolute", inset: 0 }}>
          {/* Skill cloud — z-index above canvas */}
          <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
            {SKILLS.map((s, i) => {
              const pos = isMobile ? MOBILE_POSITIONS[i] : s;
              const topOffset = isMobile ? 100 : 140;
              return (
                <SkillCard
                  key={s.skill}
                  ref={setCardRef(i)}
                  idx={i}
                  skill={s.skill}
                  img={s.img}
                  glow={s.glow}
                  // Position so that the card CENTER falls on (pos.dx%, pos.dy%)
                  left={`calc(${pos.dx}% - ${cardW / 2}px)`}
                  top={`calc((100% - ${topOffset}px) * ${pos.dy / 100} + ${topOffset}px - ${cardH / 2}px)`}
                  width={cardW}
                  height={cardH}
                  isMobile={isMobile}
                  onHoverChange={handleHoverChange}
                />
              );
            })}
          </div>

          {/* Category Headers */}
          <div style={{ position: "absolute", inset: 0, zIndex: 15, pointerEvents: "none" }}>
            {gridHeaders.map((header, i) => (
              <div
                key={header.label}
                className="category-header"
                style={{
                  position: "absolute",
                  left: header.x,
                  top: header.y,
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  whiteSpace: "nowrap"
                }}
              >
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-brand-accent/40" />
                <span className="font-display text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-white/50">
                  {header.label}
                </span>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-brand-accent/40" />
              </div>
            ))}
          </div>
        </div> {/* end gridContainerRef */}

        {/* Heading overlay — pointer-events none so it doesn't steal hover */}
        <div
          ref={headingRef}
          style={{ position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none" }}
          className="flex flex-col items-center justify-center select-none"
        >
          <SplitText
            text="SKILLS"
            className="font-display text-[clamp(4rem,9vw,8rem)] font-bold text-white tracking-widest leading-none text-center drop-shadow-[0_0_40px_rgba(255,255,255,0.08)]"
            delay={0}
            duration={0.9}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40, scale: 0.85 }}
            to={{ opacity: 1, y: 0, scale: 1 }}
            threshold={0.4}
          />
          <p className="text-brand-accent tracking-[0.3em] uppercase text-xs mt-5 font-body opacity-70">
            The tech ecosystem I thrive in
          </p>
        </div>

        {/* Edge fades */}
        <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-20"
          style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }} />
        <div className="absolute bottom-0 left-0 w-full h-32 pointer-events-none z-20"
          style={{ background: "linear-gradient(to top, #000 0%, transparent 100%)" }} />
      </div>
    </section>
  );
}

// ─── SkillCard ────────────────────────────────────────────────────────────────
const SkillCard = forwardRef(({ idx, skill, img, glow, left, top, width, height, isMobile, onHoverChange }, ref) => {
  const [hovered, setHovered] = useState(false);

  const onEnter = () => { setHovered(true); onHoverChange?.(idx, true); };
  const onLeave = () => { setHovered(false); onHoverChange?.(idx, false); };

  return (
    <div
      ref={ref}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{
        position: "absolute", left, top, width, height,
        willChange: "transform", cursor: "pointer", // root element transform managed by main rAF loop smoothly
        zIndex: hovered ? 50 : 10,
      }}
    >
      {/* Inner handles all visual hover scaled/glow effects independently */}
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 16,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 6,
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          transition: "transform 0.25s ease, background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease",
          transform: hovered
            ? `scale(${isMobile ? 1.03 : 1.07}) translateY(${isMobile ? -2 : -4}px)`
            : "scale(1) translateY(0)",
          background: hovered
            ? `linear-gradient(135deg, ${glow}30 0%, rgba(255,255,255,0.1) 100%)`
            : "rgba(255,255,255,0.042)",
          border: hovered ? `1px solid ${glow}AA` : "1px solid rgba(255,255,255,0.09)",
          boxShadow: hovered
            ? `0 0 28px ${glow}55, 0 8px 30px rgba(0,0,0,0.3)`
            : "0 2px 10px rgba(0,0,0,0.18)",
        }}
      >
        <img
          src={img} alt={skill} draggable={false}
          style={{
            width: isMobile ? 28 : 34, height: isMobile ? 28 : 34, objectFit: "contain",
            filter: hovered ? `drop-shadow(0 0 10px ${glow})` : "opacity(0.75)",
            transition: "filter 0.25s",
          }}
        />
        <span
          style={{
            fontSize: isMobile ? "9px" : "8.5px", // Slightly larger on mobile for readability
            letterSpacing: "0.12em",
            textTransform: "uppercase", fontFamily: "var(--font-body)", fontWeight: 500,
            whiteSpace: "nowrap",
            color: hovered ? glow : "rgba(255,255,255,0.6)",
            textShadow: hovered ? `0 0 10px ${glow}88` : "none",
            transition: "color 0.25s, text-shadow 0.25s",
          }}
        >
          {skill}
        </span>
      </div>
    </div>
  );
});

SkillCard.displayName = "SkillCard";
