import puppeteer from "puppeteer-core";

const url = process.argv[2] || "http://localhost:5173";
const out = process.argv[3] || "shot.png";
const wait = Number(process.argv[4] || 4000);

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  args: ["--window-size=1440,900", "--hide-scrollbars"],
  defaultViewport: { width: 1440, height: 900 },
});

const page = await browser.newPage();
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));

await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
await new Promise((r) => setTimeout(r, wait));
await page.screenshot({ path: out });

console.log("errors:", errors.length ? errors.join("\n") : "none");
await browser.close();
