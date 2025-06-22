
# Deployment & Workflow Guide

This guide provides step-by-step instructions for local development (including with Laragon), version control with Git/GitHub, and deployment to a production server.

---

## Part 1: Local Development

### Prerequisites

*   **Node.js:** Version 18.x or later.
*   **npm** or **yarn:** Package manager.
*   **Git:** For version control.
*   **(Optional) Laragon:** A portable, isolated, and fast development environment for Windows.

### Option A: Standard Local Setup

This is the standard way to run the project on any operating system.

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd atifs-universe # Or your project directory name
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment (`.env` file):**
    *   Run the development server once: `npm run dev`.
    *   Open your browser to `http://localhost:9002/app-config-and-deployment-interface`.
    *   Use the form to generate the content for your `.env` file.
    *   Create a `.env` file in your project's root directory and paste the generated content into it.

4.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

### Option B: Local Development with Laragon

Laragon provides a convenient way to manage projects with clean, customizable URLs.

1.  **Clone into Laragon's `www` Directory:**
    *   Open Laragon.
    *   Navigate to your `www` directory (usually `C:\laragon\www`).
    *   Clone your repository here:
        ```bash
        git clone <your-repository-url> atifs-universe
        ```

2.  **Start Laragon & Open Terminal:**
    *   Click "Start All" in Laragon.
    *   Right-click the Laragon window and select `Terminal` to open a terminal pre-configured for your environment.

3.  **Install Dependencies:**
    *   In the Laragon terminal, navigate to your project directory (`cd atifs-universe`).
    *   Run `npm install`.

4.  **Configure `.env` file:**
    *   Follow the same steps as in the "Standard Local Setup" to create your `.env` file in the project root (`C:\laragon\www\atifs-universe\.env`).

5.  **Run the Development Server:**
    *   In the Laragon terminal (while inside your project directory), run:
        ```bash
        npm run dev
        ```
    *   Laragon automatically creates a pretty URL for you. You can access your application at `http://atifs-universe.test` (or whatever you named the project folder). The application still runs on port 9002, but Laragon proxies it for you.

---

## Part 2: Version Control with Git & GitHub

Once your project is set up locally, you should push it to a GitHub repository to track changes and collaborate.

1.  **Create a Repository on GitHub:**
    *   Go to [GitHub](https://github.com) and create a new, empty repository. Do not initialize it with a `README` or `.gitignore` from the GitHub UI.
    *   Copy the repository URL (e.g., `https://github.com/your-username/your-repo-name.git`).

2.  **Initialize Git and Push:**
    *   In your local project directory, run the following commands:
        ```bash
        # Initialize a new Git repository if you haven't already
        git init -b main

        # Add all files to be tracked
        git add .

        # Create your first commit
        git commit -m "Initial commit"

        # Link your local repository to the remote one on GitHub
        git remote add origin <your-repository-url>

        # Push your code to GitHub
        git push -u origin main
        ```

3.  **Important Note on `.env` files:**
    *   Your `.env` file contains sensitive information (API keys, passwords). **It should never be committed to a public GitHub repository.**
    *   It is highly recommended to create a `.gitignore` file in your project root and add `.env` to it. This tells Git to ignore the file.
    *   When you deploy to a server, you will create the `.env` file there manually or use the hosting provider's environment variable settings.

---

## Part 3: Deploying to a Production Server

This section assumes you have a Linux-based server (like Ubuntu on AWS, DigitalOcean, etc.) with SSH access.

### Prerequisites on Server

*   Node.js and npm installed.
*   Git installed.
*   A process manager like **PM2** installed globally (`npm install pm2 -g`).
*   (Optional but Recommended) A web server like **Nginx** or **Apache** to act as a reverse proxy.

### Deployment Steps

1.  **Connect to Your Server:**
    ```bash
    ssh your-user@your-server-ip
    ```

2.  **Clone Your Repository:**
    *   Navigate to the directory where you want to store your applications (e.g., `/var/www`).
    *   Clone your project from GitHub:
        ```bash
        git clone <your-repository-url>
        cd <your-project-directory>
        ```

3.  **Install Production Dependencies:**
    ```bash
    npm install --production
    # This skips development-only packages for a leaner installation.
    ```

4.  **Create Production `.env` File:**
    *   Create and edit the `.env` file with your production credentials (e.g., production database, email provider, etc.).
        ```bash
        nano .env
        ```
    *   Paste your production environment variables here and save the file.

5.  **Build the Application:**
    *   Create an optimized production build:
        ```bash
        npm run build
        ```

6.  **Start with PM2:**
    *   Use PM2 to run your application. This will keep it running in the background and automatically restart it if it crashes.
        ```bash
        # Start the app. The 'name' is an identifier for PM2.
        pm2 start npm --name "atifs-universe" -- run start

        # To check the status of your running apps:
        pm2 list

        # To view logs for a specific app:
        pm2 logs atifs-universe

        # To make PM2 restart on server reboot:
        pm2 startup
        pm2 save
        ```
    Your application is now running (usually on `http://localhost:3000` by default).

7.  **(Optional) Configure a Reverse Proxy (Nginx Example):**
    *   To make your site accessible via a domain name (e.g., `yourdomain.com`) instead of an IP address and port, you need a reverse proxy.
    *   Install Nginx (`sudo apt update && sudo apt install nginx`).
    *   Create a new Nginx configuration file:
        ```bash
        sudo nano /etc/nginx/sites-available/yourdomain.com
        ```
    *   Paste a configuration like this, replacing `yourdomain.com` and `localhost:3000` as needed:
        ```nginx
        server {
            listen 80;
            server_name yourdomain.com www.yourdomain.com;

            location / {
                proxy_pass http://localhost:3000; # The port your Next.js app is running on
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
            }
        }
        ```
    *   Enable the site and restart Nginx:
        ```bash
        # Create a symbolic link to enable the site
        sudo ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

        # Test the configuration for errors
        sudo nginx -t

        # Restart Nginx to apply changes
        sudo systemctl restart nginx
        ```
    *   You should now be able to access your site at `http://yourdomain.com`.
