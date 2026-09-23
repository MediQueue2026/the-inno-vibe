# TheInnoVibe

A responsive company website presenting TheInnoVibe's services, with its products MediQueue, sahakara and Virtual Chem Lab on the Domains & systems page. Built with React, Vite, and a Three.js illustration.

## Preview locally

Requires Node.js 20.19 or later.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Publish

Run `npm run build` and upload the generated `dist/` folder to any static web host, such as GitHub Pages, Netlify, or Cloudflare Pages. On Netlify or Cloudflare Pages, set the build command to `npm run build` and the publish directory to `dist`. The site uses client-side routes, so the host must serve `index.html` for unknown paths: `public/_redirects` handles this on Netlify and Cloudflare Pages. On GitHub Pages, copy `dist/index.html` to `dist/404.html` after building.

## Design and motion

- `src/styles/styles.css` contains the base layout; `src/styles/experience.css` contains the white-and-blue visual design (colour tokens are at the top of `styles.css`), responsive refinements, and CSS animations.
- `src/scene/createIdeaScene.js` renders a procedural 3D light bulb with a glass shell, filament, metallic base, and floating geometric shapes. Pointer movement gently turns the bulb on devices with a mouse.
- Scroll entrances reveal each section once. The Pause motion button stops ambient animation and the 3D animation loop. Reduced-motion preferences start the experience paused.
- The renderer caps pixel density and suspends animation outside the viewport or while the tab is hidden.
- The home hero shows only the 3D bulb. If WebGL is unavailable, that area stays empty.
- Three.js is installed from npm and lazy-loaded in its own chunk, so the rest of the page renders first.

## Content

- Pages are in `src/pages/`: Home (`/`), About us (`/about`), Domains & systems (`/domains`) and Our team (`/team`). Shared sections are React components in `src/components/`.
- Project and domain details are in `src/projects.js`; services are in `src/services.js`. Team members are in `src/team.js` (placeholders until real profiles are added).
- Original supplied branding is in `src/assets/`: `theinnovibe-icon.png` (round logo in the header and footer) and `theinnovibe-brand-lockup.jpg` (bulb with wordmark, shown in the About us, Domains & systems and Our team heroes). The social share image is in `public/`.
- The home page hero uses only the interactive 3D bulb.
- Product previews are explicitly labeled interface concepts, not actual product screenshots.
- Contact links open an email to theinnovibe@gmail.com.
- Products appear only on the Domains & systems page, not the home page. Each product's `status` in `src/projects.js` controls its label (MediQueue: In development; sahakara and Virtual Chem Lab: Requirement analysis).
- Fonts are loaded from Google Fonts with local sans-serif fallbacks.

