---
trigger: always_on
---

# Kindora Theme Customization Rules

## Tech Stack Context
- **Framework:** Next.js 15.5+ (App Router)
- **React:** v19.2.0
- **Styling:** Tailwind CSS 4.1+ (Note: Uses the new @tailwindcss/postcss approach)
- **Animations:** AOS (Animate On Scroll)
- **Content:** Markdown/MDX using `next-mdx-remote` and `gray-matter`

## Project Structure Guidelines
- **UI Layouts:** Located in `src/layouts`.
- **Global Components:** Located in `src/layouts/components`.
- **Partials (Hero, Header, Footer):** Located in `src/layouts/partials`.
- **Data/Config:** Site configuration is in `src/config/config.json` and navigation links are in `src/config/menu.json`.

## Customization Rules

### 1. Navigation & Menu
- **Logic:** Do not hardcode menu items in `src/layouts/partials/Header.tsx`.
- **Process:** Always refer to `src/config/menu.json`. If a new menu item is needed, update the JSON first, then ensure the Header component renders it dynamically.

### 2. Hero Section
- **Location:** Edit `src/layouts/partials/Hero.tsx` (or the specific hero component in `src/layouts/components`).
- **Styling:** Use Tailwind 4.x utility classes. Ensure any background images use the `next/image` component for optimization.
- **Animations:** Maintain `data-aos` attributes for entrance animations.

### 3. Footer
- **Location:** Update `src/layouts/partials/Footer.tsx`.
- **Data:** Pull social links and copyright text from `src/config/config.json`.

### 4. Code Standards
- **TypeScript:** Use strict typing. Define Interfaces for all component props.
- **Components:** Prefer functional components with `const` and arrow functions.
- **Tailwind:** Prioritize standard utility classes. Avoid custom CSS in `globals.css` unless necessary for third-party libraries like Swiper.

### 5. Deployment & Build
- **Images:** Always use `sharp` (included in devDependencies) for image optimization during `next build`.