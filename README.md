# ShutterMats — Frontend

React frontend for **ShutterMats**, a booking platform for a combat-sports (BJJ / grappling) event photographer. Athletes browse upcoming tournaments and request photo coverage through a public form; the photographer manages requests and the event calendar from a protected admin panel.

Live companion repo: [shuttermats-backend](https://github.com/AidaG91/shuttermats-backend)

## Overview

The public side is a marketing-style landing page plus an event catalog and a multi-step coverage-request form — no athlete account is required. The admin side is a protected dashboard (JWT, stored client-side) where the photographer reviews and updates coverage requests and runs full CRUD on events, including cover image uploads.

## Tech Stack

- React 19 + React Router 8
- Vite 8 (rolldown-vite)
- Sass with CSS Modules (`*.module.scss`)
- Vitest + Testing Library for unit/integration tests
- ESLint
- Deployed to GitHub Pages via GitHub Actions

## Key Features

- Dark, high-contrast, photography-led landing page (hero, "how it works", recent galleries, final CTA)
- Public, paginated events page with filtering
- Multi-section coverage request form (athlete info, championship, category, location, coverage preferences, billing, terms confirmation) with an on-screen confirmation summary right after submitting
- Static legal pages rendered from Markdown (privacy policy, coverage terms, image usage terms)
- Admin login with JWT stored in `localStorage` and a protected route wrapper (`AdminProtectedRoute`) guarding `/admin/*`
- Admin dashboard: paginated, filterable coverage-request table, request detail view with status updates
- Admin events CRUD with image upload and a confirmation modal on delete
- Reusable form primitives (`Input`, `Select`, `Textarea`, `Button`) and a `StatusBadge` component for request states

## Project Structure

Organized by feature (screaming architecture) rather than by technical layer, so everything about a business capability lives together:

```
src/
├── features/
│   ├── auth/               # Admin login, route guard (AdminProtectedRoute), authService
│   ├── events/              # Public + admin event pages, EventCard/EventForm, hooks, services
│   └── coverage-requests/   # Request form, request detail, admin request views, StatusBadge, hooks, services
├── pages/          # Non-domain routes: landing page (+ its marketing sections), legal docs, 404
├── shared/         # Reusable UI kit (Button, Input, Select, Textarea, FormField, ConfirmModal, AdminPagination,
│                   #   AdminSidebar), layout shells (AppLayout/AdminLayout, Header, Footer), httpClient,
│                   #   cross-cutting hooks/utils (useAsync, url, markdown)
├── routes/         # Router config (router.jsx)
├── styles/         # Global Sass (variables, mixins, reset)
├── assets/         # Logos and legal Markdown content
└── test/           # Vitest + Testing Library tests, mirroring the features/shared structure
```

Admin views live inside the feature they manage (e.g. `AdminEventsPage` under `features/events/`) rather than a separate admin folder, since admin is a permission, not a business capability. New domains (galleries, messaging, athlete accounts) get their own `features/` folder when that work starts.

## Getting Started

### Prerequisites

- Node.js 22
- The [backend API](https://github.com/AidaG91/shuttermats-backend) running locally (or any reachable instance)

### 1. Install dependencies

```
npm install
```

### 2. Configure the API URL

```
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Run the development server

```
npm run dev
```

### Other scripts

```
npm run build      # production build
npm run preview     # preview the production build locally
npm run lint         # ESLint
npm run test          # run tests once
npm run test:watch    # run tests in watch mode
```

## Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/events` | Public | Events list |
| `/events/:eventId/request` | Public | Coverage request form |
| `/requests/:id` | Public | Request detail / confirmation |
| `/legal/:slug` | Public | Legal documents |
| `/admin/login` | Public | Admin login |
| `/admin` | Admin | Dashboard (coverage requests) |
| `/admin/requests/:id` | Admin | Request detail, update status |
| `/admin/events` | Admin | Events list (CRUD) |
| `/admin/events/new` / `/admin/events/:id/edit` | Admin | Event form |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app and publishes `dist/` to GitHub Pages. The Vite `base` is set to `/shuttermats-frontend/` in `vite.config.js` to match the Pages subpath — update it if the deployment target changes.

## Roadmap

- Payment step in the coverage request flow
- Email notifications on request status changes
