/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { onCall } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';
import { callAzureOpenAI } from './callAzureOpenAI';

exports.callOpenAI = onCall(
  {
    secrets: ['OPENAI_API_KEY'],
    cors: true,
    timeoutSeconds: 300,
    region: 'us-east4',
  },
  async (req) => {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = req.data.text;

    try {
      const response = await openai.responses.create({
        model: 'o4-mini',
        reasoning: { effort: 'medium' },
        input:
          prompt +
          ' The returned molecule must have 3D coordinates and must have hydrogen atoms.' +
          ' Return just a SDF file with a two-line header followed by a new empty line.' +
          ' The fourth line (the count line) must have only one whitespace before the first non-whitespace character.' +
          ' The coordinate lines in the atom block following the fourth line must have four spaces indent.',
      });

      return { text: response.output_text };
    } catch (e) {
      return { error: e };
    }
  },
);

exports.callAzure = onCall(
  { secrets: ['AZURE_OPENAI_API_KEY'], timeoutSeconds: 300, region: 'us-east4' },
  async (req) => {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const prompt = req.data.text;
    try {
      const response = await callAzureOpenAI(apiKey, prompt);
      console.log(response.choices[0].message.content);
      return { text: response.choices[0].message.content };
    } catch (e) {
      return { error: e };
    }
  },
);
