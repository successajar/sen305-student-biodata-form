'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateStudent } = require('../backend/validate');

const valid = {
  firstName: 'Ada', lastName: 'Okoro', dateOfBirth: '2005-05-12',
  gender: 'female', email: 'ada@example.com', phone: '08012345678',
  stateOfOrigin: 'Enugu', matricNumber: 'DEMO/25/001',
  department: 'Software Engineering', faculty: 'Engineering',
  level: '200', programme: 'B.Sc.', entryYear: '2025',
  institution: 'Example University'
};

test('all 14 required fields must be present', () => {
  const result = validateStudent({});
  assert.equal(result.errors.length, 14);
});

test('valid student data passes server validation', () => {
  const result = validateStudent(valid);
  assert.deepEqual(result.errors, []);
  assert.equal(result.values.firstName, 'Ada');
});

test('incorrect email, phone, date and year are rejected', () => {
  const result = validateStudent({
    ...valid, email: 'not-an-email', phone: 'abc', dateOfBirth: '2024-02-30',
    entryYear: '2099'
  });
  const fields = result.errors.map(e => e.field);
  for (const field of ['email', 'phone', 'dateOfBirth', 'entryYear']) {
    assert.ok(fields.includes(field), field + ' should be rejected');
  }
});

test('whitespace-only required value is rejected', () => {
  const result = validateStudent({ ...valid, firstName: '  ' });
  assert.ok(result.errors.some(e => e.field === 'firstName'));
});
