const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/diagnose
router.post('/diagnose', protect, async (req, res) => {
  const { issue } = req.body;

  if (!issue || issue.trim() === '') {
    return res.status(400).json({ message: 'Please describe the issue' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an industrial plant maintenance expert at a steel manufacturing plant. A worker has described the following equipment issue:

"${issue}"

Provide a response in this exact format:
PROBABLE CAUSE: (1-2 sentences)
RECOMMENDED ACTION: (2-3 sentences with clear steps)
PRIORITY: (High/Medium/Low)

Keep it concise and practical for a plant floor worker.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({ diagnosis: text });
  } catch (err) {
    console.error('AI Error:', err.message);
    res.status(500).json({ message: 'AI service error', error: err.message });
  }
});

module.exports = router;