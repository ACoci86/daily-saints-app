<p align="center">
  <img src="assets/logo.png" alt="Daily Saints" width="200" />
</p>

<h1 align="center">Daily Saints</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Ionic-3880FF?logo=ionic&logoColor=white&style=for-the-badge" alt="Ionic" />
  <img src="https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white&style=for-the-badge" alt="Angular" />
  <img src="https://img.shields.io/badge/Capacitor-119EFF?logo=capacitor&logoColor=white&style=for-the-badge" alt="Capacitor" />
  <img src="https://img.shields.io/badge/OneSignal-E54B4D?logo=onesignal&logoColor=white&style=for-the-badge" alt="OneSignal" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white&style=for-the-badge" alt="Android" />
</p>

A small mobile app that shows the saint (or saints) of the day, styled like a printed missal: warm paper, red rubrics, and EB Garamond type. You can browse any date, search saints by name, save favourites, and get a daily notification.

## What it does

- **Today**: the day's saint(s), with image, story, patronage, and a link to Wikipedia.
- **Calendar**: pick any date to jump to that day, or search a saint by name.
- **Favourites**: bookmark saints and find them later (saved on the phone).
- **Daily notification**: a push each morning at 8 AM local time, naming the day's saint.

## Built with

- **Ionic + Angular**: the app framework and screens.
- **Capacitor**: wraps the web app into a native Android app, with plugins for push notifications, storage (Preferences), and sharing.
- **OneSignal + Firebase Cloud Messaging**: deliver the daily push notification.
- **GitHub Actions**: a free scheduled job that sends the day's saint each morning.
- **TypeScript**: the app code.
- Saint data is a set of local JSON files (one per day), so browsing works fully **offline** (only the daily push needs internet).

## How the daily notification works

Each morning the app delivers a **push notification** naming the day's saint, sent at **8 AM in each user's local timezone**. It works like this:

1. A **GitHub Actions** job runs once a day (free, no server to host).
2. It looks up the day's saint from the same JSON data the app uses.
3. It calls **OneSignal**, which delivers the push through **Firebase Cloud Messaging**.

Because push notifications travel through Google Play Services, they arrive reliably even on phones with aggressive battery managers (like Xiaomi/MIUI), where on-device reminders often get blocked.

The sender is [`scripts/send-daily-saint.mjs`](scripts/send-daily-saint.mjs), scheduled by [`.github/workflows/daily-saint.yml`](.github/workflows/daily-saint.yml). It reads two GitHub repository secrets, `ONESIGNAL_APP_ID` and `ONESIGNAL_API_KEY`, which are never stored in the code.

Trade-offs: the daily push needs **internet** to arrive, and the time is the same for everyone (8 AM local), not individually chosen.

## Running it

```bash
npm install
ionic serve              # run in the browser (no push notifications)
```

Build and run on an Android device:

```bash
ionic build
npx cap sync
npx cap run android
```

> Note: the build uses **Java 21** (`export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64`).
