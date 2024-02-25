
# ProElevate API

The ProElevate Job Listing API allows you to manage users and job listings. Only authenticated users can perform CRUD operations on both users and job listings.

## Requirements
- Node.js
- Express.js
- Mongoose (MongoDB)
- JWT
- DotEnv
- Body Parser

## Getting Started

To get started with the API, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/AzeemIdrisi/ProElevate.git
   ```

2. Install dependencies:

   ```bash
   cd ProElevate
   npm install
   ```

3. Configure environment variables:

   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:

   ```bash
   node app.js
   ```

## API Endpoints

> [!IMPORTANT]  
> The request method is `application/x-www-form-urlencoded`.
> Examples are shown in JSON for better readability.

> [!TIP]
> Postman is recommended for testing.

### Authentication (Required to proceed)

- **POST /login**
  - Description: Logs in a user and returns a JWT token for authentication.
  - Request body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "token": "your_generated_jwt_token" }`

### Users

- **POST `/user`**
  - Description: Creates a new user.
  - Request body: `{ "name": "Azeem Idrisi", "githubLink":"https://github.com/AzeemIdrisi/"}`
  - Authentication: Required

- **GET `/user`**
  - Description: Retrieves all users.
  - Authentication: Required

- **GET `/user/:id`**
  - Description: Retrieves a single user by ID.
  - Authentication: Required

- **PUT `/user/:id`**
  - Description: Updates a user by ID.
  - Request body: `{ "name": "Updated Name" ,"githubLink":"https://github.com/UPDATED/"}`
  - Authentication: Required

- **DELETE `/user/:id`**
  - Description: Deletes a user by ID.
  - Authentication: Required

- **POST `/like/:id`**
  - Description: Like a user by ID and increase their point.
  - Authentication: Required

- **GET `/points`**
  - Description: Retrieve users in ascending order of points.
  - Authentication: Required

### Jobs

- **POST `/job`**
  - Description: Creates a new job listing.
  - Request body: `{ "date": "YYYY-MM-DD", "link": "Job Site Link", title:"Job Title" }`
  - Authentication: Required

- **GET `/job`**
  - Description: Retrieves all job listings.
  - Authentication: Required

- **GET `/job/:id`**
  - Description: Retrieves a single job listing by ID.
  - Authentication: Required

- **PUT `/job/:id`**
  - Description: Updates a job listing by ID.
  - Request body: `{ "title": "Updated Title","link":"Updated Link" }`
  - Authentication: Required

- **DELETE `/job/:id`**
  - Description: Deletes a job listing by ID.
  - Authentication: Required

- **POST `/job/apply/:userID/:jobID`**
  - Description: Adds an existing user to job applicants list.
  - Authentication: Required

## Authentication

- The API uses JWT tokens for authentication. Include the __Bearer Token__ in the `Authorization` header of your requests.

