import { Reveal } from "../components/Motion";

const PROJECTS = [
  {
    idx: "01",
    title: "FraudGuard",
    tags: ["Python", "Flask", "XGBoost", "SHAP"],
    url: "https://credit-card-fraud-l06p.onrender.com/",
  },
  {
    idx: "02",
    title: "Pulse PFS",
    tags: ["React", "Finance", "Dashboard"],
    url: "https://pfs-wv9u.vercel.app/",
  },
  {
    idx: "03",
    title: "Infinite Chop",
    tags: ["JavaScript", "Game", "Pixel-Art"],
    url: "https://lumberjack-five.vercel.app/",
  },
];

export default function Work() {
  return (
    <div className="wrap sec-pad">
      <Reveal>
        <div className="sec-head">
          <h2 className="font-display">Selected Work</h2>
          <span>Live Projects</span>
        </div>
      </Reveal>
      <div className="work-list">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.idx} delay={i * 0.06}>
            <a
              className="work-row"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
            >
              <span className="work-idx">{p.idx}</span>
              <span className="work-title">{p.title}</span>
              <span className="work-tags">
                {p.tags.map((t) => (
                  <span key={t} className="tag">{t}</span>
                ))}
              </span>
              <span className="work-arrow">↗</span>
            </a>
          </Reveal>
        ))}
      </div>
      <footer className="foot">© 2026 Mrigank Singh · Click a project to open the live build</footer>
    </div>
  );
}
