# 🏥 Clinic Management System — Backend

A production-oriented backend for managing clinic operations: patients, doctors, staff, appointments, medical records, treatment plans, procedures, finances, and clinical documents (uploads).

This README explains the codebase, how to run it locally, environment variables, common flows, endpoints overview, and recommended next steps for production readiness.

---

## Table of contents

- About
- Quick start (local development)
- Environment variables
- Database / migrations
- Available scripts
- Project structure (modules & responsibilities)
- Authentication & RBAC
- File uploads
- Important endpoints & example requests
- Tests and CI
- Troubleshooting
- Production checklist & recommendations
- Contributing

---

## About

This repository implements the backend API for a Clinic Management System built with NestJS and TypeORM (Postgres). It provides the core business features needed by a small-to-medium clinic:

- User/staff management, roles and JWT authentication
- Doctors, Patients and Staff CRUD
- Appointment scheduling and search
- Medical records, procedures and treatment plans (linked to patients and appointments)
- Financial modules: expenses and other incomes
- Upload and serve clinical documents and patient medical images
- Basic API documentation with Swagger decorators

The project follows a modular NestJS layout (each domain has its own module, controller, service, DTOs and entities) to keep responsibilities isolated and testable.

---

## Quick start (local development)

Prerequisites
- Node.js (recommended v18 LTS)
- npm (or yarn)
- PostgreSQL (local or remote)

Clone and install

```powershell
git clone <repo-url>
cd Tech-Hub-project-Clinic_Management_System-BackEnd
npm install
```

Set environment variables (see next section). Then run the app in development mode:

```powershell
npm run start:dev
```

Open Swagger (if enabled) at `http://localhost:3000/api` (or the configured Swagger path) to explore endpoints and DTOs.

---

## Environment variables

Create a `.env` in the project root or configure env in your environment. Common variables used by this project:

- `NODE_ENV` — `development` | `production`
- `PORT` — server port (default 3000)
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` — Postgres connection details
- `JWT_SECRET` — secret used to sign JWT tokens; keep this secure
- `JWT_EXPIRATION` — token lifetime (e.g., `3600s`)

Example `.env` (local only)

```env
NODE_ENV=development
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=clinic_user
DB_PASS=clinic_pass
DB_NAME=clinic_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=3600s
```

Note: Some code paths may use ConfigService — ensure environment variables are loaded consistently.

---

## Database & migrations

This project uses TypeORM entities under `src/**/entities`. For production deployments you should use explicit migrations rather than `synchronize`.

Recommended workflow:

1. Configure TypeORM CLI or use `typeorm` to create migrations.
2. Maintain a migrations directory and apply migrations during deploy: `npm run typeorm migration:run` (or equivalent).

If you are running locally for development you can enable `synchronize` in a development-only config to auto-create tables, but do **not** use it in production.

---

## Available scripts (common)

> Use `npm run` to list scripts. Common scripts you will see or want to add:

- `npm run start:dev` — start in watch mode (NestJS)
- `npm run build` — compile TypeScript to `dist/`
- `npm run start:prod` — run compiled app (`node dist/main`)
- `npm run lint` — run ESLint
- `npm test` / `npm run test:e2e` — run tests (if configured)

---

## Project structure (high level)

Key folders under `src/` (one module per folder):

- `auth/` — authentication, JWT strategy, guards, decorators
- `staff/` — staff entity, CRUD, roles
- `doctors/` — doctors entity and business logic (doctor ↔ staff linking)
- `patients/` — patients CRUD and relations
- `appointments/` — scheduling, search endpoints
- `medical-records/` — records, `current_meds_json` field
- `treatment-plans/`, `procedures/` — clinical workflows
- `patient-images/`, `clinical-documents/` — file upload & serving
- `expenses/`, `other-incomes/` — finance modules

Each module contains `controller.ts` (HTTP layer), `service.ts` (business logic), `dto/` (validation shapes), and `entities/` (TypeORM models).

---

## Authentication & Role-Based Access Control (RBAC)

- The project uses JWT tokens for authentication. Tokens are signed with `JWT_SECRET`.
- Guards:
	- `JwtAuthGuard` validates token and populates `request.user`.
	- `RolesGuard` checks roles from the `@Roles(...)` decorator on controllers/actions.
- Roles are defined in `src/common/enums/status.enums.ts` (`OWNER`, `DOCTOR`, `STAFF`).

Best practice: the server should derive `actor` fields such as `uploaded_by_staff_id` or `doctor_id` from `request.user` (token) rather than trusting client input. Consider implementing `@CurrentUser()` injection for service-level checks.

---

## File uploads

- Patient images saved under `uploads/patient-images` (multer config in `src/patient-images/multer.config.ts`). Allowed image mime types and a max size of 5 MB are enforced.
- Clinical documents saved under `uploads/clinical_documents` (multer config in `src/clinical-documents/multer.config.ts`). File types and limits are enforced there.
- Public file endpoints exist (e.g., `/patient-images/file/:filename`, `/clinical-documents/file/:filename`). Evaluate whether these should be public or require authentication for your privacy needs.

---

## Important endpoints & example requests

Set `BASE_URL=http://localhost:3000`.

