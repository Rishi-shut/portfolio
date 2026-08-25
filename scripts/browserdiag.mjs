import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });

const results = await page.evaluate(async () => {
  const body = JSON.stringify({
    name: "Browser Diagnostic",
    email: "test@example.com",
    message: "Endpoint check from browser context",
    _subject: "Diagnostic",
    _template: "table",
    _captcha: "false",
  });
  const out = [];
  for (const [label, url] of [
    ["HASH", "https://formsubmit.co/ajax/27d5f206cf5dce40279bcc60f3c80c24"],
    ["EMAIL", "https://formsubmit.co/ajax/mriganksingh7890@gmail.com"],
  ]) {
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body,
      });
      out.push(`[${label}] ${r.status} → ${(await r.text()).slice(0, 240)}`);
    } catch (e) {
      out.push(`[${label}] FAILED: ${e.message}`);
    }
  }
  return out;
});
console.log(results.join("\n"));
await browser.close();
