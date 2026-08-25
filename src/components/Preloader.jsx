import { useEffect } from "react";
import { motion } from "framer-motion";

const NAME = "MRIGANK";

export default function Preloader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2300);
    return () => clearTimeout(t);
  }, []);

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
        exit={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.45, ease: "easeIn" }}
      >
        <span className="pre-corner tl">Folio © 2026</span>
        <span className="pre-corner tr">MRG-01</span>

        <motion.svg
          className="pre-gem"
          viewBox="0 0 120 140"
          initial="hidden"
          animate="show"
        >
          <motion.path
            d="M60 8 L98 56 L60 132 L22 56 Z"
            className="pre-stroke main"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
          <motion.path
            d="M60 8 L44 56 L60 132 M60 8 L76 56 L60 132 M22 56 L44 56 L76 56 L98 56"
            className="pre-stroke facet"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1 } }}
            transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
          />
        </motion.svg>

        <div className="pre-name font-display" aria-label="Mrigank">
          {NAME.split("").map((c, i) => (
            <span key={i} className="pre-letter">
              <motion.span
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.75, delay: 0.3 + i * 0.065, ease: [0.22, 1, 0.36, 1] }}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </div>

        <div className="pre-sub">Singh — Portfolio</div>

        <div className="pre-bar">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.9, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </motion.div>
    </div>
  );
}
