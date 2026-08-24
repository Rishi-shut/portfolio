import Magnetic from "../components/Magnetic";
import { SplitLetters, FadeUp } from "../components/Motion";

export default function Contact() {
  return (
    <div className="wrap sec-pad">
      <section className="contact-hero">
        <FadeUp play y={18}>
          <h2 className="contact-title font-display">
            <SplitLetters text="Let's Talk" stagger={0.04} play />
          </h2>
        </FadeUp>
        <FadeUp play delay={0.35}>
          <p className="contact-sub">
            Placeholder line — invite people to reach out for work,
            collaboration, or just to say hi. Replies within 24 hours.
          </p>
        </FadeUp>
        <FadeUp play delay={0.5}>
          <Magnetic strength={0.45}>
            <a className="btn btn-primary" href="mailto:hello@example.com">
              hello@example.com
            </a>
          </Magnetic>
        </FadeUp>
        <FadeUp play delay={0.65}>
          <div className="socials">
            {["GitHub", "LinkedIn", "Twitter / X", "Résumé"].map((s) => (
              <a key={s} href="#" onClick={(e) => e.preventDefault()} data-hover>
                {s} ↗
              </a>
            ))}
          </div>
        </FadeUp>
      </section>
      <footer className="foot">© 2026 Mrigank Singh · Built with React + WebGL</footer>
    </div>
  );
}
