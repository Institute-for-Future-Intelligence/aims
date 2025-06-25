/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// // Start writing functions
// // https://firebase.google.com/docs/functions/typescript

// // For cost control, you can set the maximum number of containers that can be
// // running at the same time. This helps mitigate the impact of unexpected
// // traffic spikes by instead downgrading performance. This limit is a
// // per-function limit. You can override the limit for each function using the
// // `maxInstances` option in the function's options, e.g.
// // `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// // NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// // functions should each use functions.runWith({ maxInstances: 10 }) instead.
// // In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// // export const helloWorld = onRequest((request, response) => {
// //   logger.info("Hello logs!", {structuredData: true});
// //   response.send("Hello from Firebase!");
// // });

// ********************************************
// import { onRequest } from 'firebase-functions/v2/https';
// import { OpenAI } from 'openai';

// exports.callOpenAI = onRequest({ secrets: ['OPENAI_API_KEY'] }, async (req, res) => {
//   const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
//   });

//   const prompt = req.body.message;

//   try {
//     const response = await openai.responses.create({
//       model: 'o4-mini',
//       input:
//         prompt +
//         ' It should have hydrogen atoms. Return just a SDF file with a two-line header followed by a new empty line.',
//     });
//     res.json({ text: response.output_text });
//   } catch (e) {
//     console.log(e);
//   }
// });
// ********************************************

// Dependencies for callable functions.
import { onCall } from 'firebase-functions/v2/https';
import { OpenAI } from 'openai';

exports.callOpenAI = onCall({ secrets: ['OPENAI_API_KEY'] }, async (req) => {
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
