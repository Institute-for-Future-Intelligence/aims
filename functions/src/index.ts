/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { onCall } from 'firebase-functions/v2/https';
import { OpenAI, AzureOpenAI } from 'openai';

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
          ' The fourth line (the count line) must have one-space indent.' +
          ' The lines in the atom block must have four spaces indent.',
      });

      return { text: response.output_text };
    } catch (e) {
      return { error: e };
    }
  },
);

const endpoint = 'https://aims-test-resource.cognitiveservices.azure.com/';
const modelName = 'o4-mini';
const deployment = 'o4-mini';

exports.callAzure = onCall(
  { secrets: ['AZURE_OPENAI_API_KEY'], timeoutSeconds: 300, region: 'us-east4' },
  async (req) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const apiVersion = '2024-12-01-preview';
    const options = { endpoint, apiKey, deployment, apiVersion };

    const client = new AzureOpenAI(options);

    const prompt = req.data.text;
    try {
      const response = await client.chat.completions.create({
        messages: [
          { role: 'system', content: '' },
          {
            role: 'user',
            content:
              prompt +
              ' It should have hydrogen atoms. Return just a SDF file with a two-line header followed by a new empty line.',
          },
        ],
        max_completion_tokens: 100000,
        model: modelName,
      });

      console.log(response.choices[0].message.content);
      return { text: response.choices[0].message.content };
    } catch (e) {
      return { error: e };
    }
  },
);
