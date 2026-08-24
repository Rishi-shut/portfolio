import { Reveal } from "../components/Motion";

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "GLSL / WebGL",
  "CSS Architecture", "Figma", "Git", "Performance", "Accessibility",
];

const STATS = [
  ["5+", "Years Experience"],
  ["20+", "Projects Shipped"],
  ["∞", "Curiosity"],
];

export default function About() {
  return (
    <div className="wrap sec-pad">
      <Reveal>
        <div className="sec-head">
          <h2 className="font-display">About</h2>
          <span>Who I Am</span>
        </div>
      </Reveal>
      <div className="about-grid">
        <Reveal delay={0.05}>
          <article className="glass about-card">
            <p>
              Placeholder bio paragraph — a short story about your background,
              your craft, and what drives you. Mention where you're based and
              what you're currently focused on.
            </p>
            <p>
              Second placeholder paragraph — highlights, philosophy, or the kind
              of work you want more of. Keep it human and specific.
            </p>
          </article>
        </Reveal>
        <div className="fact-stack">
          {STATS.map(([num, lbl], i) => (
            <Reveal key={lbl} delay={0.1 + i * 0.08}>
              <div className="glass fact-card hoverable">
                <div className="num font-display">{num}</div>
                <div className="lbl">{lbl}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="sec-pad" style={{ paddingTop: 60 }}>
        <Reveal>
          <div className="sec-head">
            <h2 className="font-display">Skills</h2>
            <span>Toolkit</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass skills-card">
            <div className="chips">
              {SKILLS.map((s) => (
                <span key={s} className="chip" data-hover>{s}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
      <footer className="foot">© 2026 Your Name · Placeholder bio</footer>
    </div>
  );
}
