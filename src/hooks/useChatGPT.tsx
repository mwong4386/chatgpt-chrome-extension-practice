import { useEffect, useState } from "react";
import {
  calculateEmbeddingsForLongParagraph,
  embeddingMapping,
} from "../services/chatgpt";
import { hash } from "../utils/hash";

const getPageContent = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  let result = undefined;
  try {
    result = await chrome.scripting.executeScript({
      target: { tabId: tab.id ?? 0 },
      func: () => {
        return {
          mainDocText: document.body.innerText,
          iframeDocText: Array.from(
            document.querySelectorAll("iframe, frame")
          ).reduce(
            (acc, cur: any) =>
              acc + "\n" + cur.contentDocument?.body.innerText ?? "",
            ""
          ),
        };
      },
    });
  } catch (e) {
    return "";
  }
  return result[0].result.mainDocText + "\n" + result[0].result.iframeDocText;
};

const useChatGPT = () => {
  const [mapping, setMapping] = useState<embeddingMapping[] | undefined>(
    undefined
  );
  useEffect(() => {
    getPageContent().then((content) => {
      if (content === undefined) return;
      const hashedContent = hash(content);
      chrome.storage.local.get(hashedContent, (result) => {
        if (result[hashedContent] !== undefined) {
          setMapping(result[hashedContent]);
          return;
        } else {
          calculateEmbeddingsForLongParagraph(content).then((embeddings) => {
            setMapping(embeddings);
            chrome.storage.local.set({
              [hashedContent]: embeddings,
            });
          });
        }
      });
    });
  }, []);

  return { currentPageEmbedding: mapping };
};

export default useChatGPT;
