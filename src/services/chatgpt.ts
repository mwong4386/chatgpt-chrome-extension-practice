import { encode } from "@nem035/gpt-3-encoder";
import { Configuration, CreateEmbeddingRequestInput, OpenAIApi } from "openai";
import { chatGPTConfig } from "../configs/chatGPTConfig";
import { chatGPTInputParam } from "../configs/chatGPTInputParam";

const configuration = new Configuration(chatGPTConfig);
const openai = new OpenAIApi(configuration);

export interface embeddingMapping {
  chunk: string;
  embedding: number[];
}

interface chunkAndSize {
  chunk: string;
  size: number;
}

interface similarity {
  sequence: number;
  similarity: number;
  chunk: string;
}

export const calculateEmbeddingsForLongParagraph = async (text: string) => {
  const result: embeddingMapping[] = [];
  const chunks = splitTextToChunks(text, chatGPTInputParam.chunkMaxTokenSize);
  let chunksToBeSent: string[] = [];
  let size = 0;
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].size > chatGPTInputParam.contextMaxToken) continue; //skip the chunk if it is too long
    if (chunks[i].size + size < 8196) {
      chunksToBeSent.push(chunks[i].chunk);
      size += chunks[i].size;
    } else {
      const embeddings = await createEmbedding(chunksToBeSent);
      result.push(...mapChunkWithEmbedding(chunksToBeSent, embeddings));
      chunksToBeSent = [chunks[i].chunk];
      size = chunks[i].size;
    }
  }
  if (chunksToBeSent.length > 0) {
    const embeddings = await createEmbedding(chunksToBeSent);
    result.push(...mapChunkWithEmbedding(chunksToBeSent, embeddings));
  }
  return result;
};

export const answerQuestion = async (
  question: string,
  pageEmbeddings: embeddingMapping[],
  prompt: string,
  temperature: number
) => {
  //find the embedding of the question
  const questionEmbedding = await createEmbedding(question);
  //calculate every similarity between the question and the chunks of page text
  const similarities = calculateAllSimilarities(
    questionEmbedding[0],
    pageEmbeddings
  );
  const context = formContext(similarities, chatGPTInputParam.contextMaxToken);
  const formatPrompt = prompt
    .replace("{{context}}", context)
    .replace("{{question}}", question);
  return await createCompletion(formatPrompt, temperature);
};

export const createEmbedding = async (input: CreateEmbeddingRequestInput) => {
  try {
    const response = await openai.createEmbedding({
      model: chatGPTInputParam.embeddingModel,
      input: input,
    });
    return response.data.data.map((item) => item.embedding); //returns an array of embeddings for the input
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export const calculateMaxResponseLength = (prompt: string): number => {
  return chatGPTInputParam.completionMaxTokens - getTokenSize(prompt);
};

export const createCompletion = async (prompt: string, temperature: number) => {
  const response = await openai.createCompletion({
    model: chatGPTInputParam.completionModel,
    prompt: prompt,
    temperature: temperature, //0 is determine, 1 is random
    max_tokens: calculateMaxResponseLength(prompt),
  });
  return response.data.choices[0].text;
};

//approximate embedding size is 1 tokens ~ 4 characters, try 500 tokens ~ 2000 characters
export const splitTextToChunks = (
  text: string,
  chunkMaxTokenSize: number
): chunkAndSize[] => {
  const txtArray = text.split(/\r?\n/);
  const chunks = [{ chunk: txtArray[0], size: getTokenSize(txtArray[0]) }];
  for (let i = 1; i < txtArray.length; i++) {
    const chunk = chunks[chunks.length - 1].chunk;
    const size = getTokenSize(chunk + "\n" + txtArray[i]);
    if (size < chunkMaxTokenSize) {
      chunks[chunks.length - 1].chunk = chunk + "\n" + txtArray[i];
      chunks[chunks.length - 1].size = size;
    } else {
      chunks.push({ chunk: txtArray[i], size: getTokenSize(txtArray[i]) });
    }
  }
  return chunks;
};

export const cosineSimilarity = (
  vectorA: number[],
  vectorB: number[]
): number => {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    // Calculate dot product of vectorA and vectorB
    // Calculate magnitude of vectorA and vectorB
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  // Calculate cosine similarity
  let similarity = dotProduct / (magnitudeA * magnitudeB);

  return similarity;
};

const mapChunkWithEmbedding = (
  chunks: string[],
  embeddings: number[][]
): embeddingMapping[] => {
  return chunks.map((chunk, index) => {
    return {
      chunk: chunk,
      embedding: embeddings[index],
    };
  });
};

const calculateAllSimilarities = (
  vectorA: number[],
  embeddingMappings: embeddingMapping[]
): similarity[] => {
  return embeddingMappings.map((mapping, index) => {
    return {
      sequence: index,
      similarity: cosineSimilarity(vectorA, mapping.embedding),
      chunk: mapping.chunk,
    };
  });
};

const formContext = (similarities: similarity[], maxTokenSize: number) => {
  const ranking = similarities.sort((a, b) => b.similarity - a.similarity);
  let temp = "";
  const context = [];
  for (let i = 0; i < ranking.length; i++) {
    if (getTokenSize(temp + ranking[i].chunk) <= maxTokenSize) {
      temp += ranking[i].chunk;
      context.push(ranking[i]);
    } else {
      break;
    }
  }
  return context.length === 0
    ? ""
    : context
        .sort((a, b) => a.sequence - b.sequence) //the chunks should come with its initial order, although some of the unimportant piece missing
        .map((item) => item.chunk)
        .join(". ");
};

export const getTokenSize = (text: string) => {
  return encode(text).length;
};
