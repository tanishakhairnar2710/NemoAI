# NemoAI - AI-Powered Learning Assistant

A production-ready AI-powered learning platform that transforms uploaded study materials into summaries, flashcards, quizzes, mnemonics, and learning analytics. Built with React, TypeScript, FastAPI, and SQLite.

---

# Table of Contents

- Overview
- Features
- Tech Stack
- Prerequisites
- Installation
- Running the Application
- Project Structure
- System Architecture
- Application Workflow
- Web Pages
- API Endpoints
- Deployment
- Development
- Testing
- Security
- Troubleshooting
- Support
- License
- Author

---

# Overview

NemoAI is an AI-powered learning platform designed to help students learn more efficiently from digital study materials.

Users can upload PDF or TXT documents and instantly generate AI-powered learning resources including:

- Document Summaries
- Flashcards
- Quizzes
- Mnemonics
- Learning Analytics

The application provides a clean dashboard where users can organize documents and monitor their learning progress.

---

# Features

## Core Features

### ✅ User Authentication

- Secure user registration
- Secure login
- JWT Authentication
- Password hashing

---

### ✅ Document Management

- Upload PDF documents
- Upload TXT documents
- Store user documents
- View uploaded documents
- Delete uploaded documents

---

### ✅ AI Summary Generator

- Automatic document summarization
- Key point extraction
- Quick revision notes

---

### ✅ Flashcard Generator

- AI-generated flashcards
- Question-answer learning format
- Interactive revision

---

### ✅ Quiz Generator

- Automatically generated quizzes
- Multiple learning questions
- Improve concept retention

---

### ✅ Mnemonic Generator

- Memory-friendly mnemonics
- Easy concept recall
- AI-assisted learning aids

---

### ✅ Learning Analytics

- Total uploaded documents
- Learning activity
- Generated resources
- Progress overview

---

### ✅ Responsive User Interface

- Mobile-friendly layout
- Modern dashboard
- Clean navigation
- Responsive design

---

# Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

---

## Backend

- FastAPI
- Python
- SQLAlchemy
- Pydantic
- JWT Authentication
- Passlib

---

## Database

- SQLite

---

## AI Services

- Rule-Based AI Engine
- LLM Ready Architecture

---

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: SQLite (Upgradeable to PostgreSQL)

---

# Prerequisites

- Node.js 18+
- Python 3.11+
- Git

---

# Installation

## Step 1: Clone Repository

```bash
git clone https://github.com/<username>/NemoAI.git

cd NemoAI
```

---

## Step 2: Backend Setup

```bash
cd backend
```

Create virtual environment

### Windows

```bash
python -m venv .venv

.venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv .venv

source .venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Step 3: Frontend Setup

Open another terminal

```bash
cd NemoAI
```

Install packages

```bash
npm install
```

---

# Running the Application

## Start Backend

```bash
cd backend

python -m uvicorn app.main:app --reload
```

Backend URL

```
http://localhost:8000
```

API Documentation

```
http://localhost:8000/docs
```

---

## Start Frontend

```bash
npm run dev
```

Frontend URL

```
http://localhost:5173
```

---

# Project Structure

```
NemoAI/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

# System Architecture

```
                   +----------------------+
                   |   React Frontend     |
                   +----------+-----------+
                              |
                       REST API Calls
                              |
                              ▼
                 +-------------------------+
                 |    FastAPI Backend      |
                 +-----------+-------------+
                             |
       ------------------------------------------------
       |              |              |                |
       ▼              ▼              ▼                ▼
 Authentication   Document      AI Processing    Analytics
     (JWT)       Management        Engine        Dashboard
       |              |              |                |
       ------------------------------------------------
                             |
                             ▼
                     SQLite Database
```

---

# Application Workflow

```
User Registration / Login
            │
            ▼
Upload PDF / TXT Document
            │
            ▼
Document Processing
            │
            ▼
AI Processing Engine
            │
            ├── Summary
            ├── Flashcards
            ├── Quiz
            ├── Mnemonics
            └── Analytics
            │
            ▼
Interactive Learning Dashboard
```

---

# Web Pages

| Page | Description |
|------|-------------|
| Home | Landing Page |
| Login | User Login |
| Signup | User Registration |
| Dashboard | User Dashboard |
| Upload Document | Upload Study Material |
| Documents | Uploaded Documents |
| Summary | AI Summary |
| Flashcards | Flashcard Learning |
| Quiz | Quiz Generation |
| Mnemonics | Memory Aids |
| Analytics | Learning Analytics |
| Profile | User Profile |

**Total Pages:** **12**

---

# API Endpoints

## Authentication

```
POST    /signup
POST    /login
```

---

## Documents

```
POST    /upload
GET     /documents
GET     /documents/{id}/summary
DELETE  /documents/{id}
```

---

## AI Services

```
GET     /flashcards/{document_id}
GET     /quiz/{document_id}
GET     /mnemonics/{document_id}
GET     /analytics
```

---

# Deployment

## Backend (Render)

- Create Render account
- Connect GitHub repository
- Create Web Service
- Install dependencies

```bash
pip install -r requirements.txt
```

Start command

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

Configure environment variables

```
DATABASE_URL
SECRET_KEY
ENVIRONMENT
```

---

## Frontend (Vercel)

- Create Vercel account
- Import GitHub repository
- Deploy

Environment Variable

```
VITE_API_URL
```

---

# Development

## Code Standards

- React Best Practices
- TypeScript
- FastAPI
- Modular Architecture
- Responsive Design

---

## Adding New Features

```bash
git checkout -b feature/feature-name
```

Commit

```bash
git commit -m "Added feature"
```

Push

```bash
git push origin feature/feature-name
```

Create Pull Request.

---

# Testing

Backend

```bash
cd backend

pytest
```

Frontend

```bash
npm test
```

---

# Security

- JWT Authentication
- Password Hashing
- Protected API Routes
- CORS Configuration
- SQL Injection Prevention
- Input Validation
- Secure Password Storage

---

# Troubleshooting

## Backend

### Import Errors

```bash
pip install -r requirements.txt
```

### Port Already in Use

```bash
python -m uvicorn app.main:app --reload --port 8001
```

---

## Frontend

### Package Errors

```bash
npm install
```

### Port Already in Use

```bash
npm run dev -- --port 5174
```

---

# Support

For bug reports, feature requests, or improvements, please create an issue in the GitHub repository.

---

# License

This project is released under the MIT License.

---

# Author

**Tanisha Khairnar**

📧 Email: **khairnar.tanisha@gmail.com**
