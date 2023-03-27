import { useEffect, useState } from "react";
import styles from "./Setting.module.css";
interface props {
  temperature: number;
  temperature_onChange: (e: any) => void;
  initialPrompt: string;
  prompt_onChange: (e: any) => void;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const Setting = ({
  temperature,
  temperature_onChange,
  initialPrompt,
  prompt_onChange,
}: props) => {
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  useEffect(() => {
    setPrompt(initialPrompt); //in case initialPrompt is changed
  }, [initialPrompt]);

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
    </div>
  );
};

export default Setting;
