/**
 * This file contains an API call function to a hypothetical API at 'http://localhost:11434/api/generate'.
 * This function, `queryLlamaJSON`, performs a POST call to the API with the provided prompt in the JSON body.
 * The API is supposed to return JSON data in the text response.
 * This returned data is then processed in the client side, with the stream being read chunk by chunk.
 * Each chunk is added to a `chunks` string variable until there are no more chunks.
 * Following this, the function tries to format the contents of `chunks` into JSON and log it to the console.
 * If the json contains fields for replyEmail with either of the following properties: text, data, or body,
 * the function extracts these into a returned object. Otherwise, the json is returned as is.
 *
 * Please note that this function does not perform any error checking. It is assumed that the API always returns
 * the expected format and that the fetch call does not fail.
 *
 * @param {Object} parameters - An object that contains the prompt to send in the request
 * @param {String} parameters.prompt - The prompt to send in the request
 * @returns {Object} The JSON object received from the API request, either partly or wholly depending on its structure
 */
import {current} from "@reduxjs/toolkit";

const BASE_URL = 'http://localhost:11434/api/generate';

export const queryLlamaJSON = async ({prompt}) => {
  console.log("%cThe prompt is:", "color: green;", prompt);

  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      format: "json",
      model: "llama3:8b",
    })
  });

  console.log("%cLLAMA3 API call was successful!", "color: green;");

  const reader = response.body.getReader();
  let chunks = '';
  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      console.log("Stream complete");
      break;
    }

    const currentChunk = new TextDecoder("utf-8").decode(value);
    const json = JSON.parse(currentChunk);
    console.log(json);
    chunks += json.response;
  }

  console.log('Chunks:', chunks);

  const json = JSON.parse(chunks);
  console.log(json);

  if (json.replyEmail && (json.replyEmail.text || json.replyEmail.data || json.replyEmail.body)) {
    return {
      replyEmail: json.replyEmail.text || json.replyEmail.data || json.replyEmail.body
    }
  } else {
    return json;
  }
};