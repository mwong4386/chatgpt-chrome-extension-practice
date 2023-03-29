import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { promptVariable } from "../hooks/useSetting";
import styles from "./Setting.module.css";

interface props {
  temperature: number;
  temperature_onChange: (e: any) => void;
  initialPrompt: string;
  prompt_onChange: (e: any) => void;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  initialPomptVariables: promptVariable[];
}

const Setting = ({
  temperature,
  temperature_onChange,
  initialPrompt,
  prompt_onChange,
  initialPomptVariables,
}: props) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [promptVariables, setPromptVariables] = useState<promptVariable[]>(
    initialPomptVariables
  );
  useEffect(() => {
    setPrompt(initialPrompt); //in case initialPrompt is changed
  }, [initialPrompt]);

  useEffect(() => {
    setPromptVariables(initialPomptVariables); //in case initialPomptVariables is changed
  }, [initialPomptVariables]);

  const addPromptVariable = () => {
    setPromptVariables([
      ...promptVariables,
      { key: uuid(), name: "", value: "" },
    ]);
  };

  const deletePromptVariable = (key: string) => {
    setPromptVariables(
      promptVariables.filter((variable) => variable.key !== key)
    );
  };
  const savePromptVariable = () => {
    chrome.storage.local.set({ prompt_variables: promptVariables });
  };
  return (
    <div className={styles["container"]}>
      <div className={styles["item-container"]}>
        <label htmlFor="prompt">Prompt</label>
        <textarea
          className={styles["prompt-textarea"]}
          rows={5}
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
          onBlur={prompt_onChange}
        ></textarea>
      </div>
      <div className={styles["item-container"]}>
        <label htmlFor="temperature">Temperature</label>

        <input
          id="temperature"
          value={temperature}
          onChange={temperature_onChange}
          type="range"
          min="0"
          max="1"
          step="0.01"
        />
        <span>{temperature}</span>
      </div>
      <div className={styles["item-container"]}>
        <label htmlFor="temperature">Variable(s)</label>
        <button onClick={savePromptVariable}>Save</button>
        <button
          className={styles["add-btn"]}
          id="add-variable"
          type="button"
          onClick={addPromptVariable}
        >
          +
        </button>
      </div>
      {promptVariables.map((variable, index) => {
        return (
          <div key={variable.key} className={styles["item-container"]}>
            <input
              className={styles["prompt-v-name"]}
              type="text"
              value={variable.name}
              onChange={(e) => {
                const newPromptVariables = [...promptVariables];
                newPromptVariables[index].name = e.target.value;
                setPromptVariables(newPromptVariables);
              }}
            />
            <input
              className={styles["prompt-v-value"]}
              type="text"
              value={variable.value}
              onChange={(e) => {
                const newPromptVariables = [...promptVariables];
                newPromptVariables[index].value = e.target.value;
                setPromptVariables(newPromptVariables);
              }}
            />
            <button onClick={() => deletePromptVariable(variable.key)}>
              X
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Setting;
