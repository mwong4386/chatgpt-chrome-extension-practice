import { Configuration, OpenAIApi } from "openai";
import { chatGPTConfig } from "../configs/chatGPTConfig";

const configuration = new Configuration(chatGPTConfig);
const openai = new OpenAIApi(configuration);

export interface embeddingMapping {
  chunk: string;
  embedding: number[];
}

export const calculateEmbeddings = async (text: string) => {
  const chunks = splitTextToChunks(formatText(text));
  const openai = new OpenAIApi(configuration);
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: chunks,
  });
  return mapChunkWithEmbedding(
    chunks,
    response.data.data.map((item) => item.embedding)
  );
};

export const answerQuestion = async (
  question: string,
  pageEmbeddings: embeddingMapping[]
) => {
  //find the embedding of the question
  const questionEmbedding = await createEmbedding(question);

  //calculate every similarity between the question and the chunks of page text
  const similarities = calculateAllSimilarities(
    questionEmbedding[0],
    pageEmbeddings
  );

  const context = formContext(similarities, 4000);

  const prompt = `Answer the question based on the context below, and if the question can't be answered based on the context, say \"I don't know\"\n\nContext: ${context}\n\n---\n\nQuestion: ${question}\nAnswer:`;
  return await createCompletion(prompt);
};

const createEmbedding = async (input: string) => {
  const response = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: input,
  });
  return response.data.data.map((item) => item.embedding);
};

const createCompletion = async (prompt: string) => {
  const response1 = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
    max_tokens: 2048,
  });
  return response1.data.choices[0].text;
};

//remove line breaks and extra spaces
const formatText = (text: string) => {
  return text
    .replace(/(\r\n|\n|\r)/gm, " ") //removes all three types of line breaks
    .replace(/(\s\s+)/gm, " ")
    .trim();
};

//approximate embedding size is 1 tokens ~ 4 characters, try 500 tokens ~ 2000 characters
const splitTextToChunks = (text: string, chunkSize: number = 2000) => {
  const txtArray = text.split(". ");
  const chunks = [txtArray[0]];

  for (let i = 1; i < txtArray.length; i++) {
    const chunk = chunks[chunks.length - 1];
    if (chunk.length + txtArray[i].length < chunkSize) {
      chunks[chunks.length - 1] = chunk + ". " + txtArray[i];
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
) => {
  return embeddingMappings.map((mapping) => {
    return {
      similarity: cosineSimilarity(vectorA, mapping.embedding),
      chunk: mapping.chunk,
    };
  });
};

const formContext = (
  similarities: { similarity: number; chunk: string }[],
  maxLength: number
) => {
  const ranking = similarities.sort((a, b) => b.similarity - a.similarity);
  let context = "";
  for (let i = 0; i < ranking.length; i++) {
    if (context.length + ranking[i].chunk.length <= maxLength) {
      context += ranking[i].chunk;
    } else {
      return context;
    }
  }
  return context;
};
