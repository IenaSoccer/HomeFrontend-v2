#!/bin/bash
set -e

echo "Deployment started ..."

# Pull the latest version of the app
git reset --hard
git pull origin release
echo "Pulled latest code from release branch."

# Quasar Build
npm i @quasar/cli
npm i
echo "Dependencies installed."

# Clean the dist folder
rm -rf dist
echo "Cleaned dist folder."

# Build the app for production
MODE=prod npx quasar build
echo "App built for production."

echo "Deployment finished!"
