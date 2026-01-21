# 🛸 AAAG: Urban Air Mobility Portal — Technical Documentation
Alatau Advance Air Group Site
This documentation is designed for developers and technical contributors. It describes the architecture, file structure, and technical implementation of the **Alatau Advance Air Group (AAAG)** web portal.

This project is a high-performance, cinematic multi-page website built with the **Archer Design System**. It serves as the primary digital interface for the Alatau City UAM (Urban Air Mobility) infrastructure project, focusing on eVTOL (electric Vertical Take-Off and Landing) technology.

## 🛠 Technical Stack

* **Frontend:** Semantic HTML5, CSS3 (using CSS Variables for the Archer Dark theme).
* **Animation Engine:** * `GSAP 3.12.5` — Core animation logic.
* `ScrollTrigger` — Parallax and scrollytelling triggers.
* `Lenis` — Smooth inertia scrolling.


* **Icons:** FontAwesome 6.4.0.
* **Typography:** Montserrat & Open Sans via Google Fonts.

---

## 📂 Architecture & File Structure

### 1. `alatau.html` (Main Landing)

The main entry point featuring the core brand identity and interactive components.

* **Cinematic Hero:** Uses an optimized `<video>` background with an auto-play fallback script.
* **Scrollytelling Concept:** A sticky visual section where images swap based on the scroll position of text blocks (`#bg-safety`, `#bg-ecology`, `#bg-comfort`).
* **HUD Tech Specs:** An interactive grid using GSAP to animate numerical values (`data-target`) from 0 to their final spec.
* **Team Marquee:** A CSS/JS seamless loop displaying core members like Sergey Khegay and Alma Aliguzhinova.

### 2. `news.html` (Press Center)

A dynamic news aggregator with localization support.

* **Data Fetching:** Contains logic to fetch RSS via `rss2json` (Google News RSS fallback) and merges it with `corporateNews` and `STATIC_NEWS_DATA`.
* **Dynamic Rendering:** The `renderNews(lang)` function generates glassmorphic cards with staggered GSAP entry animations.

### 3. `roadmap.html` (Strategic Timeline)

An immersive full-screen experience detailing the project's phases (2025–2028).

* **Layout:** Uses high-resolution background imagery for each phase with centered/aligned content blocks.
* **Intersection Observer:** Implements a custom observer to trigger `.is-visible` classes for scroll-triggered fade-ins.

### 4. `search.html` (Internal Search Engine)

A client-side search interface.

* **Logic:** Uses `URLSearchParams` to extract queries and filters `MOCK_DATA` (available in RU, EN, KK).
* **UI:** Renders results in a dedicated `search-results-list` with specific tags for categories like "Technology" or "Roadmap".

---

## ⚙️ Key Technical Features

### 🌐 Multi-Language Support (i18n)

The site uses a data-attribute system (`data-i18n`).

* **Logic:** Managed in `assets/js/archer-animations.js` (referenced in all files).
* **Event Handling:** Dispatches a custom `languageChanged` event to re-render dynamic components like news and search results.

### 👁️ Accessibility (A11Y)

Integrated "Vision-Impaired" version (`#access-panel`).

* **Font Scaling:** Allows users to scale the UI by 1x, 1.15x, or 1.3x.
* **Aria Labels:** Comprehensive use of `aria-label` and `aria-hidden` for modals and interactive buttons.

### 🎨 Archer Design System (CSS)

The project utilizes a centralized styling approach:

* **Glassmorphism:** `.glass-card`, `.glass-grid`, and `.glass-result-item` provide the modern "blurred" aesthetic.
* **Layout:** Built on a responsive `.container` system with a mobile-first approach for the `#navbar-nav`.

---

## 🚀 Deployment Notes

1. **Assets:** Ensure `assets/css/archer-dark.css` and `assets/js/archer-animations.js` are present in the root directory.
2. **Video:** The hero video `bgvideo.mp4` should be compressed for web delivery to prevent LCP (Largest Contentful Paint) delays.
3. **Local Storage:** The site persists language and accessibility preferences using `localStorage` keys like `archer_lang`.
