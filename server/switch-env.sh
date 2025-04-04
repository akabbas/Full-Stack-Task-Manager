#!/bin/bash

# Check if environment argument is provided
if [ -z "$1" ]; then
  echo "Usage: ./switch-env.sh [development|production]"
  exit 1
fi

ENV=$1

# Validate environment
if [ "$ENV" != "development" ] && [ "$ENV" != "production" ]; then
  echo "Error: Environment must be either 'development' or 'production'"
  exit 1
fi

# Copy the appropriate environment file
cp .env.$ENV .env

echo "Switched to $ENV environment"
echo "Environment variables updated from .env.$ENV" 