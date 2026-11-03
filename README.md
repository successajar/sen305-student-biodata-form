# SEN 305 — Student Biodata Form

**Group 8 | HTML, CSS, JavaScript, Node.js and SQLite**

## Overview
A student biodata form that validates entries in the browser, sends valid submissions to a local Node.js backend and stores them in a SQLite database. This version implements the lecturer's additional requirement to **save submitted data**.

**Privacy:** For demonstrations, use fictional records only. Do not put real student personal information or database files in this public repository.

## Features
- Personal, contact and academic biodata fields
- Required-field, email, phone, date-of-birth and admission-year validation
- Server-side validation, not just browser-side checks
- SQLite table created automatically on first server start
- Prepared SQL statements to insert valid records
- Duplicate matriculation-number protection
- Responsive CSS styling

## Setup and run

**Requirements:** Node.js 22.13 or newer and npm.

```bash
npm install
npm start
```

Open **http://localhost:3000**. Do **not** open `index.html` directly or run `python3 -m http.server` for database testing: the form now needs the Node.js backend.

When you click **Submit Biodata** with valid data, the browser sends an HTTP POST request to `/api/students`. The server validates the fields, inserts a record into SQLite and returns a success response.

On Node.js 22, the built-in SQLite module may print an **ExperimentalWarning**. It is part of Node.js; this assignment does not need a separate SQLite npm package.

## Database
The application automatically creates `data/students.sqlite` and a table named `student_biodata`. The `data/` folder is ignored by Git, so student records are **not uploaded** to GitHub.

Check example records locally:

```bash
node -e "const {DatabaseSync}=require('node:sqlite'); const db=new DatabaseSync('data/students.sqlite'); console.log(db.prepare('SELECT id, first_name, last_name, matric_number, created_at FROM student_biodata').all());"
```

The table stores all 14 form fields, along with a generated record ID and creation time. There is intentionally no public endpoint that displays stored biodata.

**Important:** This is a local classroom demonstration, not an authenticated production service for real student records. It binds to `127.0.0.1` and should not be deployed publicly without authentication, consent and appropriate security measures.

## How data flows

```text
Student -> HTML Form -> JavaScript validation
        -> POST /api/students -> Express server
        -> Server-side validation -> SQLite database
        -> Success/error message in browser
```

## Project structure
```text
sen305-student-biodata-form/
├── index.html
├── server.js
├── package.json
├── .gitignore
├── backend/
│   ├── db.js
│   └── validate.js
├── data/             # created at runtime, NOT tracked in Git
├── css/
│   ├── base.css
│   ├── form.css
│   └── responsive.css
├── js/
│   ├── required.js
│   ├── formats.js
│   └── app.js
├── CONTRIBUTING.md
└── README.md
```

## Contributions and history
Individual commits and Pull Requests document the members' work:
- Project scaffold and frontend integration: `successajar`
- Academic information: `Regina182`
- Form CSS: `1saac-ai`
- Base CSS: `Makido001`
- Responsive styling integration and database enhancement: `successajar`

Tasks originally assigned to members should not be confused with independent completed contributions. See the PR history for authorship.

## Status
- [x] HTML biodata form
- [x] CSS styling and responsive layout
- [x] Frontend validation
- [x] Backend API and SQLite database implementation on the feature branch
- [ ] Run the server locally and verify that the database saves test records
- [ ] Review/merge the storage feature Pull Request
- [ ] Submit the final repository link

> The GitHub repository URL may still use the old course code `sen307` until the repository owner renames it in GitHub Settings.
