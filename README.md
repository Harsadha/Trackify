# Trackify — Campus Lost & Found Management System

Trackify is a full-stack web application designed to help students report and recover lost and found items on campus. It provides a secure, user-friendly interface, 
enabling users to submit, search, and manage lost or found items. The project demonstrates a modern full-stack architecture using React.js, Node.js, Express, MySQL 
and Sequelize ORM.

---

## **Table of Contents**

- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Database Design](#database-design)  
- [API Endpoints](#api-endpoints)  
- [Authentication & Security](#authentication--security)  
- [Installation & Setup](#installation--setup)  
- [Project Architecture & Data Flow](#project-architecture--data-flow)
- [Step-by-step Flow](#step-by-step-Flow)


---

## **Features**

- User authentication and registration using **JWT** (stateless session management)  
- Submit, update, and delete lost/found items  
- View all items or filter by type, category, and search keywords  
- Dashboard for users to manage their items  
- Responsive SPA using **React.js** with a dark-themed design  
- RESTful API backend with **Node.js** and **Express.js**  
- Relational **MySQL** database with **Sequelize ORM** for robust data management  

---

## **Technology Stack**

| Layer           | Technology                   | Justification |
|-----------------|------------------------------|---------------|
| Frontend        | React.js v18                 | Component-based SPA architecture; fast UI updates with virtual DOM |
| Styling         | Custom CSS + Variables       | Dark-theme design system with brand identity |
| Backend         | Node.js + Express.js         | Lightweight, non-blocking I/O ideal for REST API |
| Database        | MySQL + Sequelize ORM        | Relational schema enforces integrity; ORM simplifies JS queries |
| Authentication  | JWT (JSON Web Tokens)        | Stateless auth, secure, scalable session management |
| Routing         | React Router v6              | Declarative client-side routing |
| State Management| React Context API            | Lightweight global state management |
| Version Control | Git + GitHub                 | Branch-based collaboration and history tracking |

---

## **Database Design**

### Users Table

| Column        | Type       | Description                        |
|---------------|-----------|------------------------------------|
| id            | INT       | Primary key, auto-increment        |
| name          | VARCHAR   | Full name of user                  |
| email         | VARCHAR   | Unique email address               |
| passwordHash  | VARCHAR   | bcrypt hashed password             |
| createdAt     | DATETIME  | Account creation timestamp         |
| updatedAt     | DATETIME  | Last updated timestamp             |

### Items Table

| Column      | Type       | Description                         |
|-------------|-----------|-------------------------------------|
| id          | INT       | Primary key, auto-increment         |
| title       | VARCHAR   | Short descriptive title             |
| description | TEXT      | Detailed item description           |
| type        | ENUM      | "lost" or "found"                   |
| category    | VARCHAR   | e.g., Electronics, Documents       |
| imageUrl    | VARCHAR   | Optional image URL                  |
| location    | VARCHAR   | Where the item was lost/found      |
| userId      | INT       | Foreign key → users.id (owner)     |
| createdAt   | DATETIME  | Auto-managed                        |
| updatedAt   | DATETIME  | Auto-managed                        |

---

## **API Endpoints**
Base URL: `http://localhost:5000/api`

### **Auth Routes**

| Method | Endpoint             | Description            |
|--------|---------------------|------------------------|
| POST   | /api/auth/register  | Register new user      |
| POST   | /api/auth/login     | Login user             |

### **Item Routes**

| Method | Endpoint                | Auth | Description                |
|--------|------------------------|------|----------------------------|
| GET    | /api/items             | No   | Get all items              |
| POST   | /api/items             | Yes  | Create new item            |
| GET    | /api/items/:id         | No   | Get item by ID             |
| PUT    | /api/items/:id         | Yes  | Update item (owner only)   |
| DELETE | /api/items/:id         | Yes  | Delete item (owner only)   |
| GET    | /api/items/user/me     | Yes  | Get user's items           |


---

## **Authentication & Security**
- Passwords hashed with bcrypt before storage  
- JWT tokens signed with a secret key and 7-day expiry
- Owner-based authorization for updating or deleting items
- Sequelize validations and constraints ensure data integrity

---
  
## **Installation & Setup**
1. Clone the repository
```bash
git clone https://github.com/Harsadha/Trackify.git
cd Trackify
```
2. Backend Setup
```bash
cd server
npm install
```
3. Create .env in server/:
```.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=trackify
JWT_SECRET=your_super_secret_key
PORT=5000
```
4. Frontend Setup
```bash
cd ../client
npm install
npm start
```
5. Database Setup
Create a MySQL database named lost_found_db
Sequelize will automatically sync models to create tables

6. Start Backend Server
```bash
cd ../server
npm run dev
```

--- 

## **Project Architecture & Data Flow**

Three-tier Architecture (MVC-like):

Client (React SPA) <--> REST API (Express) <--> MySQL (Sequelize)

---

## **Step-by-step Flow:**

1. User interacts with React SPA
2. React components dispatch HTTP requests (Axios/fetch)
3. Express middleware validates requests and verifies JWT token if required
4. Sequelize queries MySQL to create, read, update, or delete data
5. API responds with structured JSON
6. React updates state via Context API, triggering UI re-render

---

GitHub Repository: https://github.com/Harsadha/Trackify
