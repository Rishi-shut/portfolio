import { Reveal, FadeUp } from "../components/Motion";

function Icon({ name, size = 16 }) {
  const paths = {
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2|M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    briefcase: "M4 7h16v13H4z|M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    pin: "M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11|M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5",
    mail: "M3 6h18v12H3z|M3 7l9 6 9-6",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18|M12 7v5l3 2",
    code: "M8 6l-6 6 6 6|M16 6l6 6-6 6",
    palette: "M12 21a9 9 0 1 1 9-9c0 2-1.5 3-3 3h-2a2 2 0 0 0-1.4 3.4c.4.5 0 2.6-2.6 2.6",
    bulb: "M9 18h6|M10 21h4|M12 3a6 6 0 0 1 4 10.5c-.8.7-1 1.5-1 2.5h-6c0-1-.2-1.8-1-2.5A6 6 0 0 1 12 3",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2|M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8|M23 21v-2a4 4 0 0 0-3-3.9|M16 3.1a4 4 0 0 1 0 7.8",
    diamond: "M12 3l7 6-7 12L5 9z|M5 9h14",
    chart: "M3 20h18|M6 16l4-5 3 3 5-7",
    bolt: "M13 2L4 14h6l-1 8 9-12h-6l1-8z",
    inf: "M6 9a3 3 0 1 0 0 6c2.5 0 3.5-6 6-6a3 3 0 1 1 0 6c-2.5 0-3.5-6-6-6",
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name].split("|").map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}

const GLANCE = [
  { icon: "user", k: "Name", v: "Mrigank Singh" },
  { icon: "briefcase", k: "Role", v: "Full Stack Developer" },
  { icon: "pin", k: "Location", v: "India" },
  { icon: "mail", k: "Email", v: "mriganksingh7890@gmail.com", href: "mailto:mriganksingh7890@gmail.com" },
  { icon: "clock", k: "Availability", v: "Open to Opportunities", tint: true },
];

const STATS = [
  { icon: "code", num: "5+", lbl: "Years Coding", sub: "Consistent Learning" },
  { icon: "diamond", num: "20+", lbl: "Projects Built", sub: "End to End" },
  { icon: "inf", num: "", lbl: "Curiosity", sub: "Always Exploring" },
  { icon: "bolt", num: "", lbl: "Problem Solver", sub: "I love a good challenge" },
];

const JOURNEY = [
  ["2020", "Started my coding journey with curiosity and a desire to build things."],
  ["2022", "Explored full stack development and built my first real-world projects."],
  ["2024", "Focused on creating impactful solutions and improving user experiences."],
  ["2026", "Continuing to learn, build and collaborate on meaningful ideas."],
];

const DRIVES = [
  { icon: "code", t: "Building", d: "I love turning complex problems into simple, beautiful and functional solutions." },
  { icon: "palette", t: "Designing", d: "Good design is not just how it looks, but how it works and feels." },
  { icon: "bulb", t: "Learning", d: "I'm always curious and constantly exploring new technologies and ideas." },
  { icon: "users", t: "Collaborating", d: "Great things happen when we build together and share knowledge." },
];

const BELIEFS = [
  { icon: "diamond", d: "Keep it simple, make it powerful." },
  { icon: "code", d: "Write clean code, build strong products." },
  { icon: "user", d: "User first, always." },
  { icon: "chart", d: "Consistency beats motivation." },
  { icon: "inf", d: "Stay curious, keep evolving." },
];

const STACK = ["JavaScript", "TypeScript", "React", "Node.js", "Next.js", "HTML / CSS", "Tailwind CSS", "Git", "Figma", "VS Code", "and more…"];

function Orbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <span className="orbit-ring r1" />
      <span className="orbit-ring r2" />
      <span className="orbit-ring r3" />
      <span className="orbit-core" />
      <span className="orb o1"><i /></span>
      <span className="orb o2"><i /></span>
      <span className="orb o3"><i /></span>
      <span className="orb o4"><i /></span>
    </div>
  );
}

export default function About() {
  return (
    <div className="wrap sec-pad">
      <div className="about-hero">
        <div className="about-intro">
          <FadeUp play y={16}>
            <span className="eyebrow">Who I Am</span>
          </FadeUp>
          <FadeUp play delay={0.1}>
            <h2 className="about-title font-display">
              <span>About</span>
              <span className="stroke">Me</span>
            </h2>
          </FadeUp>
          <FadeUp play delay={0.2}>
            <p className="about-copy">
              I'm Mrigank Singh, a passionate developer who loves building clean,
              efficient and meaningful digital experiences.
            </p>
            <p className="about-copy">
              I enjoy turning ideas into reality through code, design and
              problem solving.
            </p>
          </FadeUp>
          <FadeUp play delay={0.3}>
            <a className="btn btn-ghost" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Download Resume ↗
            </a>
          </FadeUp>
        </div>

        <Reveal delay={0.15}>
          <Orbit />
        </Reveal>

        <Reveal delay={0.2}>
          <div className="glass glance">
            <span className="glance-head">At a Glance</span>
            {GLANCE.map((g) => (
              <div className="glance-row" key={g.k}>
                <Icon name={g.icon} />
                <span className="glance-k">{g.k}</span>
                {g.href ? (
                  <a className="glance-v" href={g.href}>{g.v}</a>
                ) : (
                  <span className={`glance-v${g.tint ? " tint" : ""}`}>{g.v}</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="stats-row">
        {STATS.map((s, i) => (
          <Reveal key={s.lbl} delay={i * 0.06}>
            <div className="glass stat-tile">
              <span className="stat-ic"><Icon name={s.icon} size={18} /></span>
              {s.num ? <span className="stat-num font-display">{s.num}</span> : <span className="stat-ic big"><Icon name={s.icon} size={26} /></span>}
              <span className="stat-lbl">{s.lbl}</span>
              <span className="stat-sub">{s.sub}</span>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="about-cards">
        <Reveal delay={0.05}>
          <div className="glass journey">
            <span className="card-head">My Journey</span>
            {JOURNEY.map(([y, d], i) => (
              <div className="j-item" key={y}>
                <span className="j-year font-display">{y}</span>
                <span className="j-rail"><i className={i === JOURNEY.length - 1 ? "last" : ""} /></span>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="glass drives">
            <span className="card-head">What Drives Me</span>
            {DRIVES.map((d) => (
              <div className="drive" key={d.t}>
                <span className="drive-ico"><Icon name={d.icon} size={17} /></span>
                <div>
                  <b>{d.t}</b>
                  <p>{d.d}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.19}>
          <div className="glass beliefs">
            <span className="card-head">I Believe In</span>
            {BELIEFS.map((b) => (
              <div className="belief" key={b.d}>
                <Icon name={b.icon} size={15} />
                <span>{b.d}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <div className="glass stack">
          <span className="card-head">Tech Stack &amp; Tools</span>
          <div className="chips">
            {STACK.map((s) => (
              <span key={s} className="chip" data-hover>{s}</span>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="about-foot">
        <span>© 2026 Mrigank Singh</span>
        <span className="af-cta">Let's build something great</span>
      </div>
    </div>
  );
}
