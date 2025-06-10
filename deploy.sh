#!/bin/bash

# Deployment Script for Atif's Universe Portfolio

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting deployment of Atif's Universe..."

# --- Configuration ---
# Set to true if you want to automatically pull from Git.
# Ensure your server has SSH keys configured for Git if using SSH URLs.
AUTO_PULL_GIT=true
# Specify the branch to pull if AUTO_PULL_GIT is true
GIT_BRANCH="main" # Or "master", or your deployment branch

# --- Optional: Pull latest changes from Git ---
if [ "$AUTO_PULL_GIT" = true ] ; then
  echo "🔄 Pulling latest changes from Git branch '$GIT_BRANCH'..."
  git checkout $GIT_BRANCH
  git pull origin $GIT_BRANCH
  # If you need to discard local changes before pulling:
  # git fetch origin
  # git reset --hard origin/$GIT_BRANCH
else
  echo "ℹ️ Skipping Git pull. Ensure the latest code is already on the server."
fi

# --- Install Dependencies ---
echo "📦 Installing/updating dependencies (production)..."
# If you use npm:
npm install --production
# If you use yarn (uncomment the line below and comment out the npm line):
# yarn install --production

# --- Build the Project ---
echo "🛠️ Building the Next.js application for production..."
# If you use npm:
npm run build
# If you use yarn (uncomment the line below and comment out the npm line):
# yarn build

# --- (Optional but Recommended) Restart with PM2 ---
# If you are using PM2 to manage your application, you might use commands like these:
# Ensure PM2 is installed globally: npm install pm2 -g
#
# To start or restart your application with PM2:
# Replace "atifs-universe" with your desired PM2 app name.
#
# if pm2 list | grep -q "atifs-universe"; then
#   echo "🔄 Restarting application with PM2..."
#   pm2 restart atifs-universe
# else
#   echo "▶️ Starting application with PM2..."
#   # The command for `npm run start` might be `next start` by default or a custom port
#   # Check your package.json `start` script.
#   # If your start script is `next start -p 9002` (example for port 9002):
#   # pm2 start npm --name "atifs-universe" -- run start -- --port 9002
#   # If your start script is just `next start` (default port 3000):
#   pm2 start npm --name "atifs-universe" -- run start
# fi
#
# echo "✅ PM2 process status:"
# pm2 list

# --- OR: Start with npm start (not recommended for long-running production) ---
# If you are not using PM2, you can start the app directly.
# This is generally NOT recommended for production as the app will stop if the terminal closes.
# You would typically run this in a screen/tmux session or have a systemd service.
# echo "▶️ Starting application with 'npm run start'..."
# echo "⚠️ Note: For production, using a process manager like PM2 is highly recommended."
# (The script will exit after this if you uncomment the line below, as `npm start` is foreground)
# npm run start

echo "✅ Deployment script finished."
echo "ℹ️ If you are not using a process manager like PM2, you may need to start the application manually (e.g., 'npm run start' in a screen/tmux session)."
echo "Ensure your .env file is correctly configured in the project root."

