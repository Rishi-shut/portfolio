import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "../components/Motion";

const PROJECTS = [
  {
    idx: "01",
    title: "FraudGuard",
    tags: ["Python", "Flask", "XGBoost", "SHAP"],
    url: "https://credit-card-fraud-l06p.onrender.com/",
    shot: "/work/fraudguard.jpg",
    note: "Full Stack · Machine Learning",
    desc: "Real-time credit card fraud detection platform. ML models (XGBoost, Random Forest, Logistic) score transactions instantly with SHAP explainability — plus a live stream simulator, single/batch analysis and CSV audits.",
    role: "Design + Full Stack",
    status: "Live",
  },
  {
    idx: "02",
    title: "Pulse PFS",
    tags: ["React", "Finance", "Dashboard"],
    url: "https://pfs-wv9u.vercel.app/",
    shot: "/work/pulsepfs.jpg",
    note: "Frontend · Product Design",
    desc: "A personal finance system that turns raw numbers into clarity — track spending, budgets and balances in one clean, fast dashboard built with React.",
    role: "Design + Frontend",
    status: "Live",
  },
  {
    idx: "03",
    title: "Infinite Chop",
    tags: ["JavaScript", "Game", "Pixel-Art"],
    url: "https://lumberjack-five.vercel.app/",
    shot: "/work/infinitechop.jpg",
    note: "Game · Interactive",
    desc: "Retro pixel-art arcade game — chop fast, don't stop. Pure JavaScript with an old-school soul and one-more-go energy.",
    role: "Everything",
    status: "Live",
  },
];

export default function Work() {
  const [open, setOpen] = useState(null);

  return (
    <div className="wrap sec-pad">
      <Reveal>
        <div className="sec-head">
          <h2 className="font-display">Selected Work</h2>
          <span>Click a project</span>
        </div>
      </Reveal>
      <div className="work-list">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.idx} delay={i * 0.06}>
            <div className={`work-item${open === i ? " open" : ""}`}>
              <button
                type="button"
                className="work-row"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                data-hover
              >
                <span className="work-idx">{p.idx}</span>
                <span className="work-title">{p.title}</span>
                <span className="work-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                </span>
                <span className="work-arrow">{open === i ? "−" : "+"}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    className="work-detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="wd-inner">
                      <div className="wd-shot">
                        <img src={p.shot} alt={`${p.title} preview`} loading="lazy" />
                      </div>
                      <div className="wd-text">
                        <span className="wd-note">{p.note}</span>
                        <p>{p.desc}</p>
                        <div className="wd-meta">
                          <div><span className="wd-k">Role</span><span>{p.role}</span></div>
                          <div><span className="wd-k">Stack</span><span>{p.tags.join(" · ")}</span></div>
                          <div><span className="wd-k">Status</span><span className="wd-live">● {p.status}</span></div>
                        </div>
                      </div>
                      <a
                        className="btn btn-primary wd-btn"
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit Live ↗
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        ))}
      </div>
      <footer className="foot">© 2026 Mrigank Singh · Click a project to peek inside</footer>
    </div>
  );
}
