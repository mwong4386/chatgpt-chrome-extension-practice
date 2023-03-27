export const chatGPTInputParam = {
  embeddingModel: "text-embedding-ada-002",
  chunkMaxTokenSize: 500,
  contextMaxToken: 3500,
  completionModel: "text-davinci-003",
  chatModel: "gpt-3.5-turbo",
  temperature: 0.3,
  completionMaxTokens: 300,
  prompt:
    // "Answer the question based on the context below, and if the question can't be answered based on the context, say \"I don't know\"\nContext: {{context}}\n---\nQuestion: {{question}}\nAnswer:",
    "Now I am reading the following context, Answer my prompt combine the context and your knowledge \nContext: {{context}}\n---\nPrompt: {{question}}\nAnswer:",
  //{{context}} and {{question}} will be replaced by the context and question respectively
};
