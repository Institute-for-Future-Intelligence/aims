/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import { AzureOpenAI, OpenAI } from 'openai';

const endpoint = 'https://ifi-aims-genai.cognitiveservices.azure.com/';
const modelName = 'o4-mini';
const deployment = 'o4-mini';
const apiVersion = '2024-12-01-preview';

export const defaultPromptAppendix =
  'The molecule must have 3D coordinates. ' +
  'Return just a SDF file with a two-line header followed by a new empty line. ' +
  'Include SMILES and InChI notations and all possible chemical and physical properties as the associated data. ' +
  'Also add an explanation about how the molecule was generated to the associated data. ' +
  'Molecular formula must have the name exactly as a string Formula. ' +
  'logP must have the name exactly as a string logP. ' +
  'Complexity must have the name exactly as a string Complexity. ' +
  'Polar surface area must have the name exactly as a string PolarSurfaceArea. ' +
  'Number of hydrogen bond donors must have the name exactly as a string HydrogenBondDonors. ' +
  'Number of hydrogen bond acceptors must have the name exactly as a string HydrogenBondAcceptors. ' +
  'Number of rotatable bonds must have the name exactly as a string RotatableBonds. ' +
  'Density must have the name exactly as a string Density and must be in gram per cubic centimeter. ' +
  'Melting point must have the name exactly as a string MeltingPoint and must be in Celsius. ' +
  'Boiling point must have the name exactly as a string BoilingPoint and must be in Celsius. ' +
  'Explanation must have the name exactly as a string Explanation. ';

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

  let modifiedInput = [];
  if (fromBrowser) {
    for (const x of input) {
      if (x['role'] === 'user') {
        if (x['content'] === undefined) continue;
        modifiedInput.push({ role: 'user', content: x['content'] + defaultPromptAppendix });
      } else {
        modifiedInput.push(x);
      }
    }
  } else {
    modifiedInput = input;
  }

  const client = new AzureOpenAI(options);

  const response = await client.chat.completions.create({
    messages: modifiedInput as [],
    reasoning_effort: reasoningEffort as OpenAI.ReasoningEffort,
    max_completion_tokens: 100000,
    model: modelName,
  });
  return response;
};
