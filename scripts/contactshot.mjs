import puppeteer from "puppeteer-core";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3200));
await page.evaluate(() => [...document.querySelectorAll(".navlinks button")].find((b) => b.textContent.trim().toUpperCase() === "CONTACT")?.click());
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: process.argv[2] });
await browser.close();
console.log("done");
