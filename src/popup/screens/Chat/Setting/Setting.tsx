import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Prompt, promptVariable } from "../hooks/useSetting";
import styles from "./Setting.module.css";

interface props {
  temperature: number;
  initialPrompt: Prompt;
  // setPrompt: React.Dispatch<React.SetStateAction<string>>;
  initialPomptVariables: promptVariable[];
  promptList: Prompt[];
}

const Setting = ({
  temperature,
  initialPrompt,
  initialPomptVariables,
  promptList,
}: props) => {
  const [promptVariables, setPromptVariables] = useState<promptVariable[]>(
    initialPomptVariables
  );
  const [promptSelect, setPromptSelect] = useState<Prompt>(initialPrompt); //it hold the temporary value of the prompt

  useEffect(() => {
    setPromptSelect(initialPrompt); //in case initialPrompt is changed
  }, [initialPrompt]);

  useEffect(() => {
    setPromptVariables(initialPomptVariables); //in case initialPomptVariables is changed
  }, [initialPomptVariables]);

  const savePrompt = () => {
    if (promptSelect.key === "-1") {
      const newKey = uuid();
      const newPrompt = {
        key: newKey,
        name: promptSelect.name,
        prompt: promptSelect.prompt,
      };
      const newPromptList = [...promptList, newPrompt];
      chrome.storage.local.set({
        prompt: newPrompt,
        promptList: newPromptList,
      });
    } else {
      const newPromptList = promptList.map((prompt) => {
        if (prompt.key === promptSelect.key) {
          return {
            ...prompt,
            name: promptSelect.name,
            prompt: promptSelect.prompt,
          };
        }
        return prompt;
      });
      chrome.storage.local.set({
        prompt: promptSelect,
        promptList: newPromptList,
      });
    }
  };

  const changePrompt = (e: any) => {
    setPromptSelect((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const promptOption_onChange = (e: any) => {
    if (e.target.value === "-1") {
      setPromptSelect({ key: "-1", name: "", prompt: "" }); // it is temporary value until it is saved
    } else {
      const promptFound = promptList.find(
        (prompt) => prompt.key === e.target.value
      );
      if (promptFound) {
        chrome.storage.local.set({ prompt: promptFound }); // change the prompt used
      }
    }
  };

  const temperature_onChange = (e: any) => {
    chrome.storage.local.set({
      temperature: +e.target.value,
    });
  };
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
        <select onChange={promptOption_onChange}>
          {promptList.map((prompt, id) => {
            return (
              <option
                value={prompt.key}
                selected={promptSelect.key === prompt.key}
              >
                {prompt.name}
              </option>
            );
          })}
          <option value="-1">Add new Prompt</option>
        </select>
      </div>
      <div className={styles["item-container"]}>
        <input
          name={"name"}
          type="text"
          value={promptSelect.name}
          placeholder="name of the prompt"
          onChange={changePrompt}
        />
        <button onClick={savePrompt}>Save</button>
      </div>
      <div className={styles["item-container"]}>
        <textarea
          id="prompt"
          name="prompt"
          className={styles["prompt-textarea"]}
          rows={5}
          value={promptSelect.prompt}
          onChange={changePrompt}
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
