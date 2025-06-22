
# Atif's Universe - Next.js Portfolio

Welcome to Atif's Universe, a dynamic and feature-rich personal portfolio website built with Next.js, React, ShadCN UI, Tailwind CSS, and Genkit for AI-powered features.

## Features

*   Modern, responsive design.
*   Sections for Hero, About, Skills, Services, Projects, Testimonials, and Contact.
*   AI-powered tools:
    *   Project Idea Generator
    *   Skill Explainer
    *   Email Message Summarizer (for user inquiries and admin panel)
    *   AI-assisted Email Composition (in Admin Panel)
*   Admin Panel for content management (About, Services, Projects, Testimonials, Navigation, Email Templates design).
*   SMTP email integration for contact forms and service inquiries.
*   Interactive Setup Guide page for easy `.env` configuration.

## Getting Started

### 1. Prerequisites

*   Node.js (v18.x or later)
*   npm or yarn
*   (Optional for local) Laragon or similar development environment.

### 2. Quick Start (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Set up Environment Variables:**
    *   The application uses a `.env` file for configuration (API keys, SMTP settings).
    *   Run `npm run dev` and navigate to `http://localhost:9002/app-config-and-deployment-interface` in your browser. This page will help you generate the content for your `.env` file. (Note: Port 9002 is the dev server default for this project).
    *   Create a `.env` file in the project root and paste the generated content into it.
    *   **Key variables to set:** `GOOGLE_API_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`, `EMAIL_FROM`, `ADMIN_EMAIL`, `SYSTEM_ALERT_EMAILS`.
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.
    The Genkit development server (for AI flows) can be run separately if needed: `npm run genkit:dev`.

### 3. Admin Panel

*   Access the admin panel at `/donotentermetowebsitepotfolio`.
*   Default secret key: `ilovegfxm` (It is strongly recommended to change this in `src/app/donotentermetowebsitepotfolio/page.tsx` for production).
*   Content is managed via the admin panel and primarily saved to your browser's localStorage. See the [Deployment Guide](./DEPLOYMENT.md) for making these changes live for all users.

## Deployment

For detailed instructions on local setup with Laragon, pushing to GitHub, and deploying to a live server, please refer to the new **[DEPLOYMENT.md](./DEPLOYMENT.md)** file.

## Project Structure

*   `src/app/`: Main application pages (App Router).
*   `src/components/`: Reusable React components (shared, sections, UI).
*   `src/data/`: Static data and constants (e.g., default project info).
*   `src/ai/`: Genkit AI flows and configuration.
*   `src/lib/`: Utility functions and services (e.g., email service).
*   `public/`: Static assets.

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **UI:** React, ShadCN UI Components, Tailwind CSS
*   **AI:** Genkit (with Google AI)
*   **Email:** Nodemailer
*   **Language:** TypeScript

---

This project was prototyped with Firebase Studio.
