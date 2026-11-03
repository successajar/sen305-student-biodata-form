'use strict';

const REQUIRED = {
  firstName: 'First name',
  lastName: 'Last name',
  dateOfBirth: 'Date of birth',
  gender: 'Gender',
  email: 'Email',
  phone: 'Phone number',
  stateOfOrigin: 'State of origin',
  matricNumber: 'Matriculation number',
  department: 'Department',
  faculty: 'Faculty',
  level: 'Level',
  programme: 'Programme',
  entryYear: 'Year of admission',
  institution: 'Institution'
};

function validateStudent(input) {
  const values = {};
  const errors = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { values, errors: [{ field: null, message: 'A student record is required.' }] };
  }

  for (const [field, label] of Object.entries(REQUIRED)) {
    // Convert the numeric year to text; reject other non-string values.
    const raw = input[field];
    const value = typeof raw === 'string'
      ? raw.trim()
      : (field === 'entryYear' && Number.isInteger(raw) ? String(raw) : '');

    values[field] = value;
    if (!value) {
      errors.push({ field, message: label + ' is required.' });
    } else if (value.length > 150) {
      errors.push({ field, message: label + ' is too long (150 characters maximum).' });
    }
  }

  if (errors.length) return { values, errors };

  if (!['male', 'female', 'other', 'prefer-not-to-say'].includes(values.gender)) {
    errors.push({ field: 'gender', message: 'Select a valid gender option.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.push({ field: 'email', message: 'Enter a valid email address.' });
  }

  const normalizedPhone = values.phone.replace(/[\s()-]/g, '');
  if (!/^\+?\d{7,15}$/.test(normalizedPhone)) {
    errors.push({ field: 'phone', message: 'Enter a valid phone number (7–15 digits).' });
  }

  if (!['100', '200', '300', '400', '500'].includes(values.level)) {
    errors.push({ field: 'level', message: 'Select a valid level.' });
  }

  const year = Number(values.entryYear);
  const currentYear = new Date().getFullYear();
  if (!/^\d{4}$/.test(values.entryYear) || year < 2000 || year > currentYear) {
    errors.push({ field: 'entryYear', message: 'Enter a valid year of admission.' });
  }

  // Check exact YYYY-MM-DD; Date constructor otherwise normalizes invalid dates.
  const birth = values.dateOfBirth;
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(birth)
    ? new Date(birth + 'T00:00:00Z') : new Date(NaN);
  if (Number.isNaN(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== birth ||
      parsed.getTime() > Date.now()) {
    errors.push({ field: 'dateOfBirth', message: 'Enter a valid date of birth that is not in the future.' });
  }

  return { values, errors };
}

module.exports = { validateStudent };
