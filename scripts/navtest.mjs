import puppeteer from "puppeteer-core";

const out = process.argv[2] || "nav";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3500));
for (const l of ["WORK", "ABOUT", "CONTACT", "HOME"]) {
  await page.evaluate((t) => {
    [...document.querySelectorAll(".navlinks button")].find((b) => b.textContent.trim().toUpperCase() === t)?.click();
  }, l);
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: `${out}-${l.toLowerCase()}.png` });
}
console.log("errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
