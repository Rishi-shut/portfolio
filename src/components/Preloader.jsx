import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function Preloader({ onDone }) {
  const progress = useMotionValue(0);
  const barScale = useTransform(progress, [0, 100], [0, 1]);
  const count = useTransform(progress, (v) => String(Math.floor(v)).padStart(3, "0"));
  const [n, setN] = useState(0);

  useEffect(() => {
    const controls = animate(progress, 100, {
      duration: 1.4,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => setTimeout(onDone, 250),
    });
    return () => controls.stop();
  }, []);

  useEffect(() => count.on("change", setN), [count]);

  return (
    <motion.div
      className="preloader"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="pre-count font-display">{n}</div>
      <div className="pre-bar"><motion.div style={{ scaleX: barScale }} /></div>
      <div className="pre-label">Loading Folio</div>
    </motion.div>
  );
}
