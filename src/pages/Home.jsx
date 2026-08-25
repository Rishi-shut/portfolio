import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import PrismScene from "../three/PrismScene";
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

function useDrift(speed) {
  const ref = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const loop = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const off = (r.top + r.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${off}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [speed]);
  return ref;
}

function DriftCard({ speed, pos, k, v }) {
  const ref = useDrift(speed);
  return (
    <div ref={ref} className={`drift-card ${pos}`}>
      <span className="k">{k}</span>
      <span className="v font-display">{v}</span>
    </div>
  );
}

export default function Home({ go, start }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 20 });
  const py = useSpring(my, { stiffness: 60, damping: 20 });
  const t1x = useTransform(px, (v) => v * 14);
  const t1y = useTransform(py, (v) => v * 10);
  const t2x = useTransform(px, (v) => v * -22);
  const t2y = useTransform(py, (v) => v * -14);

  const { scrollY } = useScroll();
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;
  const heroScale = useTransform(scrollY, [0, vh * 0.85], [1, 2.8]);
  const heroFade = useTransform(scrollY, [0, vh * 0.62], [1, 0]);
  const heroBlur = useTransform(scrollY, [0, vh * 0.7], ["blur(0px)", "blur(16px)"]);
  const cueFade = useTransform(scrollY, [0, 220], [1, 0]);

  const onMouse = (e) => {
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <div className="wrap">
      <PrismScene />

      <section className="hero" onMouseMove={onMouse}>
        <motion.div
          className="hero-zoom"
          style={{ scale: heroScale, opacity: heroFade, filter: heroBlur }}
        >
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
              <span>Scroll to discover</span>
              <span>Drag to stir the fluid</span>
              <span>Click to pulse · Keys 1–6 for moods</span>
            </div>
          </FadeUp>
        </motion.div>

        <motion.div className="scroll-cue" style={{ opacity: cueFade }}>
          Scroll to discover
        </motion.div>
      </section>

      <Marquee items={MARQUEE} />

      <section className="beat">
        <FadeUp play={start} delay={0.05}>
          <span className="eyebrow">The Practice</span>
        </FadeUp>
        <FadeUp play={start} delay={0.15}>
          <h2 className="font-display">Design. Code. Motion.</h2>
        </FadeUp>
        <FadeUp play={start} delay={0.25}>
          <p>
            Placeholder line — one sentence about how you blend engineering and
            aesthetics into products that feel alive under the cursor.
          </p>
        </FadeUp>
      </section>

      <section className="drift">
        <DriftCard pos="p1" speed={0.07} k="Live Builds" v="03" />
        <DriftCard pos="p2" speed={-0.05} k="Color Moods" v="06" />
        <DriftCard pos="p3" speed={0.09} k="Rendered With" v="WebGL" />
        <DriftCard pos="p4" speed={-0.08} k="Powered By" v="React" />
      </section>

      <div className="giant-mark font-display" aria-hidden="true">
        Mrigank
      </div>
    </div>
  );
}
