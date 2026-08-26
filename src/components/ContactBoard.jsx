import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMood, MOODS } from "../context/MoodContext";
import { gradAt, hex } from "../shader/moods";

const EMAIL = "mriganksingh7890@gmail.com";

const TRACKS = [
  { id: "lofi", label: "Lo-Fi", src: "./music/lofi.mp3" },
  { id: "rnb", label: "R&B", src: "./music/rnb.mp3" },
  { id: "punk", label: "Punk", src: "./music/punk.mp3" },
];

function Vinyl() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [genre, setGenre] = useState("lofi");

  const track = TRACKS.find((x) => x.id === genre);

  useEffect(() => {
    const a = audioRef.current;
    if (a) {
      a.src = TRACKS[0].src;
      a.load();
    }
    return () => {
      if (a) a.pause();
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.volume = 0.45;
      const p = a.play();
      if (p) p.then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const pick = (g) => {
    const a = audioRef.current;
    if (!a) return;
    const t = TRACKS.find((x) => x.id === g);
    a.volume = 0.45;
    if (a.src.indexOf(t.src) === -1) {
      a.src = t.src;
    }
    const p = a.play();
    if (p) p.then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <Tile className="t-vinyl" delay={0.18} label="Music player">
      <audio ref={audioRef} preload="auto" loop />
      <button
        type="button"
        className={`vinyl${playing ? " spin" : ""}`}
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
      >
        <span className="vinyl-label" />
        <span className="vinyl-notch" />
        <span className="vinyl-hole" />
      </button>
      <div className="vinyl-eq" data-on={playing}>
        <i style={{ "--i": 0 }} /><i style={{ "--i": 1 }} /><i style={{ "--i": 2 }} /><i style={{ "--i": 3 }} />
      </div>
      <div className="vinyl-genres">
        {TRACKS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`genre-btn${genre === t.id ? " active" : ""}`}
            onClick={() => pick(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <span className="tile-sub vinyl-state">{playing ? `Now Playing · ${track.label}` : "Pick a record"}</span>
    </Tile>
  );
}

function Tile({ className = "", delay = 0, children, onClick, href, label }) {
  const tag = href ? motion.a : onClick ? motion.button : motion.div;
  const linkProps = href ? { href, target: "_blank", rel: "noopener noreferrer" } : {};
  const Tag = tag;
  return (
    <Tag
      className={`tile ${className}`}
      onClick={onClick}
      aria-label={label}
      {...linkProps}
      initial={{ opacity: 0, y: 26, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </Tag>
  );
}

function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(now);
  return { time, date };
}

function Dial() {
  const { index, setMood } = useMood();
  return (
    <div className="dial-wrap">
      <svg className="dial-svg" viewBox="0 0 200 200">
        <defs>
          <path
            id="dial-circ"
            d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0"
          />
        </defs>
        <g className="dial-rot">
          <text className="dial-text">
            <textPath href="#dial-circ">
              MRIGANK SINGH ✦ FOLIO © 2026 ✦ MRIGANK SINGH ✦ FOLIO © 2026 ✦
            </textPath>
          </text>
        </g>
      </svg>
      <span
        className="dial-needle"
        style={{ transform: `translateX(-50%) rotate(${index * 60}deg)` }}
      />
      <button
        type="button"
        className="dial-core"
        onClick={() => setMood((index + 1) % MOODS.length)}
        aria-label={`Switch mood, current ${MOODS[index].name}`}
      >
        {MOODS[index].name}
      </button>
    </div>
  );
}

export default function ContactBoard({ go }) {
  const [copied, setCopied] = useState(false);
  const { time, date } = Clock();

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  }

  function toForm() {
    const el = document.getElementById("cform-anchor");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const card = el?.querySelector(".cfx");
    if (card) {
      card.classList.remove("flash");
      void card.offsetWidth;
      card.classList.add("flash");
    }
  }

  return (
    <div className="board-zone">
      <span className="board-side">All Rights Reserved</span>

      <div className="board">
        <Tile className="t-status" delay={0} label="Availability status">
          <span className="pulse-dot" />
          <span className="tile-big">Open</span>
          <span className="tile-sub">to work</span>
        </Tile>

        <Tile className="t-screen" delay={0.06}>
          <div className="scr-top">
            <span className="scr-tag">MRG-01</span>
            <span className="scr-batt">
              <i /><i /><i />
            </span>
          </div>
          <div className="scr-mq">
            <span>Say Hello ✦ Let's Build ✦ Say Hello ✦ Let's Build ✦ </span>
            <span aria-hidden="true">Say Hello ✦ Let's Build ✦ Say Hello ✦ Let's Build ✦ </span>
          </div>
          <div className="scr-bottom">
            <span>{date} {time} IST</span>
            <span className="scr-cursor" />
          </div>
        </Tile>

        <Tile className="t-copy round" delay={0.12} onClick={copyEmail} label="Copy email address">
          <span className="tile-big">{copied ? "✓" : "Copy"}</span>
          <span className="tile-sub">{copied ? "copied" : "email"}</span>
        </Tile>

        <Tile className="t-vinyl" delay={0.18} label="Music player">
          <Vinyl />
        </Tile>

        <Tile className="t-hello" delay={0.24} onClick={toForm} label="Scroll to contact form">
          <span className="tile-big">Say Hello</span>
          <span className="tile-sub">• {EMAIL}</span>
        </Tile>

        <Tile className="t-work" delay={0.3} onClick={() => go("work")} label="Open work page">
          <span className="tile-big">See Work</span>
          <span className="tile-sub">• 3 live builds</span>
        </Tile>

        <Tile className="t-dial" delay={0.36} label="Color mood dial">
          <Dial />
        </Tile>

        <Tile
          className="t-social s-gh"
          delay={0.48}
          href="https://github.com/Rishi-shut"
          label="GitHub profile"
        >
          <svg viewBox="0 0 24 24" className="soc-ico" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97 0 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
          <span className="tile-sub">github</span>
        </Tile>

        <Tile
          className="t-social s-li"
          delay={0.54}
          href="https://www.linkedin.com/in/mrigank-singh-9215512a8/"
          label="LinkedIn profile"
        >
          <svg viewBox="0 0 24 24" className="soc-ico" fill="currentColor">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z" />
          </svg>
          <span className="tile-sub">linkedin</span>
        </Tile>

        <Tile className="t-social s-write" delay={0.6} onClick={toForm} label="Open contact form">
          <svg viewBox="0 0 24 24" className="soc-ico" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
            <path d="M3.5 7l8.5 6 8.5-6" />
          </svg>
          <span className="tile-sub">write</span>
        </Tile>

        <Tile
          className="t-top round"
          delay={0.66}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          label="Back to top"
        >
          <span className="tile-big" style={{ fontSize: 20 }}>↑</span>
          <span className="tile-sub">top</span>
        </Tile>
      </div>

      <p className="board-caption">MRG Contact Board — A-01</p>
    </div>
  );
}
