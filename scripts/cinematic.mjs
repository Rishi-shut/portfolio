import puppeteer from "puppeteer-core";

const out = process.argv[2] || "cin";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));

await page.goto("http://localhost:5173", { waitUntil: "domcontentloaded" });
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: `${out}-pre.png` });

await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3600));
await page.screenshot({ path: `${out}-hero.png` });

await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.45));
await new Promise((r) => setTimeout(r, 1300));
await page.screenshot({ path: `${out}-zoom.png` });

const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
await page.evaluate((y) => window.scrollTo(0, y), max * 0.38);
await new Promise((r) => setTimeout(r, 1400));
await page.screenshot({ path: `${out}-flyby.png` });

console.log("errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
