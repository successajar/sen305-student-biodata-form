'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const dataDirectory = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDirectory, { recursive: true });

const db = new DatabaseSync(path.join(dataDirectory, 'students.sqlite'));
db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS student_biodata (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    state_of_origin TEXT NOT NULL,
    matric_number TEXT NOT NULL COLLATE NOCASE UNIQUE,
    department TEXT NOT NULL,
    faculty TEXT NOT NULL,
    level TEXT NOT NULL,
    programme TEXT NOT NULL,
    entry_year INTEGER NOT NULL,
    institution TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const insertStudent = db.prepare(`
  INSERT INTO student_biodata (
    first_name, last_name, date_of_birth, gender, email, phone,
    state_of_origin, matric_number, department, faculty, level,
    programme, entry_year, institution
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

function saveStudent(s) {
  const result = insertStudent.run(
    s.firstName, s.lastName, s.dateOfBirth, s.gender, s.email, s.phone,
    s.stateOfOrigin, s.matricNumber, s.department, s.faculty, s.level,
    s.programme, Number(s.entryYear), s.institution
  );
  return Number(result.lastInsertRowid);
}

module.exports = { saveStudent };
