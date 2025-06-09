# Deployment Guide for Atif's Universe Portfolio

This guide provides step-by-step instructions to set up and deploy your "Atif's Universe" Next.js portfolio application.

## Prerequisites

*   **Node.js:** Version 18.x or later recommended.
*   **npm** or **yarn:** Package manager for Node.js.

## 1. Get the Code

Clone or download the project repository to your local machine or server.

## 2. Configuration (`.env` File)

The application requires environment variables for API keys, SMTP settings, and other configurations.

### Using the Interactive Setup Page (Recommended)

1.  If you haven't already, install dependencies locally:
    ```bash
    npm install
    # or
    yarn install
    ```
2.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
3.  Open your browser and navigate to `http://localhost:9002/setup`. (Replace `localhost:9002` with your actual development server address if different).
4.  This page is an **Interactive Setup Guide & Configurator**. Fill in all the required fields (Google API Key, SMTP details, admin email, system alert emails, etc.).
5.  Click the "Generate .env Content" button.
6.  Copy the generated content.

### Creating the `.env` File on Your Server

1.  In the **root directory** of your project on your server, create a file named `.env`.
2.  Paste the content you copied from the `/setup` page (or manually constructed) into this `.env` file.
3.  Save the file.

**Example `.env` structure:**
```env
GOOGLE_API_KEY=your_google_ai_api_key
SMTP_HOST=your_smtp_host_address
SMTP_PORT=your_smtp_port_number
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_SECURE=true_or_false # true for SSL (e.g., port 465), false for TLS/STARTTLS (e.g., port 587)
EMAIL_FROM=your_website_from_address@example.com
ADMIN_EMAIL=your_primary_admin_notification_email@example.com
SYSTEM_ALERT_EMAILS=alert1@example.com,alert2@example.com # Optional, for critical email failure alerts
```

**Important Notes on `.env` for Production:**
*   The `.env` file should **never** be committed to your Git repository if it contains sensitive credentials. Ensure your `.gitignore` file includes `.env`.
*   Most hosting platforms (Vercel, Netlify, AWS, Firebase App Hosting, etc.) provide a way to set environment variables through their dashboard or CLI. This is generally the **recommended and more secure method for production deployments** instead of using a physical `.env` file. The variable names (e.g., `SMTP_HOST`, `GOOGLE_API_KEY`) remain the same.

## 3. Install Dependencies

If you haven't already (e.g., for a fresh server setup), navigate to the project directory on your server and install the necessary dependencies:

```bash
npm install --production
# or
yarn install --production
```
Using the `--production` flag (or similar, depending on your package manager and workflow) can help skip development-only dependencies if desired for a lean production environment.

## 4. Build the Project

Create an optimized production build of your Next.js application:

```bash
npm run build
# or
yarn build
```

## 5. Run the Application

Start the Next.js production server:

```bash
npm run start
# or
yarn start
```
By default, this usually runs on port 3000 (for Next.js default). Your hosting provider might manage this differently or you might specify a port.

For robust production deployments, consider using a process manager like PM2:
```bash
pm2 start npm --name "atifs-universe" -- run start
# Or if your start script uses a specific port (e.g., PORT=9002 npm run start)
# pm2 start npm --name "atifs-universe" -- run start -- --port 9002
```
Refer to PM2 documentation for more advanced configurations.

## 6. Admin Panel & Content Management

Your portfolio content (About, Services, Projects, Testimonials, Navigation, Email Templates) is managed via the Admin Panel.

*   **Access:** The Admin Panel is available at the path `/donotentermetowebsitepotfolio` (e.g., `yourdomain.com/donotentermetowebsitepotfolio`).
    *   The default secret key is `ilovegfxm`. It is **highly recommended to change this** in `src/app/donotentermetowebsitepotfolio/page.tsx` before deploying publicly.
*   **Content Storage:** Most content edited in the admin panel is saved to your browser's **localStorage**. This means the data is specific to the browser and device you use for editing.
*   **Making Content Live (Default for All Users):**
    1.  Edit and save content in the Admin Panel (this saves it to your browser's localStorage).
    2.  To make these changes the default for all users of the website, you must **manually copy** the updated data structures (e.g., the JavaScript arrays/objects for services, projects). You can usually inspect localStorage via your browser's developer tools to get this data.
    3.  Paste this data into the corresponding variables in the `src/data/constants.ts` file in your project code.
    4.  Re-build and re-deploy your application (`npm run build` then restart your server).
*   **Email Templates:**
    1.  Design email templates in the Admin Panel ("Email Templates" tab). This saves to your browser's `localStorage`.
    2.  To use these templates for actual system emails sent by the server, you must **manually copy the HTML** from the admin panel's textareas.
    3.  Paste this HTML into the corresponding string variables (e.g., `userHtmlTemplate`, `adminHtmlTemplate` variants) in the `src/app/actions/send-inquiry-email.ts` file.
    4.  Re-build and re-deploy your application.

## 7. Email Functionality (SMTP)

*   Ensure all `SMTP_*` variables and `EMAIL_FROM`, `ADMIN_EMAIL`, `SYSTEM_ALERT_EMAILS` in your `.env` file (or hosting provider's environment variables) are correctly configured as per your email provider's details.
*   Incorrect SMTP settings are the most common cause of email sending failures. Double-check host, port, user, password, and secure (SSL/TLS) settings.
*   For better email deliverability and to avoid spam filters, ensure your sending domain (e.g., `flasheer.net` or your custom domain associated with `EMAIL_FROM`) has proper **SPF** and **DKIM** DNS records configured to authorize your SMTP relay service. A **DMARC** record is also recommended.

## 8. AI Features (Genkit)

*   AI-powered features (summaries, content generation, skill explanations, AI email composition) require a valid `GOOGLE_API_KEY` to be set in your environment variables.
*   Ensure the Google AI (Generative Language API) is enabled for your Google Cloud project associated with this API key and that your project has billing enabled.

## 9. Development Server for Genkit (Optional)

If you need to run Genkit flows in a local development environment (separate from the main Next.js dev server, perhaps for testing flows directly):
```bash
npm run genkit:dev
# or for watching changes:
npm run genkit:watch
```
This uses `src/ai/dev.ts` to start the Genkit development server.

---

This guide should help you get "Atif's Universe" up and running. If you encounter issues, check your server logs (especially for SMTP or AI API errors), your `.env` configuration, and your SMTP provider settings.
