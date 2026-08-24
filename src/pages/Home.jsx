import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Magnetic from "../components/Magnetic";
import Marquee from "../components/Marquee";
import { SplitLetters, FadeUp } from "../components/Motion";

const MARQUEE = [
  { text: "Design", solid: false },
  { text: "Code", solid: true },
  { text: "Motion", solid: false },
  { text: "WebGL", solid: true },
  { text: "Experience", solid: false },
];

export default function Home({ go, start }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 20 });
  const py = useSpring(my, { stiffness: 60, damping: 20 });
  const t1x = useTransform(px, (v) => v * 14);
  const t1y = useTransform(py, (v) => v * 10);
  const t2x = useTransform(px, (v) => v * -22);
  const t2y = useTransform(py, (v) => v * -14);

  const onMouse = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <div className="wrap">
      <section className="hero" onMouseMove={onMouse}>
        <FadeUp play={start} delay={0.15}>
          <div className="meta-row">
            <span>Folio © 2026</span>
            <span><span className="status-dot" />Open for work</span>
          </div>
        </FadeUp>

        <h1 className="hero-title font-display">
          <motion.span style={{ x: t1x, y: t1y, display: "block" }}>
            <SplitLetters text="Creative" play={start} delay={0.25} stagger={0.035} />
          </motion.span>
          <motion.span className="stroke" style={{ x: t2x, y: t2y, display: "block" }}>
            <SplitLetters text="Developer" play={start} delay={0.45} stagger={0.035} />
            <span className="tm font-display">©</span>
          </motion.span>
        </h1>

        <div className="hero-sub">
          <FadeUp play={start} delay={0.9}>
            <p className="hero-blurb">
              Placeholder tagline — one or two lines about who you are, what you
              build, and the kind of problems you enjoy solving.
            </p>
          </FadeUp>
          <FadeUp play={start} delay={1.05} className="cta-row">
            <Magnetic>
              <button className="btn btn-primary" onClick={() => go("work")}>
                View Work ↗
              </button>
            </Magnetic>
            <Magnetic>
              <button className="btn btn-ghost" onClick={() => go("contact")}>
                Get in Touch
              </button>
            </Magnetic>
          </FadeUp>
        </div>

        <FadeUp play={start} delay={1.2}>
          <div className="hint-row" id="hint">
            <span>Scroll to explore</span>
            <span>Drag to stir the fluid</span>
            <span>Click to pulse · Keys 1–6 for moods</span>
          </div>
        </FadeUp>
      </section>

      <Marquee items={MARQUEE} />
    </div>
  );
}
