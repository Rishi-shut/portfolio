import ContactForm from "../components/ContactForm";
import ContactBoard from "../components/ContactBoard";
import { SplitLetters, FadeUp, Reveal } from "../components/Motion";

export default function Contact({ go }) {
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
            Have a project, an opportunity, or just an idea worth bouncing?
            The board is live — pick a switch.
          </p>
        </FadeUp>
      </section>

      <ContactBoard go={go} />

      <div id="cform-anchor" style={{ paddingTop: 26 }}>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>

      <footer className="foot">© 2026 Mrigank Singh · Built with React + WebGL</footer>
    </div>
  );
}
