// scripts/send-daily-saint.mjs
// Sends today's saint as a OneSignal push, delivered at 8 AM in each user's timezone.
//
// Run it by hand for a test (set the two env vars for one run):
//   ONESIGNAL_APP_ID=xxx ONESIGNAL_API_KEY=yyy node scripts/send-daily-saint.mjs
//
// In GitHub Actions the two env vars come from repo Secrets.

import { readFile } from "node:fs/promises";

// 1. Secrets - never hard-coded. Provided by GitHub Secrets (or your shell when testing).
const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_API_KEY;

if (!APP_ID || !API_KEY) {
  console.error("Missing ONESIGNAL_APP_ID or ONESIGNAL_API_KEY");
  process.exit(1);
}

// 2. Today's date as "MM-DD" - matches the saint data file names.
const now = new Date();
const mm = String(now.getMonth() + 1).padStart(2, "0");
const dd = String(now.getDate()).padStart(2, "0");
const today = `${mm}-${dd}`;

// 3. Read today's saint file from the app's own data.
let day;
try {
  const raw = await readFile(`src/assets/saints/${today}.json`, "utf8");
  day = JSON.parse(raw);
} catch {
  console.error(`No saint data for ${today} — nothing sent.`);
  process.exit(1);
}

const saintName = day.saints.map((s) => s.name).join(", ");
console.log(`Today (${today}): ${saintName}`);

// 4. Send the push to OneSignal.
const body = {
  app_id: APP_ID,
  included_segments: ["Total Subscriptions"], // everyone subscribed
  headings: { en: "Saint of the Day" },
  contents: { en: saintName },
  delayed_option: "timezone", // deliver per-user...
  delivery_time_of_day: "8:00AM", // ...at 8 AM their local time
};

const res = await fetch("https://api.onesignal.com/notifications", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Key ${API_KEY}`,
  },
  body: JSON.stringify(body),
});

const result = await res.json();

if (!res.ok) {
  console.error("OneSignal error:", result);
  process.exit(1);
}

console.log("Sent! OneSignal notification id:", result.id);
