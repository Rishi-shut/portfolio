import puppeteer from "puppeteer-core";

const out = process.argv[2] || "genre-test";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3400));
await page.evaluate(() => {
  [...document.querySelectorAll(".navlinks button")]
    .find((b) => b.textContent.trim().toUpperCase() === "CONTACT")
    ?.click();
});
await new Promise((r) => setTimeout(r, 1500));

const active = () =>
  page.evaluate(() => document.querySelector(".genre-btn.active")?.textContent?.trim() || "none");

console.log("initial active:", await active());

await page.evaluate(() => {
  [...document.querySelectorAll(".genre-btn")]
    .find((b) => b.textContent.trim() === "Punk")
    ?.click();
});
await new Promise((r) => setTimeout(r, 900));
console.log("after Punk click:", await active());

await page.evaluate(() => {
  [...document.querySelectorAll(".genre-btn")]
    .find((b) => b.textContent.trim() === "Hindi")
    ?.click();
});
await new Promise((r) => setTimeout(r, 900));
console.log("after Hindi click:", await active());

const state = await page.evaluate(() => ({
  playing: !!document.querySelector(".vinyl.spin"),
  state: document.querySelector(".vinyl-state")?.textContent,
}));
console.log("vinyl:", JSON.stringify(state));

await page.evaluate(() => {
  document.querySelector(".t-vinyl")?.scrollIntoView({ block: "center" });
});
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${out}.png` });

console.log("errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
