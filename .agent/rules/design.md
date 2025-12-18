---
trigger: always_on
---

# Design Implementation Rules
- Always prioritize Tailwind 4.0 utility classes over custom CSS.
- Ensure all images from the design are implemented using `next/image` with proper `alt` tags.
- Maintain the 'Kindora' theme's responsive breakpoints (sm: 640px, md: 768px, lg: 1024px).
- When implementing menus from a design, do not hardcode links; pull them from `src/config/menu.json`.