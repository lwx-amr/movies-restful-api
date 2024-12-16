# Movies-Restful-API

A RESTful API built using NestJS to interact with The Movie Database (TMDB) APIs. This application provides functionality for managing movies, including creating, updating, deleting, and rating movies. The database is synchronized with TMDB data, supporting pagination, filtering, and caching.

## Features

- Manage movies and genres.
- Pagination: Retrieve movies with pagination.
- Genre Filtering: Filter movies by genres.
- Rating System: Rate movies and calculate their average ratings.
- Watchlist: Add and remove movies from Watchlist.
- Database Sync: Sync genres and movies with TMDB data.
- Validation: Comprehensive input validation for all endpoints.
- Caching: Optimized with Redis for frequently accessed data.
- Docker Support: Easily run the application using Docker.
- API Documentation: Swagger documentation included for all endpoints.
- Unit Tests: Achieved 95%+ test coverage.

## Prerequisites

- Node.js (v21.0.0)
- Docker
- TMDB API Key
- pnpm package manager

## Technology Stack

- NestJS
- TypeORM
- PostgreSQL
- Redis (for caching)
- Swagger (API documentation)
- Jest (testing)
- Passport.js (authentication)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/movies-restful-api.git
cd movies-restful-api
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Create a `.env` file in the project root and make sure to include all of the ENVs from .env.example file

## For Development

### 1. Make sure to have 2 running instance of redis and postgres

```bash
# To use docker
# Postgres
docker run --name postgres_container   -e POSTGRES_USER={youruser}   -e POSTGRES_PASSWORD=[yourpassword]   -e POSTGRES_DB=movies-restful-api   -p 5432:5432   -v postgres_data:/var/lib/postgresql/data   -d postgres:latest

# Redis
docker run -d --name redis-container -p 6379:6379 redis:latest --requirepass {yourpassword}
```

### 2. Database Migrations

```bash
# Run migrations
pnpm run migration:run
```

## Running the Application

### Development Mode

```bash
pnpm run start:dev
```

### Production Mode

```bash
pnpm run build
pnpm run start:prod
```

## To run using docker compose

### Docker Deployment

```bash
docker-compose up --build
```

### Sync the genres and then the movies

```bash
# Hit this endpoint to sync genres
POST /sync/genres

# Hit this endpoint to sync movies
POST /sync/movies
```

The application will be accessible at `http://localhost:8080`

## API Documentation

Swagger UI documentation is available at `/api-docs` endpoint when the application is running.

## Testing

### Run Unit Tests

```bash
pnpm run test
```

### Test Coverage

```bash
pnpm run test:cov
```

## Project Structure

```bash
src/
├── app.module.ts               # Root application module
├── main.ts                     # Entry point of the application
├── common/                     # Shared resources, utilities, and guards
│   ├── types/                  # Data Transfer Objects (shared DTOs)
│   ├── exceptions/             # Custom exceptions
│   ├── guards/                 # Authorization guards
│   ├── interceptors/           # Request/Response interceptors
│   └── pipes/                  # Validation pipes
├── config/                     # Configuration files
│   ├── app.config.ts           # Application-specific configuration
│   ├── database.config.ts      # Database-specific configuration
│   ├── jwt.config.ts           # jwt-specific configuration
│   ├── redis.config.ts         # redis-specific configuration
│   ├── tmdb.config.ts          # tmdb-specific configuration
│   └── typeorm.config.ts       # typeorm-specific configuration
├── modules/                    # Feature modules
│   ├── movies/                 # Movies feature module
│   │   ├── movies.controller.ts  # Controller for movie-related routes
│   │   ├── movies.module.ts      # Feature module definition
│   │   ├── movies.service.ts     # Business logic for movies
│   │   └──  dtos/                # DTOs specific to movies
│   ├── movies-client/            # Movies feature module
│   │   ├── movies.controller.ts  # Controller for movie-related routes
│   │   ├── movies.module.ts      # Feature module definition
│   │   ├── movies.service.ts     # Business logic for movies
│   │   ├── clients/              # contains all the clients we will have to consume movies APIs
│   │   ├── interfaces/           # interface for all the clients we will have to consume movies APIs
│   │   └── types/                # Data Transfer Objects (shared DTOs)
│   ├── users/                  # Users feature module
│   │   ├── users.controller.ts   # Controller for user-related routes
│   │   ├── users.module.ts       # Feature module definition
│   │   ├── users.service.ts      # Business logic for users
│   │   ├── dtos/                 # DTOs specific to users
│   │   └── entities/             # Database entities for users
│   └── movies-sync/                   # Authentication module
│       ├── movies-sync.controller.ts    # Controller for movies-sync routes
│       ├── movies-sync.module.ts        # Feature module definition
│       └── movies-sync.service.ts       # Business logic for movies-sync
├── database/                   # Database-related configuration and scripts
│   └── migrations/             # Database migration scripts
├── shared/                     # Shared utilities and services
│   └──  https-client/          # HTTP client to perform HTTP calls
├── tests/                      # Test-related files
│   ├── e2e/                    # End-to-end tests
│   └── unit/                   # Unit tests
└── utils/                      # General-purpose utilities
    ├── constants.ts            # Application-wide constants
    └── cast-helpers.ts         # Helper functions for casting
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Register and login endpoints are provided to obtain access tokens.

## Key Highlights

- Database: PostgreSQL is used for relational data storage.
- Caching: Redis improves performance for repeated queries.
- Validation: DTOs with class-validator ensure clean, reliable input handling.
- Swagger: Provides interactive API documentation.

## Future Enhancements

- Split Auth in a separate module
- Setup periodic jobs to hit the sync endpoints frequently to stay up to date
- Logs to be sent to a 3rd party to allow querying
- Setup any monitoring agent like Sentry
- Setup CI/CD and Github pipeline to automated covered check and deployment

## Deployment Considerations

- Ensure all environment variables are properly configured
- Use strong, unique passwords and secrets
- Consider using a production-ready PostgreSQL and Redis setup
- Implement additional security measures as needed

## License

Distributed under the UNLICENSED License.
