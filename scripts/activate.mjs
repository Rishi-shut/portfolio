import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
});
const page = await browser.newPage();
await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });

const res = await page.evaluate(async () => {
  const r = await fetch("https://formsubmit.co/ajax/mriganksingh7890@gmail.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: "Activation Request",
      email: "mriganksingh7890@gmail.com",
      message: "Requesting a fresh activation email",
      _captcha: "false",
    }),
  });
  return `${r.status} ${await r.text()}`;
});
console.log(res);
await browser.close();
