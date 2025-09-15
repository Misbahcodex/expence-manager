#!/bin/bash

echo -e "\n============================================="
echo -e "Running all security checks..."
echo -e "=============================================\n"

# Run security scan
echo -e "\n[1/4] Running security scan..."
npm run security:scan

# Check environment variables
echo -e "\n[2/4] Checking environment variables..."
npm run security:check-env

# Test secure email implementation
echo -e "\n[3/4] Testing secure email implementation..."
cd backend
npm run test:email
cd ..

# Run linting
echo -e "\n[4/4] Running linting..."
npm run lint

echo -e "\n============================================="
echo -e "Security checks completed!"
echo -e "=============================================\n"