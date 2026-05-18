# Smart-Leads-Dashboard

Smart Leads Dashboard is a full-stack application with a TypeScript/Express backend for managing leads and authentication.

## Repository structure

- `backend/` — Express + TypeScript API server

## Backend setup

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `backend/` with the following values:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/your-database-name
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment variables

- `MONGO_URI` — MongoDB connection string
- `PORT` — HTTP port for the API (default: `5000`)

## Notes

- The backend uses `mongoose` to connect to MongoDB.
- If MongoDB is not running locally, update `MONGO_URI` to point to a valid MongoDB instance.
