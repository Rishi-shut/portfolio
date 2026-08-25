import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMAIL = "mriganksingh7890@gmail.com";
const ENDPOINT = "https://formsubmit.co/ajax/27d5f206cf5dce40279bcc60f3c80c24";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H9M17 7v8" />
    </svg>
  );
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [shaking, setShaking] = useState(false);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (status === "sent" || status === "error") {
      setStatus("idle");
      setError("");
    }
  };

  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    if (!form.name.trim() || !form.message.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus("error");
      setError("Name, a valid email and a message — all three, please.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          _subject: `Portfolio message — ${form.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json();
      if (res.ok && String(data.success) === "true") {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Delivery failed — try again in a moment.");
      }
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not send — copy my email below instead.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  return (
    <div className="cfx glass">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            className="sent-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.svg className="sent-check" viewBox="0 0 100 100">
              <motion.circle
                cx="50" cy="50" r="46"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
              <motion.path
                d="M30 52 L45 66 L72 36"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.45, delay: 0.55, ease: "easeOut" }}
              />
            </motion.svg>
            <h3 className="sent-title font-display">Message Sent</h3>
            <p className="sent-sub">It's in my inbox — I'll get back to you shortly.</p>
            <button type="button" className="send-again" onClick={() => setStatus("idle")}>
              Send another ↗
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={submit}
            noValidate
            className={shaking ? "shake-inner" : ""}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="cfx-row">
              <label className="ffield">
                <input
                  className="finput"
                  type="text"
                  placeholder=" "
                  value={form.name}
                  onChange={set("name")}
                  autoComplete="name"
                />
                <span className="ftag">Your Name</span>
              </label>
              <label className="ffield">
                <input
                  className="finput"
                  type="email"
                  placeholder=" "
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                />
                <span className="ftag">Your Email</span>
              </label>
            </div>

            <label className="ffield">
              <textarea
                className="finput farea"
                rows={6}
                placeholder=" "
                value={form.message}
                onChange={set("message")}
              />
              <span className="ftag">Your Message</span>
            </label>

            <div className="cfx-foot">
              <button
                type="submit"
                disabled={status === "sending"}
                className={`fsubmit${status === "sending" ? " busy" : ""}${status === "error" ? " err" : ""}`}
              >
                <span className="fsubmit-bg" />
                <span className="fsubmit-lbl">
                  {status === "idle" && "Send Message"}
                  {status === "sending" && "Sending…"}
                  {status === "error" && "Retry"}
                  <ArrowIcon />
                </span>
              </button>

              <button
                type="button"
                onClick={copy}
                className={`copy-chip${copied ? " copied" : ""}`}
              >
                {copied ? "Copied to clipboard ✓" : `${EMAIL} ⧉`}
              </button>
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  key="err"
                  className="cform-err"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  ⚠ {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
