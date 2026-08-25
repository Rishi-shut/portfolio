const ID = "27d5f206cf5dce40279bcc60f3c80c24";
const EMAIL = "mriganksingh7890@gmail.com";
const body = JSON.stringify({
  name: "Diagnostic Test",
  email: "test@example.com",
  message: "Endpoint diagnostic",
  _subject: "Diagnostic",
  _template: "table",
  _captcha: "false",
});
const opts = {
  method: "POST",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  body,
};

for (const [label, url] of [
  ["HASH", `https://formsubmit.co/ajax/${ID}`],
  ["EMAIL", `https://formsubmit.co/ajax/${EMAIL}`],
]) {
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    console.log(`[${label}] ${res.status} → ${text.slice(0, 300)}`);
  } catch (e) {
    console.log(`[${label}] FAILED: ${e.message}`);
  }
}
