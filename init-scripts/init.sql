-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ${DB_NAME};

-- Connect to the database
\c ${DB_NAME}