# Task Management App

A full-stack task management web application with role-based access control (Admin/Member), built with **Spring Boot** (backend) and **React** (frontend).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security + JWT |
| Database | MySQL + Spring Data JPA |
| Frontend | React 18, React Router, Axios |
| Build Tool | Maven |

---

## Features

- JWT-based authentication (Signup / Login)
- Role-based access control — **Admin** and **Member**
- Project creation and team management
- Task creation, assignment and status tracking
- Dashboard with task stats and overdue detection
- Member list with promote / demote / delete (Admin only)
- Environment variable based configuration

---

## Project Structure

```
task-management/
├── src/main/java/com/taskmanager/
│   ├── config/          # JWT, Security, CORS, AuthHelper
│   ├── controller/      # Auth, Project, Task, Dashboard, User
│   ├── dto/             # Request / Response objects
│   ├── entity/          # User, Project, ProjectMember, Task
│   ├── enums/           # Role, TaskStatus
│   ├── exception/       # GlobalExceptionHandler, ResourceNotFoundException
│   ├── repository/      # JPA repositories
│   └── service/         # Business logic
├── src/main/resources/
│   └── application.properties
├── frontend/
│   └── src/
│       ├── components/  # Navbar
│       ├── pages/       # Login, Signup, Dashboard, Projects, Tasks, Members
│       ├── api.js       # Axios instance with JWT interceptor
│       └── auth.js      # Auth helpers
├── .env                 # Local env vars (not committed)
├── .env.example         # Template for env vars
└── pom.xml
```

---

## Role Permissions

| Action | Admin | Member |
|---|---|---|
| Signup / Login | ✅ | ✅ |
| View projects | All | Assigned only |
| Create / Delete project | ✅ | ❌ |
| Add members to project | ✅ | ❌ |
| Create / Delete task | ✅ | ❌ |
| Update any task | ✅ | ❌ |
| Update own task status | ✅ | ✅ |
| View dashboard | All tasks | Own tasks only |
| View members list | ✅ | ❌ |
| Promote / Demote members | ✅ | ❌ |

---

## Getting Started

### Prerequisites

- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-management.git
cd task-management
```

---

### 2. Configure Environment Variables

A `.env` file has been created with local runnable credentials. If you need to customize it, edit the `.env` file:

```env
DB_URL=jdbc:mysql://localhost:3306/task_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=<your-db-password>
JWT_SECRET=<your-base64-encoded-256bit-secret>
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGIN=http://localhost:3000
REACT_APP_API_URL=http://localhost:8080/api
```

**Note:** Set your MySQL password in `DB_PASSWORD` and generate a secure JWT secret for `JWT_SECRET`.

---

### 3. Run the Backend

#### Option A — IntelliJ IDEA
1. Open project → File → Open → select `pom.xml` → Open as Project
2. Go to `Run → Edit Configurations → Environment Variables`
3. Add all variables from `.env`
4. Run `TaskManagementApplication`

#### Option B — Terminal
```bash
mvn spring-boot:run
```

The application will automatically read environment variables from the `.env` file.

Backend runs on → `http://localhost:8080`

---

### 4. Run the Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on → `http://localhost:3000`

---

## API Reference

### Auth
```
POST /api/auth/signup       Register a new user
POST /api/auth/login        Login and get JWT token
POST /api/auth/promote      Promote user to Admin by email  [ADMIN]
```

### Projects
```
GET    /api/projects              List projects
POST   /api/projects              Create project             [ADMIN]
GET    /api/projects/{id}         Get project by ID
POST   /api/projects/{id}/members Add member to project      [ADMIN]
DELETE /api/projects/{id}         Delete project             [ADMIN]
```

### Tasks
```
GET    /api/projects/{id}/tasks   List tasks in project
POST   /api/projects/{id}/tasks   Create task                [ADMIN]
GET    /api/tasks/my              Get my assigned tasks      [MEMBER]
PUT    /api/tasks/{id}            Update task                [ADMIN]
PATCH  /api/tasks/{id}/status     Update task status         [ALL]
DELETE /api/tasks/{id}            Delete task                [ADMIN]
```

### Dashboard
```
GET /api/dashboard          Get stats and task list (role-filtered)
```

### Users
```
GET    /api/users              List all users               [ADMIN]
POST   /api/users/{id}/promote Promote to Admin             [ADMIN]
POST   /api/users/{id}/demote  Demote to Member             [ADMIN]
DELETE /api/users/{id}         Delete user                  [ADMIN]
```

> All endpoints except `/api/auth/**` require `Authorization: Bearer <token>` header.

---

## Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/login` | Sign In | Public |
| `/signup` | Create Account | Public |
| `/dashboard` | Stats + Task list | All |
| `/projects` | Project management | All |
| `/tasks` | Task list | All |
| `/members` | Member management | Admin only |

---

## Database Schema

```
users
  id, name, email, password, role

projects
  id, name, description, owner_id

project_members
  id, user_id, project_id, role

tasks
  id, title, description, status, due_date, assignee_id, project_id
```

---

## Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `DB_URL` | MySQL JDBC connection URL | `jdbc:mysql://localhost:3306/task_db` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | `yourpassword` |
| `JWT_SECRET` | Base64 encoded secret key (min 256-bit) | `404E6352...` |
| `JWT_EXPIRATION` | Token expiry in milliseconds | `86400000` (24h) |

---

## First Time Setup

```
1. Start MySQL
2. Run backend → database auto-created via ddl-auto=update
3. Run frontend
4. Go to http://localhost:3000/signup
5. First user to sign up → automatically gets ADMIN role
6. All subsequent signups → MEMBER role (can be promoted by Admin)
```

---

## Security Notes

- Passwords are hashed using BCrypt
- JWT tokens are signed with HMAC-SHA256
- Role is embedded in JWT — cannot be tampered from frontend
- `.env` is excluded from git via `.gitignore`
- CORS is restricted to `http://localhost:3000`
