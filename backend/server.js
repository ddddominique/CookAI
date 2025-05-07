const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Anthropic } = require('@anthropic-ai/sdk');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients and suggests a recipe...
`;

app.post('/ask', async (req, res) => {
  const { ingredients } = req.body;

  try {
    const ingredientsString = ingredients.join(", ");
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: `I have ${ingredientsString}. What recipe can I make?` },
      ],
    });

    res.json({ recipe: response.content[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get recipe." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
