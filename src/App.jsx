import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoodProvider } from "./context/MoodContext";
import ShaderCanvas from "./components/ShaderCanvas";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import Nav from "./components/Nav";
import MoodBar from "./components/MoodBar";
import Home from "./pages/Home";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";

const pageMotion = {
  initial: { opacity: 0, y: 26, filter: "blur(8px)" },
  enter: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -22, filter: "blur(8px)" },
};

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("home");

  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0 });
  };

  return (
    <MoodProvider>
      <ShaderCanvas />
      <Cursor />
      <AnimatePresence>
        {!loaded && <Preloader key="pre" onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      <div className="shell">
        <Nav page={page} go={go} />
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              variants={pageMotion}
              initial="initial"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              {page === "home" && <Home go={go} start={loaded} />}
              {page === "work" && <Work />}
              {page === "about" && <About />}
              {page === "contact" && <Contact go={go} />}
            </motion.div>
          </AnimatePresence>
        </main>
        <MoodBar />
      </div>

      <noscript>
        <div style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center" }}>
          This portfolio needs JavaScript.
        </div>
      </noscript>
    </MoodProvider>
  );
}
