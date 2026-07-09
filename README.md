# Fitness OS

A premium, mobile-first PWA for a personal calisthenics cut — built to feel like a personal *Fitness OS*, not just a workout log. Inspired by Apple Fitness, Hevy, Strong and Nike Training Club.

Stack: **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · shadcn/ui-style components · Framer Motion · LocalStorage · PWA (offline)**.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000** and — for the real experience — enable your browser's mobile device toolbar (iPhone size).

Production build / preview:

```bash
npm run build
npm run start
```

The app works fully offline after the first load and stores **all** data in your browser's LocalStorage (nothing is sent anywhere). It starts as a clean slate — each profile enters their own name, body stats and daily data. Wipe everything anytime from **Settings → Reset all data**.

---

## 2. Install it on your phone as a PWA

The service worker only registers in a production build, so run `npm run build && npm run start` first (or deploy — see below).

**Easiest way to test on your phone:** deploy to Vercel (free) so you get an HTTPS URL — PWA install requires HTTPS.

```bash
npm i -g vercel
vercel
```

Then on your phone:

### iPhone (Safari)
1. Open the site in **Safari**.
2. Tap the **Share** button.
3. Tap **Add to Home Screen** → **Add**.
4. Launch it from your home screen — it opens fullscreen, no browser chrome, with the blue app icon.

### Android (Chrome)
1. Open the site in **Chrome**.
2. Tap the **⋮** menu → **Install app** / **Add to Home screen**.
3. Confirm — it installs like a native app.

> Testing on your local network without deploying? Run `npm run start`, find your PC's LAN IP, and visit `http://<your-ip>:3000` from the phone. iOS "Add to Home Screen" works over HTTP on the same network, but the service worker (offline) needs HTTPS or `localhost`, so deploying is recommended for the full offline PWA behavior.

---

## 3. Files created

```
app/
  layout.tsx              Root layout, fonts, PWA metadata, providers, seed script
  globals.css             Design tokens (RGB channel vars), light/dark themes, utilities
  page.tsx                TODAY screen
  workout/page.tsx        WORKOUT — the 5-day split list
  workout/[day]/page.tsx  Workout detail (sets, cues, timer, video)
  nutrition/page.tsx      NUTRITION — 2-meal cutting plan + trackers
  progress/page.tsx       PROGRESS — weight chart, streak, stats
  settings/page.tsx       SETTINGS — theme, body stats, targets, reset

components/
  bottom-nav.tsx          Floating 5-tab bottom navigation (animated active pill)
  page-container.tsx      Mobile-first centered column w/ safe-area padding
  page-header.tsx         Reusable screen header
  progress-ring.tsx       Animated Apple-Fitness-style SVG ring
  tracker-card.tsx        Reusable +/- tracker card (water, steps, sleep)
  exercise-card.tsx       Exercise card: thumbnail, cues, set checkboxes, rest hint
  video-modal.tsx         Fullscreen YouTube tutorial sheet
  rest-timer.tsx          App-wide fullscreen rest timer (60/90/120s) + provider
  weight-chart.tsx        Minimal animated SVG line chart
  theme-provider.tsx      next-themes wrapper (light/dark)
  pwa-register.tsx        Registers the service worker (production only)
  reset-script.tsx        One-time clean-slate wipe on first load
  ui/                     shadcn-style primitives: button, card, input, switch, progress-bar

lib/
  data.ts                 The 5-day program + weekend + nutrition plan (edit videos here)
  storage.ts              Typed LocalStorage hooks (settings, daily log, weights, sessions)
  utils.ts                cn(), date + math helpers

public/
  manifest.json           PWA manifest
  sw.js                   Service worker (stale-while-revalidate, offline shell)
  icons/                  App icons (192/512/maskable/apple-touch)

next.config.mjs · tailwind.config.ts · postcss.config.mjs · tsconfig.json · package.json
```

### Swapping in real exercise videos
Exercises are matched to YouTube tutorials **by name** via the `exerciseVideos` map in `lib/data.ts`. Add or edit an entry (`"Exercise Name": { videoUrl, videoId }`) and every day that uses that exercise picks it up — the derived `video` object is attached automatically by `withVideos()` and plays **inline** in the fullscreen modal. Names are matched case-insensitively.

Any exercise **not** in the map falls back to a YouTube **search** instead of a wrong clip: the card shows a branded tile and the modal opens results via an "Open on YouTube" button. For the Partner profile that search is `Eva Pilates <exercise>` (see `partnerFallbackQuery`), so **Eva's Pilates** videos always surface. To pin a specific Eva clip inline, just add that move to the `exerciseVideos` map with its `videoUrl`.

---

## 4. What to improve next

- **Real videos & exercise swaps** — fill out the `exerciseVideos` map and let users substitute exercises.
- **Set-level logging** — record reps/weight/RPE per set and auto-suggest progressions week to week.
- **History & calendar** — a heatmap of trained days and per-workout history detail.
- **Notifications** — rest-timer completion + daily reminders via the Web Push API.
- **Cloud sync / backup** — optional account (or export/import JSON) so data survives a cleared browser.
- **Charts** — bodyweight moving average line, volume-per-week, and streak calendar with a real chart lib.
- **Barcode / macro search** for faster nutrition logging beyond the two-meal template.
- **Onboarding** — a first-run flow to set name, stats and targets instead of seeded demo data.
- **Haptics & sound polish** on iOS, and a proper install prompt (`beforeinstallprompt`) on Android.
```
