# Daily Saints

A small mobile app that shows the saint (or saints) of the day, styled like a printed missal: warm paper, red rubrics, and EB Garamond type. You can browse any date, search saints by name, save favourites, and get a daily reminder.

![Ionic](https://img.shields.io/badge/Ionic-3880FF?logo=ionic&logoColor=white&style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white&style=for-the-badge)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?logo=capacitor&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![Android](https://img.shields.io/badge/Android-3DDC84?logo=android&logoColor=white&style=for-the-badge)

## What it does

- **Today**: the day's saint(s), with image, story, patronage, and a link to Wikipedia.
- **Calendar**: pick any date to jump to that day, or search a saint by name.
- **Favourites**: bookmark saints and find them later (saved on the phone).
- **More**: turn the daily reminder on/off and choose the time.

## Built with

- **Ionic + Angular**: the app framework and screens.
- **Capacitor**: wraps the web app into a native Android app and provides plugins for local notifications, storage (Preferences), and sharing.
- **TypeScript**: the app code.
- Saint data is a set of local JSON files (one per day), so the app works fully **offline**.

## The notification limitation (no Firebase)

The daily reminder is a **local notification**. It is scheduled and fired by the phone itself, with no server involved. This keeps the app simple and offline, but it has two honest limits:

1. **The reminder text is generic** ("Tap to meet today's saint") instead of naming the saint. A repeating alarm can only show the **same words every day**, and reliably showing a different saint name each day would need a server to send it. The name is always one tap away inside the app.

2. **Some phones may delay or block it.** Aggressive battery managers (Xiaomi/MIUI especially) can throttle local notifications unless the user enables Autostart and disables battery restrictions for the app.

**Doing it "properly" would need Firebase.** With Firebase Cloud Messaging, a small server could send a **push notification** each morning containing that day's saint name. Push notifications go through Google Play Services, which phones don't kill, so they arrive reliably with fresh text every day. That was left out on purpose, because it would make the app partly online and add a backend to maintain.

## Running it

```bash
npm install
ionic serve              # run in the browser (no native notifications)
```

Build and run on an Android device:

```bash
ionic build
npx cap sync
npx cap run android
```

> Note: the build uses **Java 21** (`export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64`).
