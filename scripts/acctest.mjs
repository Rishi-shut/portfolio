import puppeteer from "puppeteer-core";

const out = process.argv[2] || "acc";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3400));
await page.evaluate(() => {
  [...document.querySelectorAll(".navlinks button")]
    .find((b) => b.textContent.trim().toUpperCase() === "WORK")
    ?.click();
});
await new Promise((r) => setTimeout(r, 1500));
await page.evaluate(() => {
  [...document.querySelectorAll(".work-row")][0]?.click();
});
await new Promise((r) => setTimeout(r, 1400));
await page.screenshot({ path: `${out}.png` });
await browser.close();
console.log("done");
