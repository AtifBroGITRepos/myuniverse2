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
# PM2 App Name
PM2_APP_NAME="atifs-universe"

# --- Optional: Pull latest changes from Git ---
if [ "$AUTO_PULL_GIT" = true ] ; then
  echo "🔄 Fetching latest changes from Git origin..."
  git fetch origin

  echo "🔄 Checking out and resetting branch '$GIT_BRANCH' to match origin..."
  # If you encounter a "fatal: detected dubious ownership in repository" error here,
  # it means the user running this script (e.g., root) is different from the owner
  # of the Git repository files.
  # You may need to run:
  # git config --global --add safe.directory /path/to/your/repository
  # (Replace /path/to/your/repository with the actual path, e.g., /home/universe/public_html)
  # See DEPLOYMENT_GUIDE.md for more details.
  git checkout $GIT_BRANCH
  git reset --hard origin/$GIT_BRANCH

  echo "🧹 Cleaning untracked files and directories..."
  git clean -fdx  # Remove untracked files (-f for force, -d for directories, -x to ignore .gitignore rules - use with care if you have intentionally untracked files you want to keep)
  # If you want to be less aggressive, you might use:
  # git clean -fd # This respects .gitignore
else
  echo "ℹ️ Skipping Git operations. Ensure the latest code is already on the server."
fi

# --- Install Dependencies ---
echo "📦 Installing/updating dependencies (production)..."
# If you use npm:
npm install --production # or npm install --omit=dev
# If you use yarn (uncomment the line below and comment out the npm line):
# yarn install --production

# --- Build the Project ---
echo "🛠️ Building the Next.js application for production..."
# If you use npm:
npm run build
# If you use yarn (uncomment the line below and comment out the npm line):
# yarn build

# --- Restart with PM2 ---
# Ensure PM2 is installed globally: npm install pm2 -g (Run this command manually once if not already installed)

echo "🔄 Managing application with PM2..."
if pm2 list | grep -q "$PM2_APP_NAME"; then
  echo "↪️ Application '$PM2_APP_NAME' is already running. Restarting..."
  pm2 restart $PM2_APP_NAME
else
  echo "▶️ Application '$PM2_APP_NAME' not found. Starting..."
  # The `npm run start` script (usually `next start`) will be used.
  # Your package.json `start` script is `next start`.
  # PM2 will pass through environment variables like PORT if they are set when PM2 is started,
  # or you can configure them in a PM2 ecosystem file.
  # By default, `next start` listens on port 3000.
  pm2 start npm --name "$PM2_APP_NAME" -- run start
fi

echo "💾 Saving PM2 process list to resurrect on reboot..."
pm2 save

echo "✅ PM2 process status:"
pm2 list

echo "✅ Deployment script finished."
echo "ℹ️ Application '$PM2_APP_NAME' should now be running via PM2."
echo "Ensure your .env file is correctly configured in the project root."
echo "You can check logs with: pm2 logs $PM2_APP_NAME"
