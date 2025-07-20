/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { AzureOpenAI, OpenAI } from 'openai';

const endpoint = 'https://aims-test-resource.cognitiveservices.azure.com/';
const modelName = 'o4-mini';
const deployment = 'o4-mini';
const apiVersion = '2024-12-01-preview';

export const defaultPromptAppendix =
  'The molecule must have 3D coordinates. Return just a SDF file with a two-line header followed by a new empty line.';

export const callAzureOpenAI = async (
  apiKey: string | undefined,
  input: [],
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

  const modifiedInput = [];
  for (const x of input) {
    if (x['role'] === 'user') {
      if (x['content'] === undefined) continue;
      modifiedInput.push({ role: 'user', content: x['content'] + defaultPromptAppendix });
    } else {
      modifiedInput.push(x);
    }
  }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: [{ role: 'system', content: '' }, ...(modifiedInput as [])],
    reasoning_effort: reasoningEffort as OpenAI.ReasoningEffort,
    max_completion_tokens: 100000,
    model: modelName,
  });
  return response;
};
