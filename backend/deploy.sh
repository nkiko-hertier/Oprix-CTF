#!/bin/bash
set -e

# --- CONFIG ---
NETWORK_NAME=oprix-network
POSTGRES_CONTAINER=oprix-ctf-postgres
REDIS_CONTAINER=oprix-ctf-redis
BACKEND_CONTAINER=oprix-ctf-backend
IMAGE_NAME=oprix-ctf-backend:latest

# --- CREATE NETWORK IF NOT EXISTS ---
if ! podman network exists $NETWORK_NAME; then
  echo "Creating network: $NETWORK_NAME"
  podman network create $NETWORK_NAME
fi

# --- START POSTGRES ---
echo "Starting PostgreSQL..."
podman run -d --name $POSTGRES_CONTAINER \
  --network $NETWORK_NAME \
  -e POSTGRES_USER=oprix_admin \
  -e POSTGRES_PASSWORD=changeme \
  -e POSTGRES_DB=oprix_ctf \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine

# --- START REDIS ---
echo "Starting Redis..."
podman run -d --name $REDIS_CONTAINER \
  --network $NETWORK_NAME \
  -p 6379:6379 \
  redis:7-alpine

# --- BUILD BACKEND IMAGE ---
echo "Building backend image..."
podman build -t $IMAGE_NAME .

# --- START BACKEND ---
echo "Starting NestJS backend..."
podman run -d --name $BACKEND_CONTAINER \
  --network $NETWORK_NAME \
  -p 3000:3000 \
  --env-file .env \
  -v uploads:/app/uploads \
  $IMAGE_NAME

echo "✅ All services are up!"
