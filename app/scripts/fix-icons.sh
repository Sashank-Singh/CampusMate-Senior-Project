#!/bin/bash

# Fix Expo Vector Icons issues

echo "==== Fixing Expo Vector Icons issues ===="

# Install necessary dependencies
echo "Installing required packages..."
npx expo install @expo/vector-icons expo-font

# Update types
echo "Adding types..."
npm install --save-dev @types/expo__vector-icons

# Clear cache
echo "Clearing cache..."
npx expo start --clear

# Kill any running Metro processes
echo "Stopping any running Metro processes..."
pkill -f "metro"

echo "==== Fix complete ===="
echo "Please restart your Expo app with: npx expo start --clear" 