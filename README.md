# 🚀 Currency Converter Frontend

This is the frontend repository for a multi-currency converter application, built using **Next.js 16 (App Router)**, **React 19**, and **Tailwind CSS 4**.

The application focuses on a clean, dynamic, and type-safe approach to handling financial data conversions with a mobile-first PWA experience.

---

## ✨ Key Features

* **Real-time Conversion:** Instantly converts all currency lines based on a single base currency (EUR). Updating any line recalculates the entire list based on live exchange rates.
* **Smart API & Filtering Strategy:**
  * **Primary API:** Fetches high-precision exchange rates and currency names from the **Fawazahmed0 API**.
  * **ISO FIAT Filtering:** To ensure a clean financial tool, the app automatically filters out cryptocurrencies (coins) and obsolete tokens, displaying only official **ISO 4217 Fiat currencies**.
  * **Caching:** Data is cached in **IndexedDB** for 24 hours to ensure instant availability, offline persistence (especially on iOS PWAs), and minimal API overhead.
* **Interactive List Management:**
  * **Drag & Drop Reordering:** Powered by `@dnd-kit`, users can reorder their currency list with intuitive touch gestures (long-press) or mouse drags.
  * **Pinned Base:** The EUR base line remains pinned at the top for consistent reference.
  * **Dynamic Lines:** Easily add or remove currencies. The UI prevents the removal of the last remaining currency or the base line.
* **Enhanced UX & UI:**
  * **Reference Rates:** Displays a discreet "1€ = X.XXXX" conversion rate inside each currency block for quick reference.
  * **Flag Integration:** Uses the `flag-icons` library for instant visual identification of currencies.
  * **Refined Inputs:** Features right-aligned numeric inputs, "Clear" (X) buttons, and responsive layouts for mobile use.
* **PWA Ready:** Configured with `next-pwa` for installation on iOS and Android, offering a native app-like experience with offline data support.
* **Dark Mode Support:** Full dark/light mode synchronization via React Context and Tailwind CSS 4.

---

## ⚙️ Technologies

* **Framework:** Next.js 16 (App Router, Static HTML Export)
* **UI Library:** React 19
* **Styling:** Tailwind CSS 4
* **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`
* **Language:** TypeScript
* **State Management:** React Context API
* **Persistence:** IndexedDB (`idb`)
* **Data Sources:** Fawazahmed0 Currency API (with Frankfurter API fallback support)
* **Icons:** `lucide-react` & `flag-icons`
* **Hosting Target:** Cloudflare Pages

---

## 🛠️ Logic & Architecture

### ISO Filtering
The application maintains a whitelist of valid ISO 4217 codes. During the fetch cycle, the incoming API data is compared against this `Set` to prevent the UI from being cluttered with thousands of crypto-tokens (like SUI, BTC, or PEPE).

### Mobile Drag & Drop
To maintain compatibility with PWA scrolling, the Drag & Drop functionality utilizes a **Touch Sensor** with a 250ms activation delay. This prevents accidental drags while scrolling through the list on mobile devices.

### IndexedDB Storage
Exchange rates and custom currency lists are stored using IndexedDB via `idb` (`lib/currencyDB.ts`). This avoids WebKit's aggressive `localStorage` eviction on iOS home-screen PWAs and keeps user order and values safe across app restarts.

---

## ☁️ Deployment to Cloudflare Pages

The application uses Next.js static export (`output: 'export'`), generating a static distribution with PWA assets into `frontend/out`.

### Method 1: Git Integration (Recommended)

1. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Compute (Workers & Pages)** > **Pages** > **Connect to Git**.
2. Select your repository.
3. Configure build settings:
   * **Framework preset:** `Next.js (Static HTML Export)` or `None`
   * **Root directory:** `frontend`
   * **Build command:** `npm run build`
   * **Build output directory:** `out`
4. Environment variables:
   * `NODE_VERSION`: `24` (also specified in `.node-version`)
5. Click **Save and Deploy**.

*(Note: If you choose to keep the root directory set to `/` instead of `frontend`, configure the build command as `cd frontend && npm install && npm run build` and the output directory as `frontend/out`.)*

### Method 2: Direct Upload via Wrangler CLI

You can also build and deploy directly using Wrangler:

```bash
cd frontend
npm run build
npx wrangler pages deploy out --project-name=currency-converter
```

### Static Headers & PWA Caching

Custom headers are defined in `frontend/public/_headers` and automatically exported to `out/_headers`. Cloudflare Pages applies them directly:
* Disables caching for `sw.js` and Workbox scripts so PWA service worker updates are picked up immediately.
* Sets long-term immutable caching (`Cache-Control: max-age=31536000, immutable`) for static assets under `/_next/static/`.

---

## ✅ Quality Checks & Development

### Development Server

```bash
cd frontend
npm run dev
```

### Type Checking & Linting

Before committing, validate types and linting:

```bash
cd frontend
npx tsc --noEmit
npm run lint
```

### Production Build

```bash
cd frontend
npm run build
```