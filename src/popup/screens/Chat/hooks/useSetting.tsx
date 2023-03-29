import { useEffect, useMemo, useState } from "react";
import { chatGPTInputParam } from "../../../../configs/chatGPTInputParam";
import useHeader from "../../../hooks/useHeader";
import Setting from "../Setting/Setting";

enum Mode {
  completion = "zero-shot",
  // chat = "chat",
}

export interface promptVariable {
  key: string;
  name: string;
  value: string;
}

const useSetting = () => {
  const { renderAsidePanelMainContent, renderCenterHeader } = useHeader();
  const [temperature, setTemperature] = useState<number>(
    chatGPTInputParam.temperature
  );
  const [prompt, setPrompt] = useState<string>(chatGPTInputParam.prompt);
  const temperature_onChange = (e: any) => {
    setTemperature(+e.target.value);
    chrome.storage.local.set({
      temperature: +e.target.value,
    });
  };
  const [mode, setMode] = useState<Mode>(Mode.completion);
  const prompt_onChange = (e: any) => {
    setPrompt(e.target.value);
    chrome.storage.local.set({
      prompt: e.target.value,
    });
  };

  const [promptVariables, setPromptVariables] = useState<promptVariable[]>([]);

  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      namespace: "sync" | "local" | "managed" | "session"
    ) => {
      if ("prompt_variables" in changes) {
        setPromptVariables(changes["prompt_variables"].newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    chrome.storage.local.get(
      ["temperature", "prompt", "prompt_variables"],
      (result) => {
        if (result.temperature !== undefined) {
          setTemperature(+result.temperature);
        }
        if (result.prompt !== undefined) {
          setPrompt(result.prompt);
        }
        if (result.prompt_variables !== undefined) {
          setPromptVariables(result.prompt_variables);
        }
      }
    );
  }, []);

  const settingLayout = useMemo(() => {
    return (
      <Setting
        temperature={temperature}
        temperature_onChange={temperature_onChange}
        initialPrompt={prompt}
        prompt_onChange={prompt_onChange}
        setPrompt={setPrompt}
        initialPomptVariables={promptVariables}
      ></Setting>
    );
  }, [temperature, prompt, promptVariables]);

  useEffect(() => {
    if (renderAsidePanelMainContent === null) return;
    renderAsidePanelMainContent(settingLayout);
  }, [renderAsidePanelMainContent, settingLayout]);

  useEffect(() => {
    if (renderCenterHeader === null) return;
    renderCenterHeader(
      <select
        style={{
          backgroundColor: "#242424",
          border: "transparent",
          fontWeight: 600,
        }}
      >
        {Object.keys(Mode).map((key) => {
          return <option value={key}>{Mode[key as keyof typeof Mode]}</option>;
        })}
      </select>
    );
  }, [renderCenterHeader]);
  return { temperature, prompt, mode, promptVariables };
};
export default useSetting;
