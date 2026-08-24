import { useMood } from "../context/MoodContext";

const LINKS = [
  ["home", "Home"],
  ["work", "Work"],
  ["about", "About"],
  ["contact", "Contact"],
];

export default function Nav({ page, go }) {
  const { index } = useMood();
  return (
    <nav className="topnav">
      <div className="wrap">
        <button className="wordmark" onClick={() => go("home")} data-hover>
          Your Name<em> — {String(index + 1).padStart(2, "0")}/06</em>
        </button>
        <div className="navlinks">
          {LINKS.map(([id, label]) => (
            <button
              key={id}
              className={page === id ? "active" : ""}
              onClick={() => go(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
