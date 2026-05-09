/**
 * SectionSkeleton
 * ─────────────────────────────────────────────────────────────────
 * Lightweight Suspense fallback rendered while a lazy section chunk
 * is downloading. Keeps the page height stable (no layout jump) and
 * provides a subtle shimmer so the user knows content is loading.
 *
 * Intentionally zero external dependencies — no GSAP, no Framer,
 * no CSS modules. Everything is inlined so this file itself never
 * adds to a lazy chunk.
 */

const SectionSkeleton = () => (
  <div
    aria-hidden="true"
    style={{
      width: "100%",
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1.5rem",
      padding: "2rem",
      background: "transparent",
      overflow: "hidden",
      position: "relative",
    }}
  >
    {/* Shimmer keyframe — injected once, removed with the element */}
    <style>{`
      @keyframes _sk_shimmer {
        0%   { background-position: -200% 0; }
        100% { background-position:  200% 0; }
      }
      .sk-bar {
        border-radius: 6px;
        background: linear-gradient(
          90deg,
          rgba(255,255,255,0.04) 25%,
          rgba(255,255,255,0.10) 50%,
          rgba(255,255,255,0.04) 75%
        );
        background-size: 200% 100%;
        animation: _sk_shimmer 1.6s ease-in-out infinite;
      }
    `}</style>

    {/* Fake heading bar */}
    <div className="sk-bar" style={{ width: "min(320px, 55%)", height: "2.5rem" }} />

    {/* Fake sub-line */}
    <div className="sk-bar" style={{ width: "min(200px, 35%)", height: "1rem", opacity: 0.6 }} />

    {/* Fake content block */}
    <div style={{ display: "flex", gap: "1rem", width: "min(640px, 85%)", marginTop: "1rem" }}>
      <div className="sk-bar" style={{ flex: 1, height: "6rem" }} />
      <div className="sk-bar" style={{ flex: 1, height: "6rem", opacity: 0.7 }} />
      <div className="sk-bar" style={{ flex: 1, height: "6rem", opacity: 0.5 }} />
    </div>
  </div>
);

export default SectionSkeleton;