1) Register / Login (Auth)

- POST `/auth/register` — register (if implemented)
- POST `/auth/login` — { email, password } → returns JWT

Example curl (login):
```bash
curl -X POST $BASE_URL/auth/login -H "Content-Type: application/json" -d '{"email":"doc@example.com","password":"secret"}'
```

2) Create patient (Staff/Doctor/Owner)
- POST `/patients` — JSON body matching `CreatePatientDto`.

3) Create appointment (Staff/Doctor/Owner)
- POST `/appointment` — `CreateAppointmentDto` (patient_id, doctor_id, appointment_time, etc.)

4) Upload clinical document (Doctor/Staff/Owner)
- POST `/clinical-documents/upload` (multipart/form-data)
	- fields: `file`, `patient_id`, `appointment_id`, `document_type`, `consent_version`, `case_sheet`

Example curl (single file):
```bash
curl -X POST "$BASE_URL/clinical-documents/upload" \
	-H "Authorization: Bearer <TOKEN>" \
	-F "file=@/path/to/doc.pdf" \
	-F "patient_id=1" \
	-F "appointment_id=10" \
	-F "document_type=Discharge Summary" \
	-F "consent_version=v1"
```

5) Upload patient image (Doctor/Staff/Owner)
- POST `/patient-images/upload` (multipart/form-data)
	- fields: `file`, `patient_id`, `image_type`, `uploaded_by_staff_id`, `notes`

---

## Tests and CI

- Tests are currently lightweight. Add unit tests for services (auth, transactional flows, upload handling) and integration tests for critical flows.
- Add CI pipeline (GitHub Actions) to run `npm run lint`, `npm run build`, and tests on PRs.

---

## Troubleshooting

- CORS errors: enable CORS in `src/main.ts` with `app.enableCors()` for local frontend dev.
- `Cannot find module 'dist/main'`: run `npm run build` before `npm run start:prod`.
- DB sync errors (e.g., setting NOT NULL on existing columns): inspect DB rows and run migrations or backfill before altering constraints.

---

## Production checklist & recommendations

1. Add TypeORM migrations and avoid `synchronize: true` in production.
2. Add comprehensive tests and CI.
3. Harden file access (signed URLs / authenticated downloads for sensitive documents).
4. Use a secret manager for `JWT_SECRET` in production (don’t store in plain `.env` in repo).
5. Normalize and validate client-supplied IDs and derive actor IDs from JWT server-side.
6. Add monitoring (Sentry) and structured logging.
7. Harden security headers and rate limits for public endpoints.

---

## Contributing

- Follow the repo code style (ESLint/Prettier). Run lint and tests locally before PR.
- Write tests for any new business logic and update Swagger docs via decorators.

---

## Where to look in the code

- `src/auth` — auth flows (login, strategy, guards)
- `src/staff`, `src/doctors`, `src/patients` — main user/doctor/staff flows
- `src/appointments`, `src/medical-records`, `src/treatment-plans`, `src/procedures` — clinical flows
- `src/patient-images`, `src/clinical-documents` — file upload & serving

---

## Contact / Next steps

If you want, I can:
- Add a GitHub Actions workflow that runs lint/build/tests on PRs.
- Add starter TypeORM migration setup and one initial migration file.
- Harden auth flows (derive actor from JWT) and remove trust of client-supplied actor IDs.

Pick one and I'll prepare a PR with the changes.

---

© Clinic Management System Backend Team - QafLab 
