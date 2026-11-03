'use strict';

const express = require('express');
const path = require('node:path');
const { validateStudent } = require('./backend/validate');
const { saveStudent } = require('./backend/db');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

// Serve only the public form and its assets. Never serve the SQLite file.
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.post('/api/students', (req, res) => {
  const { values, errors } = validateStudent(req.body);
  if (errors.length) return res.status(400).json({ ok: false, errors });

  try {
    const id = saveStudent(values);
    return res.status(201).json({
      ok: true,
      id,
      message: 'Student biodata saved successfully.'
    });
  } catch (error) {
    if (String(error.message).includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        ok: false,
        errors: [{ field: 'matricNumber', message: 'This matriculation number has already been registered.' }]
      });
    }
    console.error('Database insertion failed:', error.code || 'unknown');
    return res.status(500).json({ ok: false, message: 'Unable to save biodata.' });
  }
});

// Convert malformed JSON into a useful response.
app.use((error, _req, res, next) => {
  if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
    return res.status(400).json({ ok: false, message: 'Invalid request body.' });
  }
  next(error);
});

app.listen(PORT, '127.0.0.1', () => {
  console.log('SEN 305 form is running at http://localhost:' + PORT);
});
