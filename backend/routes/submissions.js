const express = require('express');
const stringSimilarity = require('string-similarity');
const Submission = require('../models/Submission');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const correctAnswers = [
  "She doesn't know where the keys to the house are, and yesterday she left them on a table near the door.",
  "The team has worked very hard on their project, but the manager didn't give them any feedback for two weeks.",
  "He went to the market yesterday and bought some apples and potatoes, but forgot to bring his wallet with him."
];

// Submit test answers
router.post('/', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    let score = 0;
    const evaluatedAnswers = answers.map((answer, index) => {
      const targetCorrect = correctAnswers[answer.sentenceId - 1];
      
      const similarity = stringSimilarity.compareTwoStrings(
        answer.userAnswer.toLowerCase().trim(),
        targetCorrect.toLowerCase().trim()
      );
      
      const isCorrect = similarity >= 0.85;
      if (isCorrect) score += 1;

      return {
        ...answer,
        correctAnswer: targetCorrect,
        isCorrect
      };
    });

    const submission = await Submission.create({
      userId: req.user.id,
      answers: evaluatedAnswers,
      score
    });

    res.status(201).json({
      submissionId: submission._id,
      answers: evaluatedAnswers,
      score
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error on submission' });
  }
});

module.exports = router;
