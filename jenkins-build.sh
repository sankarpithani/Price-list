#!/bin/bash

# Set PATH to include Node.js
export PATH="/usr/local/bin:$PATH"

# Verify Node.js is available
echo "Checking Node.js installation..."
which node
which npm

# Display versions
echo "Node.js version:"
node --version
echo "npm version:"
npm --version

# Install dependencies
echo "Installing dependencies..."
npm install

# Run tests
echo "Running Amazon price validator tests..."
npm run Amazon

echo "Build completed!"
