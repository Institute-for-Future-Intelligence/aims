/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { AzureOpenAI, OpenAI } from 'openai';
import ReasoningEffort = OpenAI.ReasoningEffort;

const endpoint = 'https://aims-test-resource.cognitiveservices.azure.com/';
const modelName = 'o4-mini';
const deployment = 'o4-mini';
const apiVersion = '2024-12-01-preview';

export const callAzureOpenAI = async (
  apiKey: string | undefined,
  prompt: string,
  fromBrowser = false,
  reasoningEffort: string,
) => {
  const options = {
    endpoint,
    apiKey,
    deployment,
    apiVersion,
    dangerouslyAllowBrowser: fromBrowser,
    reasoning_effort: reasoningEffort,
  };

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [
      { role: 'system', content: '' },
      {
        role: 'user',
        content:
          prompt +
          ' The returned molecule must have 3D coordinates.' +
          ' Return just a SDF file with a two-line header followed by a new empty line.',
      },
    ],
    reasoning_effort: reasoningEffort as ReasoningEffort,
    max_completion_tokens: 100000,
    model: modelName,
  });
  return response;
};
