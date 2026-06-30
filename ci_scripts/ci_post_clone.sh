#!/bin/sh
set -e

echo "SeatSavvy Xcode Cloud setup..."

if ! command -v node >/dev/null 2>&1; then
  echo "Installing Node..."
  brew install node
fi

node --version
npm --version

npm install
npm run build
npx cap sync ios