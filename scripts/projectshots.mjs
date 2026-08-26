import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";

mkdirSync("public/work", { recursive: true });

const shots = [
  ["https://credit-card-fraud-l06p.onrender.com/", "fraudguard"],
  ["https://pfs-wv9u.vercel.app/", "pulsepfs"],
  ["https://lumberjack-five.vercel.app/", "infinitechop"],
];

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1280, height: 800 },
});
const page = await browser.newPage();

for (const [url, name] of shots) {
  let ok = false;
  for (let attempt = 0; attempt < 2 && !ok; attempt++) {
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
      await new Promise((r) => setTimeout(r, 3500));
      await page.screenshot({ path: `public/work/${name}.jpg`, type: "jpeg", quality: 72 });
      ok = true;
      console.log("ok", name);
    } catch (e) {
      console.log("retry", name, e.message.slice(0, 70));
      await new Promise((r) => setTimeout(r, 6000));
    }
  }
  if (!ok) console.log("FAILED", name);
}

await browser.close();
