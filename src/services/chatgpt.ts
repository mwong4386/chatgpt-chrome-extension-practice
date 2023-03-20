import { encode } from "@nem035/gpt-3-encoder";
import { Configuration, CreateEmbeddingRequestInput, OpenAIApi } from "openai";
import { chatGPTConfig, chatGPTInputParam } from "../configs/chatGPTConfig";

const configuration = new Configuration(chatGPTConfig);
const openai = new OpenAIApi(configuration);

export interface embeddingMapping {
  chunk: string;
  embedding: number[];
}

export interface completeConfig {
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

interface similarity {
  sequence: number;
  similarity: number;
  chunk: string;
}

export const calculateEmbeddingsForLongParagraph = async (text: string) => {
  const chunks = splitTextToChunks(formatText(text));
  const embeddings = await createEmbedding(chunks);
  return mapChunkWithEmbedding(chunks, embeddings);
};

export const answerQuestion = async (
  question: string,
  pageEmbeddings: embeddingMapping[],
  config?: completeConfig
) => {
  //find the embedding of the question
  const questionEmbedding = await createEmbedding(question);
  //calculate every similarity between the question and the chunks of page text
  const similarities = calculateAllSimilarities(
    questionEmbedding[0],
    pageEmbeddings
  );
  const context = formContext(similarities, chatGPTInputParam.contextMaxToken);
  const prompt = `Answer the question based on the context below, and if the question can't be answered based on the context, say \"I don't know\"\n\nContext: ${context}\n\n---\n\nQuestion: ${question}\nAnswer:`;
  //const prompt = `Answer the question base on the Content captured from ca.indeed, which is a job board website \n Content: ${context}\nQuestion: ${question}\nAnswer:`;
  return await createCompletion(prompt, config);
};

const createEmbedding = async (input: CreateEmbeddingRequestInput) => {
  const response = await openai.createEmbedding({
    model: chatGPTInputParam.embeddingModel,
    input: input,
  });
  return response.data.data.map((item) => item.embedding); //returns an array of embeddings for the input
};

const createCompletion = async (prompt: string, config?: completeConfig) => {
  const response = await openai.createCompletion({
    model: chatGPTInputParam.completionModel,
    prompt: prompt,
    temperature: chatGPTInputParam.temperature, //0 is determine, 1 is random
    max_tokens: config?.max_tokens ?? 200,
  });
  return response.data.choices[0].text;
};

//remove line breaks and extra spaces
const formatText = (text: string) => {
  return text
    .replace(/(\r\n|\n|\r)/gm, "\n") //removes all three types of line breaks
    .replace(/(\s\s+)/gm, " ")
    .trim();
};

//approximate embedding size is 1 tokens ~ 4 characters, try 500 tokens ~ 2000 characters
const splitTextToChunks = (text: string, chunkMaxTokenSize: number = 500) => {
  const txtArray = text.split("\n");
  const chunks = [txtArray[0]];
  for (let i = 1; i < txtArray.length; i++) {
    const chunk = chunks[chunks.length - 1];
    if (getTokenSize(chunk + "\n" + txtArray[i]) < chunkMaxTokenSize) {
      chunks[chunks.length - 1] = chunk + "\n" + txtArray[i];
    } else {
      chunks.push(txtArray[i]);
    }
  }
  return chunks;
};

const cosineSimilarity = (vectorA: number[], vectorB: number[]) => {
  // Calculate dot product of vectorA and vectorB
  let dotProduct = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
  }

  // Calculate magnitude of vectorA and vectorB
  let magnitudeA = 0;
  let magnitudeB = 0;
  for (let i = 0; i < vectorA.length; i++) {
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

const formContextInMultipleChunksFormat = (text: string, maxLength: number) => {
  const chunks = splitTextToChunks(text, maxLength);
  if (chunks.length === 0) return "";

  chunks[0] = ``;
};

const getTokenSize = (text: string) => {
  return encode(text).length;
};
