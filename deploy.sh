#!/bin/bash
set -e

echo "Starting deployment..."

# Stop existing containers
docker-compose down

# Pull latest images from registry
docker-compose pull

# Start containers with pulled images
docker-compose up -d

# Clean up old images
docker system prune -f

echo "Deployment completed successfully!"