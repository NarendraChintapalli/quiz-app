const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all questions (without correct answers)
router.get('/questions', (req, res) => {
  db.all('SELECT id, question, optionA, optionB, optionC, optionD FROM questions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Submit answers and calculate score
router.post('/submit', (req, res) => {
  const userAnswers = req.body.answers; // [{id:1, selected:"A"}, ...]

  db.all('SELECT id, correctOption FROM questions', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    let score = 0;
    rows.forEach(q => {
      const userAnswer = userAnswers.find(a => a.id === q.id);
      if (userAnswer && userAnswer.selected === q.correctOption) {
        score++;
      }
    });

    res.json({
      score,
      total: rows.length, // ✅ Corrected variable
      correctAnswers: rows.map(q => ({
        id: q.id,
        correctOption: q.correctOption
      }))
    });
  });
});

module.exports = router;
