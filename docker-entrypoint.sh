#!/bin/sh

set -e

# Create the database if it doesn't exist
echo "Ensuring the database '${DB_NAME}' exists..."
PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
  PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -c "CREATE DATABASE \"$DB_NAME\""

echo "Database '${DB_NAME}' is ready!"

# Run migrations
echo "Running database migrations..."
npm run migration:run

# Start the application
echo "Starting the application..."
exec "$@"
