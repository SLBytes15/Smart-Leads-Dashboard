# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack + TypeScript.

---

## Tech Stack

**Frontend:** React.js, TypeScript, TailwindCSS, Vite  
**Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose  
**Auth:** JWT + bcrypt  
**DevOps:** Docker, Docker Compose  

---

## Features

- JWT-based Authentication (Register/Login)
- Role-Based Access Control (Admin / Sales)
- Lead CRUD — Create, View, Update, Delete
- Advanced Filtering by Status and Source
- Debounced Search by Name or Email
- Sort by Latest or Oldest
- Backend Pagination (10 records/page)
- CSV Export with active filters applied
- Responsive UI with loading and empty states
- Centralized error handling on both frontend and backend

---

## Project Structure
smart-leads/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
│   ├── .env.example
│   └── Dockerfile
├── docker-compose.yml
└── README.md

---

## Getting Started

### Option 1 — Docker (Recommended)

Make sure Docker is installed, then:

```bash
git clone https://github.com/yourusername/smart-leads.git
cd smart-leads

# Copy env file and add your JWT secret
cp backend/.env.example backend/.env

# Start everything with one command
docker-compose up --build
```

Visit:
- Frontend → http://localhost:5173
- Backend API → http://localhost:9000

---

### Option 2 — Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

---

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/leads` | Protected | Get leads + filters |
| POST | `/api/leads` | Protected | Create lead |
| GET | `/api/leads/export` | Protected | Export CSV |
| GET | `/api/leads/:id` | Protected | Get single lead |
| PUT | `/api/leads/:id` | Protected | Update lead |
| DELETE | `/api/leads/:id` | Admin only | Delete lead |

---

## Test Accounts

After registering, use these roles:

| Role | Can Do |
|------|--------|
| Admin | Everything — view all leads, create, edit, delete, export |
| Sales | View own leads, create, edit own leads, export |

---

## Author

Saransh Lodha
forg11370@gmail.com 
[GitHub](https://github.com/SLBytes15)