import { AzureOpenAI } from 'openai';

const endpoint = 'https://aims-test-resource.cognitiveservices.azure.com/';
const modelName = 'o4-mini';
const deployment = 'o4-mini';
const apiVersion = '2024-12-01-preview';

export const callAzureOpenAI = async (apiKey: string | undefined, prompt: string, fromBrowser = false) => {
  const options = { endpoint, apiKey, deployment, apiVersion, dangerouslyAllowBrowser: fromBrowser };

  const client = new AzureOpenAI(options);

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
  return response;
};
