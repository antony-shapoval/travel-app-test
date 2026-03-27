# Travel App

A client-side tour search application.

**Live demo:** https://travel-app-test-mu.vercel.app/

## Getting Started

**Requirements:** Node.js 18+, npm 9+

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

---

## About

Search for tours by destination (country, city, or hotel) and browse results as cards sorted by price.

### Architecture

The project follows a 4-layer architecture:

```
src/
├── models/          # TypeScript types and selectors (buildTours)
├── services/        # Business logic: polling, cache, geo
├── hooks/           # Thin React wrappers over services
└── components/
    ├── primitives/  # Input, Button, Popover
    ├── composed/    # Combobox = Popover + Input
    └── features/    # SearchForm, TourCard, TourList
```

### Stack

- React 19, TypeScript
- [@floating-ui/react](https://floating-ui.com/) — Popover positioning
- CSS Modules — scoped styles, no UI libraries
- Jest + Testing Library — 21 tests
