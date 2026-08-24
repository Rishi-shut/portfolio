import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { MOODS, blendCoeffs } from "../shader/moods";

const MoodCtx = createContext(null);

export function MoodProvider({ children }) {
  const engine = useRef({ to: 0, from: null, t0: 0 });
  const [index, setIndex] = useState(0);

  const setMood = useCallback((i) => {
    const e = engine.current;
    if (i === e.to && !e.from) return;
    e.from = blendCoeffs(e);
    e.to = i;
    e.t0 = performance.now();
    setIndex(i);
  }, []);

  const value = useMemo(() => ({ engine, index, setMood }), [index, setMood]);
  return <MoodCtx.Provider value={value}>{children}</MoodCtx.Provider>;
}

export function useMood() {
  return useContext(MoodCtx);
}

export { MOODS };
