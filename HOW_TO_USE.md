# 🏥 Clinic Management System Backend - How to Use Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation & Setup](#installation--setup)
3. [Running the Application](#running-the-application)
4. [API Usage](#api-usage)
5. [Authentication](#authentication)
6. [Common Operations](#common-operations)
7. [Troubleshooting](#troubleshooting)
8. [Deployment](#deployment)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** (v9.x or higher) - comes with Node.js
- **PostgreSQL** (v14.x or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** - VS Code recommended

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/OmarIhsan/Tech-Hub-project-Clinic_Management_System-BackEnd.git
cd Tech-Hub-project-Clinic_Management_System-BackEnd
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_NAME=Tech-Hub-CMS

# Application
NODE_ENV=development
PORT=3000

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=7d

# Optional: File Upload Limits
MAX_FILE_SIZE=10485760
```

**Important:** Replace `your_password_here` and `JWT_SECRET` with your actual values.

### Step 4: Create Database

Open PostgreSQL and create the database:

```sql
CREATE DATABASE "Tech-Hub-CMS";
```

Or using command line (Windows PowerShell):

```powershell
psql -U postgres -c "CREATE DATABASE \"Tech-Hub-CMS\";"
```

### Step 5: Run Database Migrations

The application will auto-sync the database schema on first run (development only).

```bash
npm run start:dev
```

---

## Running the Application

### Development Mode (with hot-reload)

```bash
npm run start:dev
```

Server will start at: `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start:prod
```

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Lint & Format Code

```bash
# Run ESLint
npm run lint

# Auto-fix lint issues
npm run lint -- --fix

# Format with Prettier
npm run format
```

---

## API Usage

### Base URL

```
Local: http://localhost:3000
Production: https://your-domain.com
```

### API Documentation

Once the server is running, access interactive API docs at:

```
http://localhost:3000/api/docs
```

(Note: Swagger documentation will be added in future updates)

---

## Authentication

### Register a New User

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "Dr. John Doe",
  "email": "john.doe@clinic.com",
  "password": "SecurePassword123!",
  "role": "DOCTOR"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Dr. John Doe",
  "email": "john.doe@clinic.com",
  "role": "DOCTOR"
}
```

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john.doe@clinic.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Dr. John Doe",
    "email": "john.doe@clinic.com",
    "role": "DOCTOR"
  }
}
```

### Using the Token

Include the token in all subsequent requests:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example using curl:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" http://localhost:3000/patients
```

**Example using Postman:**
1. Go to **Authorization** tab
2. Select **Bearer Token**
3. Paste your token

---

## Common Operations

### 1. Patient Management

#### Create a Patient

**Endpoint:** `POST /patients`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "dateOfBirth": "1990-05-15",
  "gender": "Female",
  "phone": "+1234567890",
  "email": "jane.smith@email.com",
  "address": "123 Main St, City, State 12345",
  "allergies": ["Penicillin", "Peanuts"],
  "medicalConditions": ["Hypertension"],
  "emergencyContact": {
    "name": "John Smith",
    "relationship": "Spouse",
    "phone": "+1234567891"
  }
}
```

#### Get All Patients

**Endpoint:** `GET /patients?offset=0&limit=10`

**Query Parameters:**
- `offset` - Skip number of records (default: 0)
- `limit` - Number of records to return (default: 10)
- `search` - Search by name or email

#### Get Patient by ID

**Endpoint:** `GET /patients/:id`

#### Update Patient

**Endpoint:** `PUT /patients/:id`

#### Delete Patient

**Endpoint:** `DELETE /patients/:id` (SUPER_ADMIN only)

---

### 2. Appointment Management

#### Create an Appointment

**Endpoint:** `POST /appointments`

**Request Body:**
```json
{
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2025-10-20T10:00:00Z",
  "reason": "Regular checkup",
  "status": "SCHEDULED"
}
```

**Status Options:** `SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`

#### Get Appointments with Filters

**Endpoint:** `GET /appointments?dateFrom=2025-10-01&dateTo=2025-10-31&status=SCHEDULED`

**Query Parameters:**
- `offset`, `limit` - Pagination
- `dateFrom`, `dateTo` - Date range filter (ISO format)
- `status` - Filter by status
- `doctorId` - Filter by doctor
- `patientId` - Filter by patient

#### Update Appointment Status

**Endpoint:** `PUT /appointments/:id`

**Request Body:**
```json
{
  "status": "COMPLETED",
  "notes": "Patient completed checkup successfully"
}
```

---

### 3. Medical Records

#### Create Medical Record

**Endpoint:** `POST /medical-records`

**Request Body:**
```json
{
  "patientId": 1,
  "diagnosis": "Type 2 Diabetes",
  "findings": "Elevated blood sugar levels, HbA1c at 7.8%",
  "medications": ["Metformin 500mg", "Insulin"],
  "attachments": ["lab-results-2025-10-17.pdf"]
}
```

#### Get Patient's Medical History

**Endpoint:** `GET /medical-records?patientId=1`

---

### 4. Treatment Plans

#### Create Treatment Plan

**Endpoint:** `POST /treatment-plans`

**Request Body:**
```json
{
  "patientId": 1,
  "diagnosis": "Type 2 Diabetes Management",
  "prescriptions": [
    "Metformin 500mg twice daily",
    "Monitor blood glucose daily",
    "Follow-up in 2 weeks"
  ],
  "status": "ACTIVE"
}
```

**Status Options:** `ACTIVE`, `COMPLETED`, `CANCELLED`

---

### 5. Staff Management

#### Create Staff Member

**Endpoint:** `POST /staff` (ADMIN/SUPER_ADMIN only)

**Request Body:**
```json
{
  "name": "Sarah Johnson",
  "email": "sarah.j@clinic.com",
  "phone": "+1234567892",
  "role": "NURSE",
  "hireDate": "2025-01-15"
}
```

**Role Options:** `ADMIN`, `SUPER_ADMIN`, `DOCTOR`, `NURSE`, `RECEPTIONIST`

---

### 6. Financial Management

#### Record Expense

**Endpoint:** `POST /expenses`

**Request Body:**
```json
{
  "amount": 1500.00,
  "category": "MEDICAL_SUPPLIES",
  "date": "2025-10-17",
  "description": "Syringes, gauze, and bandages"
}
```

#### Record Other Income

**Endpoint:** `POST /other-incomes`

**Request Body:**
```json
{
  "amount": 2000.00,
  "source": "Laboratory services",
  "date": "2025-10-17",
  "notes": "External lab tests processed"
}
```

---

### 7. File Uploads

#### Upload Clinical Document

**Endpoint:** `POST /clinical-documents`

**Request:** `multipart/form-data`

```bash
curl -X POST http://localhost:3000/clinical-documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "patientId=1" \
  -F "title=Lab Results" \
  -F "documentType=LAB_REPORT" \
  -F "file=@/path/to/document.pdf" \
  -F "notes=Blood work results"
```

#### Upload Patient Image

**Endpoint:** `POST /patient-images`

**Request:** `multipart/form-data`

```bash
curl -X POST http://localhost:3000/patient-images \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "patientId=1" \
  -F "imageType=X_RAY" \
  -F "file=@/path/to/xray.jpg" \
  -F "notes=Chest X-ray"
```

---

## Troubleshooting

### Common Issues

#### 1. **Database Connection Error**

**Error:** `error: password authentication failed for user "postgres"`

**Solution:**
- Verify PostgreSQL is running
- Check DB_USERNAME and DB_PASSWORD in `.env`
- Ensure database exists: `CREATE DATABASE "Tech-Hub-CMS";`

#### 2. **Port Already in Use**

**Error:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```powershell
# Windows PowerShell - Find and kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or change PORT in .env file
PORT=3001
```

#### 3. **JWT Token Invalid**

**Error:** `401 Unauthorized`

**Solution:**
- Token might be expired (default: 7 days)
- Login again to get a new token
- Verify JWT_SECRET matches between server restarts

#### 4. **Module Not Found**

**Error:** `Cannot find module '@nestjs/...'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. **TypeORM Synchronize Issues**

**Error:** `Relations/columns missing or schema mismatch`

**Solution for development:**
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE \"Tech-Hub-CMS\";"
psql -U postgres -c "CREATE DATABASE \"Tech-Hub-CMS\";"
npm run start:dev
```

---

## Deployment

### Deploy to Vercel (Serverless)

#### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Ensure `api/index.ts` and `vercel.json` exist in project root

#### Steps

1. **Set Environment Variables in Vercel Dashboard:**
   - DATABASE_URL (PostgreSQL connection string)
   - JWT_SECRET
   - NODE_ENV=production

2. **Deploy:**
```bash
vercel --prod
```

3. **Monitor Logs:**
```bash
vercel logs
```

### Deploy to Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create clinic-management-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to AWS/DigitalOcean

1. Set up a VPS with Node.js and PostgreSQL
2. Clone repository
3. Install dependencies: `npm install --production`
4. Build: `npm run build`
5. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start dist/main.js --name clinic-backend
pm2 save
pm2 startup
```

---

## Best Practices

### Security
- ✅ Never commit `.env` file to Git
- ✅ Use strong JWT_SECRET (32+ random characters)
- ✅ Enable HTTPS in production
- ✅ Implement rate limiting for API endpoints
- ✅ Validate file uploads (type, size)
- ✅ Sanitize user inputs

### Database
- ✅ Use migrations in production (set `synchronize: false`)
- ✅ Regular backups
- ✅ Use connection pooling for serverless
- ✅ Add indexes for frequently queried fields

### Code Quality
- ✅ Run `npm run lint` before committing
- ✅ Write tests for critical business logic
- ✅ Follow consistent naming conventions
- ✅ Document complex functions

---

## Additional Resources

- **NestJS Documentation:** https://docs.nestjs.com/
- **TypeORM Documentation:** https://typeorm.io/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/

---

## Support

For issues and questions:
- Open an issue on GitHub: [Tech-Hub-project-Clinic_Management_System-BackEnd/issues](https://github.com/OmarIhsan/Tech-Hub-project-Clinic_Management_System-BackEnd/issues)
- Email: support@clinic-management.com

---

**Last Updated:** October 17, 2025  
**Version:** 1.0.0
