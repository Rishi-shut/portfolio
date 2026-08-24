export default function Marquee({ items }) {
  const row = (hidden) => (
    <div aria-hidden={hidden} style={{ display: "flex" }}>
      {[...items, ...items].map((it, i) => (
        <span key={i} className={`mq-item${it.solid ? " solid" : ""}`}>
          {it.text} ✦
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
