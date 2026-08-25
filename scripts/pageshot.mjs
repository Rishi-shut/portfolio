import puppeteer from "puppeteer-core";

const target = process.argv[2] || "CONTACT";
const out = process.argv[3] || "page.png";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3200));
await page.evaluate((t) => {
  [...document.querySelectorAll(".navlinks button")]
    .find((b) => b.textContent.trim().toUpperCase() === t)
    ?.click();
}, target);
await new Promise((r) => setTimeout(r, 1600));
await page.screenshot({ path: out });
console.log("errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
