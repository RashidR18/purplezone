const express = require('express');
const stringSimilarity = require('string-similarity');
const Submission = require('../models/Submission');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const SENTENCE_POOL = [
  { id: 1, text: "i is rashid", correct: "i am rashid" },
  { id: 2, text: "she beautiful", correct: "she is beautiful" },
  { id: 3, text: "he go home", correct: "he go to home" },
  { id: 4, text: "they is playing", correct: "they are playing" },
  { id: 5, text: "she don't like", correct: "she doesn't like" },
  { id: 6, text: "we was happy", correct: "we were happy" },
  { id: 7, text: "you is smart", correct: "you are smart" },
  { id: 8, text: "he speak english", correct: "he speaks english" },
  { id: 9, text: "it rain yesterday", correct: "it rained yesterday" },
  { id: 10, text: "i has a car", correct: "i have a car" },
  { id: 11, text: "they runs fast", correct: "they run fast" },
  { id: 12, text: "she write letter", correct: "she writes letter" },
  { id: 13, text: "we goes school", correct: "we go to school" },
  { id: 14, text: "he like apple", correct: "he likes apples" },
  { id: 15, text: "you cooks well", correct: "you cook well" }
];

const normalize = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const findSentenceById = (id) => {
  return SENTENCE_POOL.find(s => s.id === parseInt(id)) || null;
};

// Get dynamic sentences (random 3)
router.get('/sentences', protect, (req, res) => {
  try {
    // Shuffle the SENTENCE_POOL array and take the first 3
    const shuffled = [...SENTENCE_POOL].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    // Return only public fields (id and text)
    const sanitizedSet = selected.map(s => ({
      id: s.id,
      text: s.text
    }));
    res.json(sanitizedSet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving sentences' });
  }
});

// Submit test answers
router.post('/', protect, async (req, res) => {
  try {
    const { answers } = req.body;
    console.log('--- Submissions API Received Payload ---');
    console.log(JSON.stringify(req.body, null, 2));

    let score = 0;
    const evaluatedAnswers = answers.map((answer, index) => {
      const sentence = findSentenceById(answer.sentenceId);
      const targetCorrect = sentence ? sentence.correct : "";
      
      const normalizedUser = normalize(answer.userAnswer);
      const normalizedTarget = normalize(targetCorrect);
      
      const isCorrect = normalizedUser === normalizedTarget;
      if (isCorrect) score += 1;

      console.log(`Sentence ID: ${answer.sentenceId}`);
      console.log(`- Original: "${answer.original}"`);
      console.log(`- User Answer: "${answer.userAnswer}" (Normalized: "${normalizedUser}")`);
      console.log(`- Expected Target: "${targetCorrect}" (Normalized: "${normalizedTarget}")`);
      console.log(`- Result: isCorrect = ${isCorrect}`);

      return {
        ...answer,
        correctAnswer: targetCorrect,
        isCorrect
      };
    });

    console.log(`Total Score: ${score}/${evaluatedAnswers.length}`);
    console.log('-----------------------------------------');

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
