import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  const dx = useMotionValue(-100);
  const dy = useMotionValue(-100);
  const rx = useSpring(dx, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(dy, { stiffness: 260, damping: 26, mass: 0.6 });
  const s = useSpring(1, { stiffness: 300, damping: 22 });

  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e) => {
      dx.set(e.clientX);
      dy.set(e.clientY);
    };
    const over = (e) => {
      const hit = e.target.closest?.("a, button, .chip, [data-hover]");
      setHot(!!hit);
      s.set(hit ? 2 : 1);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, [dx, dy, s]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-dot" style={{ x: dx, y: dy }} />
      <motion.div className="cursor-ring" style={{ x: rx, y: ry, scale: hot ? 1.9 : 1 }} />
    </>
  );
}
