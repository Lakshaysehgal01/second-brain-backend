# Brainly

A simple Express + TypeScript backend for user authentication and content management, using MongoDB and Zod for schema validation.

## Features

- User signup and signin with JWT authentication
- Password hashing with bcrypt
- Add, fetch, and delete user-specific content
- Tagging system for content
- Input validation using Zod
- MongoDB integration via Mongoose

## API Endpoints

### Auth

- `POST /api/v1/signup`  
  Create a new user.  
  **Body:** `{ "username": string, "password": string }`

- `POST /api/v1/signin`  
  Authenticate a user and receive a JWT token.  
  **Body:** `{ "username": string, "password": string }`  
  **Response:** `{ "token": string }`

### Content

- `POST /api/v1/content`  
  Add new content (requires JWT in `Authorization` header).  
  **Body:** `{ "title": string, "link": string, "type": string, "tag": string }`

- `GET /api/v1/content`  
  Get all content for the authenticated user.

- `DELETE /api/v1/content`  
  Delete content by ID (requires JWT).  
  **Body:** `{ "contentId": string }`

## Getting Started

### Prerequisites

- Node.js
- MongoDB instance

### Setup

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root with:
   ```
   PORT=8080
   JWT_SECRET=your_jwt_secret
   MONGO_URL=your_mongodb_connection_string
   ```
4. Build and start the server:
   ```sh
   npm run dev
   ```

## Project Structure

- `src/index.ts` – Main server and API routes
- `src/db.ts` – Mongoose models
- `src/middleware.ts` – JWT authentication middleware
- `src/zodSchema.ts` – Zod validation schemas

## Dependencies

- express
- mongoose
- jsonwebtoken
- bcrypt
- dotenv
- zod
- typescript

## License

ISC
