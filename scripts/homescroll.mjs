import puppeteer from "puppeteer-core";

const out = process.argv[2] || "scroll";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3600));
await page.screenshot({ path: `${out}-0.png` });
const stops = [1.15, 2.4, 3.6];
for (let i = 0; i < stops.length; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), stops[i] * 900);
  await new Promise((r) => setTimeout(r, 1500));
  await page.screenshot({ path: `${out}-${i + 1}.png` });
}
console.log("errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
