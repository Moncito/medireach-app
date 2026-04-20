# MediReach

**AI-powered healthcare companion -- accessible, offline-ready, and always available.**

MediReach is a Progressive Web Application that combines Google Gemini AI with a curated medical knowledge base to deliver symptom assessment, first aid guidance, medicine information, and nearby facility discovery. It works offline, runs on any device with a browser, and requires no installation.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Offline and PWA](#offline-and-pwa)
- [Firestore Security Rules](#firestore-security-rules)
- [Rate Limiting](#rate-limiting)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [License](#license)

---

## Features

### Symptom Checker

AI-driven symptom triage with a two-layer analysis system. The first layer performs instant, rule-based emergency detection for critical conditions (chest pain, stroke indicators, breathing difficulties, severe bleeding, anaphylaxis, suicidal ideation, unconsciousness, and prolonged seizures) without consuming an API call. The second layer uses Gemini AI for in-depth conversational assessment, returning severity levels (`low`, `moderate`, `high`, `emergency`) alongside actionable guidance. Conversations are persisted to Firestore for later review.

### First Aid Guides

Over 15 offline-ready first aid guides organized by category (wounds, burns, poisoning, choking, fractures, and more). Each guide includes step-by-step instructions, contraindication warnings, and emergency contact information. An AI chat mode allows real-time follow-up questions about any first aid topic.

### Medicine Information

A curated database of 15+ common medications covering both OTC and prescription drugs. Entries include dosage, side effects, contraindications, and drug interaction warnings. An AI chat mode enables users to ask specific questions about medications by brand or generic name.

### Facility Finder

Geolocation-based discovery of nearby hospitals, clinics, pharmacies, dentists, and doctors. Uses the browser Geolocation API and queries OpenStreetMap via the Overpass API with a configurable search radius (default 5 km). Results are displayed on an interactive Leaflet map. Multiple Overpass endpoints provide redundancy, and results are cached for 10 minutes per session.

### Health Journal

Personal health tracking with mood logging (Great, Good, Okay, Poor, Bad), predefined tags (Symptoms, Medication, Exercise, Sleep, Diet, Mental Health, Appointment, Recovery, Allergy, Chronic Pain), and free-text entries. Supports full CRUD operations with search and mood-based filtering. Requires an authenticated (non-guest) account.

### Conversation History

Browse and review past AI conversations across all features (symptom checks, first aid, and medicine queries). Displays conversation title, date, severity, and full message history.

### Dashboard

Personalized home screen with time-based greetings, quick-action cards for all features, and a health tips carousel.

### Settings

Manage display name, view account details, sign out, or permanently delete the account and all associated data.

---

## Architecture Overview

```
Client (Next.js / React)
    |
    |-- Auth Layer (Firebase Auth: Email, Google OAuth, Anonymous)
    |
    |-- Pages & Components (App Router, feature-based modules)
    |
    |-- API Routes (Next.js serverless functions)
    |       |
    |       |-- Rate Limiter (in-memory, IP-based, 50 calls/day)
    |       |-- Triage Engine (rule-based emergency detection)
    |       |-- Gemini AI (primary: gemini-2.5-flash, fallback: gemini-2.0-flash)
    |
    |-- Firestore (user profiles, conversations, journal entries)
    |
    |-- Overpass API (OpenStreetMap facility search)
    |
    |-- Service Worker (Workbox: offline caching, PWA)
```

Key architectural decisions:

- **Two-layer triage**: Rule-based detection handles emergencies instantly at zero API cost; AI handles everything else.
- **Automatic model fallback**: If Gemini 2.5 is unavailable or rate-limited, the system retries with Gemini 2.0 transparently.
- **Guest-to-account upgrade**: Anonymous users can use the app immediately and upgrade to a full account later without losing context.
- **Offline-first**: First aid guides and medicine data are bundled as static data and cached by the service worker.

---

## Tech Stack

| Category      | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | Next.js 14 (App Router)                             |
| Language      | TypeScript                                          |
| UI            | React 18, Tailwind CSS                              |
| Animation     | GSAP                                                |
| AI            | Google Generative AI (Gemini 2.5 Flash / 2.0 Flash) |
| Auth/Database | Firebase (Authentication, Firestore)                |
| Maps          | Leaflet, React Leaflet                              |
| Geolocation   | Overpass API (OpenStreetMap)                        |
| Markdown      | React Markdown                                      |
| Icons         | Lucide React                                        |
| PWA           | next-pwa, Workbox                                   |

---

## Prerequisites

- **Node.js** 18.17 or later
- **npm** (or yarn/pnpm)
- A **Google AI Studio** account with a Gemini API key
- A **Firebase** project with Authentication and Firestore enabled

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Moncito/medireach-app.git
   cd medireach-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the project root (see [Environment Variables](#environment-variables)).

4. **Deploy Firestore security rules**

   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file in the project root with the following values:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Firebase (client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: The `GEMINI_API_KEY` is server-side only and is never exposed to the client. All `NEXT_PUBLIC_*` variables are safe for client-side use as they are Firebase public configuration values.

---

## Project Structure

```
src/
  app/
    (auth)/              Authentication pages (login, register, forgot-password)
    (dashboard)/         Protected app pages (symptom-checker, facilities, etc.)
    (main)/              Public landing page and disclaimer
    api/                 Serverless API routes (symptom-check, first-aid, medicine-info)
    offline/             Offline fallback page
  components/
    dashboard/           Dashboard header and sidebar
    landing/             Landing page sections (hero, features, stats, CTA)
    layout/              Shared navbar and footer
    ui/                  Reusable UI primitives (animations, offline banner)
  data/
    first-aid-guides.ts  Static first aid guide content
    medicines.ts         Static medicine database
  features/
    auth/                Auth provider, protected route, form components
    facilities/          Facility card and map components
    first-aid/           First aid AI chat interface
    history/             Conversation list and detail views
    journal/             Journal form and entry card
    medicine/            Medicine AI chat interface
    symptom-checker/     Chat interface and message bubble
  lib/
    gemini.ts            Gemini AI model configuration and helpers
    overpass.ts          Overpass API client for facility search
    rate-limit.ts        In-memory rate limiter
    triage-engine.ts     Rule-based emergency detection engine
    utils.ts             Utility functions (cn class merger)
    firebase/            Firebase client, auth, Firestore modules
  types/                 TypeScript type declarations
public/
  manifest.json          PWA manifest
  sw.js                  Service worker (Workbox)
  icons/                 App icons (192x192, 512x512)
```

---

## API Routes

All API routes are POST endpoints that accept a JSON body with a `messages` array and return an AI-generated response.

### POST `/api/symptom-check`

Processes symptom descriptions through the two-layer triage system. Returns a message, severity level, response source (`emergency`, `rules`, or `ai`), and remaining daily quota.

### POST `/api/first-aid`

Answers real-time first aid questions using Gemini AI with medical-grade system prompts and automatic model fallback.

### POST `/api/medicine-info`

Provides medication information, drug interactions, dosage guidance, and contraindication warnings via Gemini AI.

### GET `/api/symptom-check` | `/api/first-aid` | `/api/medicine-info`

Returns the current rate limit status: remaining calls, daily limit, and reset timestamp.

---

## Authentication

MediReach supports three authentication methods through Firebase:

| Method            | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| Email / Password  | Traditional registration and login                                        |
| Google OAuth      | One-click sign-in via Google popup                                        |
| Guest (Anonymous) | Immediate access without credentials; can upgrade to a full account later |

Anonymous users can access most features but cannot use the health journal or persist conversation history. When a guest signs up with email or Google, their anonymous account is automatically linked to preserve session continuity.

Protected routes are enforced via a `<ProtectedRoute>` wrapper component that redirects unauthenticated users to the login page.

---

## Offline and PWA

MediReach is a fully installable Progressive Web App:

- **Service Worker**: Built with Workbox, precaches 40+ static assets including all first aid guides and medicine data.
- **Caching Strategies**:
  - Google Fonts: Cache First (1 year)
  - Static images: Stale While Revalidate (24 hours)
  - JS/CSS bundles: Stale While Revalidate (24 hours)
  - API routes: Network First (10 second timeout)
- **Offline Fallback**: A dedicated offline page is displayed when the network is unavailable and no cached version exists.
- **Installable**: Standalone display mode with custom theme color and icons for home screen installation on mobile and desktop.

---

## Firestore Security Rules

- Users can only read and update their own profile documents.
- Conversation subcollections are limited to 100 messages per conversation.
- Anonymous users are blocked from creating or storing conversations.
- Account deletion requires authentication and enforces ownership verification.
- All other access is denied by default.

---

## Rate Limiting

API routes are protected by an in-memory, IP-based rate limiter:

- **Daily limit**: 50 AI calls per user
- **Reset**: Midnight UTC
- **Quota errors**: Automatically refund the consumed token
- **Scope**: Shared across all three AI endpoints

> For production at scale, replace the in-memory store with Redis or Firestore-based rate limiting.

---

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Create a production build    |
| `npm start`     | Start the production server  |
| `npm run lint`  | Run ESLint                   |

---

## Deployment

MediReach is optimized for deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the project in the Vercel dashboard.
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Deploy.

The PWA service worker and manifest are automatically generated during the production build. No additional configuration is required.

For other platforms (Netlify, Railway, self-hosted), ensure the platform supports Next.js serverless functions and set the environment variables accordingly.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**Disclaimer**: MediReach provides general health information and AI-generated guidance for educational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns. In case of emergency, call your local emergency number immediately.
