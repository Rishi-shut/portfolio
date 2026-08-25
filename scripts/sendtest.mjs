import puppeteer from "puppeteer-core";

const out = process.argv[2] || "send-test.png";
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: "new",
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
const errors = [];
const responses = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("response", (r) => {
  if (r.url().includes("formsubmit")) responses.push(`${r.status()} ${r.url()}`);
});

await page.goto("http://localhost:5173", { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 3200));
await page.evaluate(() => {
  [...document.querySelectorAll(".navlinks button")]
    .find((b) => b.textContent.trim().toUpperCase() === "CONTACT")
    ?.click();
});
await new Promise((r) => setTimeout(r, 1500));

await page.type(".ffield input[type='text']", "Test Visitor");
await page.type(".ffield input[type='email']", "test@example.com");
await page.type("textarea.finput", "Hello! This is a delivery test from my portfolio contact form.");
await page.screenshot({ path: out.replace(".png", "-filled.png") });
await page.click(".fsubmit");
await new Promise((r) => setTimeout(r, 6000));
await page.screenshot({ path: out });

console.log("errors:", errors.length ? errors.join("\n") : "none");
console.log("formsubmit responses:", responses.join(" | ") || "none");
await browser.close();
