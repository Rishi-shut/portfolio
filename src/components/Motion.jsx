import { motion } from "framer-motion";

export function SplitLetters({ text, delay = 0, stagger = 0.03, play, className, charClass }) {
  const chars = Array.from(text);
  return (
    <span className={className} aria-label={text} role="text">
      {chars.map((c, i) => (
        <span className="ch" key={i} aria-hidden="true">
          <motion.span
            className={charClass}
            initial={{ y: "115%", rotate: 5 }}
            animate={play ? { y: "0%", rotate: 0 } : {}}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {c === " " ? "\u00A0" : c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function FadeUp({ children, delay = 0, play = true, className, y = 26 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={play ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
