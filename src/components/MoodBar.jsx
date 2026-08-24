import { useMood, MOODS } from "../context/MoodContext";
import { gradAt, hex } from "../shader/moods";

export default function MoodBar() {
  const { index, setMood } = useMood();

  return (
    <div className="moodbar" role="toolbar" aria-label="Color mood">
      {MOODS.map((m, i) => (
        <button
          key={m.name}
          type="button"
          className="mood-dot"
          style={{ "--dot": hex(gradAt(m, 0.6)) }}
          aria-label={`Mood: ${m.name}`}
          aria-pressed={i === index}
          onClick={() => setMood(i)}
        />
      ))}
      <span className="mood-name" aria-live="polite">{MOODS[index].name}</span>
    </div>
  );
}
