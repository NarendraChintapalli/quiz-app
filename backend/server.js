const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quizRoutes');
const db = require('./db');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api', quizRoutes);

// Seed data if table is empty
const seedPath = path.resolve(__dirname, 'data', 'seed.sql');
db.get('SELECT COUNT(*) as count FROM questions', (err, row) => {
  if (row && row.count === 0) {
    const seedSQL = fs.readFileSync(seedPath, 'utf8');
    db.exec(seedSQL, (err) => {
      if (err) console.error('Error seeding data:', err.message);
      else console.log('Seed data inserted successfully');
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
