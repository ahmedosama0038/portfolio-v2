# Ahmed Osama Portfolio

React 19 + Vite + TypeScript. Scroll animation is plain React, CSS and canvas (src/scroll.tsx). No extra runtime dependencies.

Requires Node 20.19+ or 22.12+.

    npm install
    npm run dev      # local preview
    npm run build    # static site in dist/

Edit content in `src/data.ts` (projects, stack, contact).
CV: `src/cv/`. Project images: `src/photos/`.
Respects prefers-reduced-motion.

Deploy on Vercel: Framework Preset = Vite, Build Command = `npm run build`, Output Directory = `dist`.

Photos: `src/photos/me-*.jpg`. Every public GitHub project is listed in `src/data.ts` (`repos`).
Contact form posts to the same Formcarry endpoint the old site used (`FORM_URL` in `src/App.tsx`).
