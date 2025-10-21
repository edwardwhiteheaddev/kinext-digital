# Kinext Digital

Welcome to the public home for Kinext Digital — a startup studio crafting next-generation web experiences for forward-thinking companies. This repository powers our marketing site and future customer hub. The project is actively evolving alongside client work, so expect rapid iteration, occasional rough edges, and plenty of opportunities to shape what comes next.

## Vision at a Glance
- **Launch a premium digital presence** that reflects Kinext Digital's product strategy, engineering, and design capabilities.
- **Showcase in-flight initiatives** with transparent roadmaps, changelogs, and thought leadership content.
- **Build a scalable foundation** for future lead capture, client onboarding, and account analytics.

> 🚧 **Work in progress:** Core pages are being scaffolded while we balance client deliverables. Follow the roadmap below for the latest status.

## Tech Stack
- **Framework:** [Next.js 15](https://nextjs.org/) with the App Router, React 19, and TypeScript.
- **Styling:** Tailwind CSS, CSS variables, and utility-first theming.
- **Component System:** Storybook-driven UI, Radix primitives, and design tokens managed via `class-variance-authority` and `tailwind-merge`.
- **Auth & Data:** NextAuth, MongoDB, Firebase admin, and Zustand for lightweight client state.
- **Tooling:** ESLint 9, Jest + Testing Library, Turbopack dev server, and Storybook 8.

## Quick Start
1. Install dependencies
   ```bash
   npm install
   ```
2. Launch the development server
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).
3. Explore UI components in isolation (optional)
   ```bash
   npm run storybook
   ```
4. Keep quality high
   ```bash
   npm run lint
   npm test            # if you add or maintain tests
   ```

## Project Structure Highlights
- `src/` — Application code organized by feature-first folders.
- `components.json` — Shadcn-style generator configuration for consistent UI scaffolding.
- `scripts/` — Setup utilities for initializing data structures and local services.
- `public/` — Static assets, icons, and meta imagery.

## Roadmap
- [ ] Complete hero, value proposition, and services sections.
- [ ] Publish reusable motion-ready component library via Storybook.
- [ ] Integrate CMS-driven case studies and blog content.
- [ ] Implement lead capture and CRM handoff workflow.
- [ ] Prepare deployment pipeline and observability dashboards.

We track roadmap items using GitHub Projects and weekly async standups. If you're exploring collaboration, feel free to open an issue to start the conversation.

## Contributing
While the project is primarily maintained by the Kinext Digital core team, we welcome ideas, bug reports, and design critiques:
1. Fork the repository and create a feature branch using a descriptive name.
2. Commit with clear, action-oriented messages.
3. Open a pull request that outlines the change, screenshots (if applicable), and testing notes.

## Community & Contact
- **Website:** https://kinext.digital *(coming soon)*
- **Email:** hello@kinext.digital
- **Updates:** Follow our launch journey on LinkedIn and upcoming newsletter.

Thank you for visiting! We’re excited to share progress as we bring the Kinext Digital experience to life.
