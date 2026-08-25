import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Preloader({ onDone }) {
  const progress = useMotionValue(0);
  const count = useTransform(progress, (v) => String(Math.floor(v)).padStart(3, "0"));
  const [n, setN] = useState(0);
  const gemA = useTransform(progress, [0, 0.55], [0, 1]);
  const gemB = useTransform(progress, [0.3, 0.85], [0, 1]);
  const gemScale = useTransform(progress, [0.82, 1], [1, 1.7]);
  const gemGlow = useTransform(progress, [0.82, 1], [0.4, 1]);
  const lineScale = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    const c = animate(progress, 100, {
      duration: 2,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setTimeout(onDone, 320),
    });
    return () => c.stop();
  }, []);

  useEffect(() => count.on("change", setN), [count]);

  return (
    <div className="preloader">
      <motion.div
        className="pre-half top"
        exit={{ y: "-101%" }}
        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="pre-half bottom"
        exit={{ y: "101%" }}
        transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
      />

      <motion.div
        className="pre-core"
        exit={{ opacity: 0, scale: 1.18 }}
        transition={{ duration: 0.45, ease: "easeIn" }}
      >
        <span className="pre-corner tl">Mrigank Singh</span>
        <span className="pre-corner tr">Folio © 2026</span>

        <motion.svg className="pre-gem" viewBox="0 0 120 140" style={{ scale: gemScale }}>
          <motion.path
            d="M60 8 L98 56 L60 132 L22 56 Z"
            className="pre-stroke main"
            style={{ pathLength: gemA, opacity: gemGlow }}
          />
          <motion.path
            d="M60 8 L44 56 L60 132 M60 8 L76 56 L60 132 M22 56 L44 56 L76 56 L98 56"
            className="pre-stroke facet"
            style={{ pathLength: gemB }}
          />
        </motion.svg>

        <div className="pre-count font-display">{n}</div>
        <div className="pre-bar"><motion.div style={{ scaleX: lineScale }} /></div>
        <div className="pre-label">MRG-01 · Loading Folio</div>
      </motion.div>
    </div>
  );
}
