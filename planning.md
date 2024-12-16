# How this project was planned

## Splited the requirement into smaller chuncks for easier management

### Title: Setup Project Environment

#### Description

Set up the basic project environment to ensure a smooth development workflow.

- Initialize a NestJS project.
- Configure Docker and Docker Compose for the application.
- Set up environment variables and .env file for sensitive information like API keys.
- Add eslint and prettier for code quality and formatting.

### Title: Integrate TMDB API

#### Description

Implement functionality to fetch and populate the database with movie data from TMDB API.

- Create a service to interact with TMDB API.
- Choose essential data fields to store in the database.
- Design scalable data structures for the movie model.
- Add a script to populate the database with initial data.

### Title: Design Database Schema

#### Description

Design and implement the database schema for the application.

- Create tables/models for movies, users, ratings, and watchlists.
- Ensure database is optimized for future scalability and updates.
- Implement migrations for the database schema.

### Title: CRUD Operations for Movies

#### Description

Create API endpoints for CRUD operations on movies.

- Implement endpoints to list, search, create, update, and delete movies.
- Add pagination and filtering to the movie listing endpoint.
- Ensure proper validations for incoming data.

### Title: Rate a Movie

#### Description

Implement the feature to rate a movie.

- Create an endpoint for users to rate movies.
- Store ratings in the database.
- Calculate and return the average rating for movies in the listing endpoint.

### Title: Add to Watchlist / Mark as Favorite

#### Description

Implement the functionality for users to add movies to their watchlist or mark them as favorites.

- Create endpoints for adding, removing, and retrieving watchlisted or favorited movies.
- Ensure proper user authentication for these actions.

### Title: Filter by Genre

#### Description

Add functionality to filter movies by genre.

- Implement a filtering mechanism in the movie listing API.
- Ensure multiple genre filters can be applied.

### Title: Caching Mechanism

#### Description

Implement caching to reduce database calls and optimize performance.

- Choose a caching mechanism (e.g., Redis).
- Cache frequently accessed data like movie listings and details.
- Add cache invalidation logic to handle updates.

### Title: Secure API

#### Description

Add security measures to protect APIs.

- Implement JWT-based authentication for user actions.
- Add role-based access control if needed.
- Secure sensitive endpoints against unauthorized access.

### Title: Dockerize the Application

#### Description

Ensure the application runs in a Docker container.

- Create a Dockerfile for the application.
- Update docker-compose.yml to orchestrate services like the application, database, and caching server.
- Verify the application can be launched with docker-compose up.

### Title: API Documentation

#### Description

Document all APIs for easy consumption.

- Use Swagger for interactive API documentation.
- Include details about request parameters, responses, and authentication.
- Ensure the documentation is accessible at /api-docs.

### Title: README Documentation

#### Description

Create a README.md file to explain the project structure and setup.

- Include instructions for setting up the project locally.
- Provide details about environment variables, APIs, and how to run the project.
- Highlight key features and how to contribute.

### Title: Optimize for Production

#### Description

Prepare the application for a production environment.

- Add logging using a library like winston.
- Implement rate-limiting and request validation.
- Optimize database queries and caching.

## Created simple Jira board for the project

![Project Start](https://i.postimg.cc/BnhHpGt7/Screenshot-2024-12-11-215212.png)
For each card this a corresponding git branch that has all the changes and it's linked to the card at Jira.

This how the board looked like by the end of the project
![Project End](https://i.postimg.cc/c1gW47Qv/Screenshot-2024-12-16-125255.png)
