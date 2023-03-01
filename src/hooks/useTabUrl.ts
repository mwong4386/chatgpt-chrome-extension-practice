import { useLayoutEffect, useState } from "react";

const useTabUrl = () => {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setUrl(tabs[0].url);
    });
  }, []);

  return { url };
};
export default useTabUrl;
