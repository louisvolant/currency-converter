# 🚀 Currency Converter Frontend

This is the frontend repository for a multi-currency converter application, built using **Next.js (App Router)** and **TypeScript**.

The application focuses on a clean, dynamic, and type-safe approach to handling financial data conversions.

---

## ✨ Key Features

* **Real-time Conversion:** Converts currency lines based on a single base currency (EUR by default). Changing the base value instantly updates all other lines based on current exchange rates.
* **API & Caching Strategy:**
    * Exchange rates are fetched from the **Frankfurter API** (`/v1/latest`).
    * Data is cached locally using **LocalStorage** for 24 hours to ensure immediate data availability, fast performance, and reduced API calls.
* **Dynamic Line Management:** Users can dynamically **add** and **remove** currency lines, giving full control over the displayed conversions. (The base currency line cannot be removed).
* **Enhanced Currency Selector (UX):**
    * Replaces the standard HTML `<select>` with a custom, dynamic dropdown menu.
    * Integrates the **`flag-icons`** library for visual identification of currencies via country flags, alongside their ISO code (e.g., USD) and full name (e.g., US Dollar).
* **PWA Ready:** Configured with `next-pwa` for progressive web application features, allowing the app to be installed and used offline (when using cached data).
* **Accessibility:** Includes `text-right` alignment for input values for improved number readability.
* **Dark Mode Support:** Basic structure implemented via React Context and Tailwind CSS class toggling.

---

## ⚙️ Technologies

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **External Data:** Frankfurter API
* **Dependencies:** `flag-icons`, `next-pwa`, `lucide-react`