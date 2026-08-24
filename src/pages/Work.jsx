import { Reveal } from "../components/Motion";

const PROJECTS = [
  { idx: "01", title: "Project One", tags: ["React", "Node.js", "WebGL"] },
  { idx: "02", title: "Project Two", tags: ["TypeScript", "API"] },
  { idx: "03", title: "Project Three", tags: ["Design", "Figma"] },
  { idx: "04", title: "Project Four", tags: ["Three.js", "Shaders"] },
];

export default function Work() {
  return (
    <div className="wrap sec-pad">
      <Reveal>
        <div className="sec-head">
          <h2 className="font-display">Selected Work</h2>
          <span>2024 — 2026</span>
        </div>
      </Reveal>
      <div className="work-list">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.idx} delay={i * 0.06}>
            <a
              className="work-row"
              href="#"
              onClick={(e) => e.preventDefault()}
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
      <footer className="foot">© 2026 Your Name · Placeholder projects</footer>
    </div>
  );
}
