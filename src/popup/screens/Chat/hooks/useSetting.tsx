import { useEffect, useMemo, useState } from "react";
import { chatGPTInputParam } from "../../../../configs/chatGPTInputParam";
import useHeader from "../../../hooks/useHeader";
import Setting from "../Setting/Setting";

enum Mode {
  completion = "zero-shot",
  // chat = "chat",
}

export interface Prompt {
  key: string; // -1 means system default
  name: string;
  prompt: string;
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
  const [mode, setMode] = useState<Mode>(Mode.completion);

  const [prompt, setPrompt] = useState<Prompt>({
    key: "-1",
    name: "system default",
    prompt: chatGPTInputParam.prompt,
  });
  const [promptList, setPromptList] = useState<Prompt[]>([]);
  const [promptVariables, setPromptVariables] = useState<promptVariable[]>([]);

  useEffect(() => {
    const listener = (
      changes: { [key: string]: chrome.storage.StorageChange },
      namespace: "sync" | "local" | "managed" | "session"
    ) => {
      if ("prompt_variables" in changes) {
        setPromptVariables(changes["prompt_variables"].newValue);
      }
      if ("promptList" in changes) {
        setPromptList(changes["promptList"].newValue);
      }
      if ("prompt" in changes) {
        setPrompt(changes["prompt"].newValue);
      }
      if ("temperature" in changes) {
        setTemperature(changes["temperature"].newValue);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  useEffect(() => {
    chrome.storage.local.get(
      ["temperature", "prompt", "prompt_variables", "promptList"],
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
        if (result.promptList !== undefined) {
          setPromptList(result.promptList);
        }
      }
    );
  }, []);

  const settingLayout = useMemo(() => {
    return (
      <Setting
        temperature={temperature}
        initialPrompt={prompt}
        initialPomptVariables={promptVariables}
        promptList={promptList}
      ></Setting>
    );
  }, [temperature, prompt, promptVariables, promptList]);

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
