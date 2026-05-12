# Online Complaint Management System (MERN)

This project is a full-stack MERN app with two roles:
- Citizen: can create and track complaints
- Admin: can view, assign, and update complaint status

## Folder Structure

```text
OnlineComplaint/
  backend/
  frontend/
```

---

## 1) Backend Setup (generated first)

### Backend important folders

- `backend/src/config`: DB connection
- `backend/src/models`: Mongoose schemas (`User`, `Complaint`)
- `backend/src/controllers`: API business logic
- `backend/src/routes`: Route definitions
- `backend/src/middleware`: Auth, role and file upload middleware
- `backend/uploads`: Uploaded files (Multer)

### Backend APIs

#### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

#### Complaints
- `POST /api/complaints` (Citizen + file upload)
- `GET /api/complaints/user` (Citizen own complaints)
- `GET /api/complaints` (Admin all complaints + filters)
- `PUT /api/complaints/:id/status` (Admin status update)
- `PUT /api/complaints/:id/assign` (Admin assign complaint)
- `GET /api/complaints/admins` (Admin list for assignment)
- `GET /api/complaints/stats/public` (Public statistics)

### Status State Machine

Allowed transitions:
- `Pending -> In Progress`
- `In Progress -> Resolved`
- `In Progress -> Rejected`

Invalid transitions return `400` with a clear message.

### Backend run commands

```bash
cd backend
npm install
copy .env.example .env
# Edit .env with your values
npm run dev
```

### Atlas Setup

- Create a MongoDB Atlas cluster and database user.
- Add your current IP address to the Atlas Network Access list.
- Use the Atlas connection string in `backend/.env` or copy it from `backend/.env.example`.
- If SRV lookups fail in your environment, use the standard Atlas seedlist URI format instead of `mongodb+srv`.

---

## 2) Frontend Setup (generated after backend)

### Frontend important folders

- `frontend/src/pages`: Login, Register, Citizen/Admin/Public dashboards
- `frontend/src/components`: Reusable UI + route protection
- `frontend/src/context`: Authentication state management
- `frontend/src/api`: Axios client with JWT interceptor
- `frontend/src/layouts`: Shared layout and navbar

### Frontend Features

- Login/Register with JWT auth
- Role-based route access
- Citizen:
  - complaint creation form
  - file upload
  - complaint history (status, priority, department, created/updated date, rating)
- Admin:
  - all complaints list
  - search by title
  - filter by status/priority/department
  - assign complaint to admin
  - update status
- Public dashboard:
  - total complaints
  - pending complaints
  - resolved complaints
  - department-wise counts
- Toast notifications for success/error

### Frontend run commands

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

---

## Notes

- Backend default URL: `http://localhost:5000`
- Frontend default URL: `http://localhost:5173`
- Update `frontend/.env` if backend runs on another host/port.
- MongoDB Atlas is supported for backend storage; make sure your Atlas IP allowlist includes this machine.
