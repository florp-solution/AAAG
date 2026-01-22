# AI Thought Partner & Developer Instructions: AAAG UAM Portal

## 1. Project Context
* **Company:** Alatau Advance Air Group (AAAG).
* **Industry:** Urban Air Mobility (UAM), eVTOL infrastructure development in Kazakhstan.
* **Core Goal:** Create a high-end, official corporate portal that matches the visual quality of Archer.com and Joby Aviation, but follows AAAG brand standards.

## 2. Technical Architecture & Stack
* **Files:** `alatau.html` (Landing), `news.html` (Press Center), `roadmap.html` (Strategy), `search.html` (Search System).
* **Frameworks:** Vanilla HTML5/CSS3, GSAP 3.12.5 (Animations), ScrollTrigger (Parallax), Lenis (Smooth Scroll).
* **System Logic:** Unified `archer-animations.js` for i18n (RU/EN/KK), accessibility (A11Y), and GSAP initializations.

## 3. Brand Identity & Visual Constraints (Crucial)
* **Primary Colors:** Shift away from pure black (#000) as the primary background. Use a "Light Tech" palette:
    * **Background:** Off-white (#F8F9FA) or very light grey-blue.
    * **Accent:** AAAG Corporate Blue (from logo).
* **Typography:** * **Titles:** Montserrat (Bold/SemiBold).
    * **Body:** Open Sans or Calibri (as per Brandbook).
* **Design Inspiration:** Archer.com (Cinematic UI, high information density).

## 4. Addressing Whitespace & Layout Density
To avoid "empty" white space, use the following techniques inspired by the provided Framer templates:
* **Background Grids:** Implement subtle radial-dot or line grids (e.g., 40px grid) to fill empty areas without cluttering.
* **HUD Elements:** Use technical "decoders" (coordinates, small labels, micro-lines) in the corners of sections.
* **Layering:** Add large, semi-transparent background typography (e.g., "UAM 2028") behind main content blocks.
* **Component Structure:** Follow the "Videoshoot" and "Loginord" templates for clean but dense forms and presentation blocks.

## 5. Coding Standards for Agent
* **Localization:** Every new text string must have a `data-i18n` attribute and corresponding entry in the translation object within `archer-animations.js`.
* **GSAP Management:** Use `gsap.context()` for clean-up and ensure all ScrollTrigger instances are properly refreshed.
* **A11Y:** Ensure high contrast for text and `aria-label` for all interactive elements.
* **Responsiveness:** Use the `.container` class and CSS Variables for consistent spacing.

## 6. Specific Functional Tasks
* **News System:** Maintain the merging of `STATIC_NEWS_DATA` and corporate news arrays in `news.html`.
* **Roadmap:** The interactive timeline in `roadmap.html` must remain immersive with background image transitions.
* **Search:** Ensure `performSearch()` in `search.html` filters correctly across all supported languages.

## 7. Prohibited Practices
* Do NOT use pure black (#000) as a main section background.
* Do NOT create broken links (`#`); always link to existing IDs or pages.
* Do NOT use standard browser scrollbars; keep Lenis integration smooth.