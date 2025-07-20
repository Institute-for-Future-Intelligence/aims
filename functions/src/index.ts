/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { onCall } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';
import { callAzureOpenAI, defaultPromptAppendix } from './callAzureOpenAI';

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
    const reasoningEffort = req.data.reasoningEffort ?? 'medium';

    try {
      const response = await openai.responses.create({
        model: 'o4-mini',
        reasoning: { effort: reasoningEffort },
        input:
          prompt +
          ' The returned molecule must have 3D coordinates.' +
          ' Return just a SDF file with a two-line header followed by a new empty line.',
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
    const input = JSON.parse(req.data.text);
    let modifiedInput = [];
    for (const x of input) {
      if (x['role'] === 'user') {
        if (x['content'] === undefined) continue;
        modifiedInput.push({ role: 'user', content: x['content'] + defaultPromptAppendix });
      } else {
        modifiedInput.push(x);
      }
    }
    const reasoningEffort = req.data.reasoningEffort ?? 'medium';
    try {
      const response = await callAzureOpenAI(apiKey, modifiedInput as [], false, reasoningEffort);
      console.log('Prompt:', modifiedInput);
      console.log('Reasoning Effort:', reasoningEffort);
      console.log('Returned:', response.choices[0].message.content);
      return { text: response.choices[0].message.content };
    } catch (e) {
      console.log(e);
      return { error: e };
    }
  },
);
