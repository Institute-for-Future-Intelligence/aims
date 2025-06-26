import { onCall } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';

exports.callOpenAI = onCall({ secrets: ['OPENAI_API_KEY'], cors: true, timeoutSeconds: 300 }, async (req) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = req.data.text;

  try {
    const response = await openai.responses.create({
      model: 'o4-mini',
      input:
        prompt +
        ' It should have hydrogen atoms. Return just a SDF file with a two-line header followed by a new empty line.',
    });

    return { text: response.output_text };
  } catch (e) {
    return { error: e };
  }
});
