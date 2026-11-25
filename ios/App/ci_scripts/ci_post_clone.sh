#!/bin/sh
set -e

echo "=== Xcode Cloud Post-Clone: Installing Capacitor & CocoaPods dependencies ==="
cd "$CI_PRIMARY_REPOSITORY_PATH"

export HOMEBREW_NO_AUTO_UPDATE=1

if ! command -v node >/dev/null 2>&1; then
  brew install node
fi

if ! command -v pod >/dev/null 2>&1; then
  brew install cocoapods
fi

npm install
npx cap copy ios
cd ios/App
pod install
echo "=== Xcode Cloud Post-Clone Complete ==="
