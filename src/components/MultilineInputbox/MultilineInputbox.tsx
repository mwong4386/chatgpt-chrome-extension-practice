import { useState, useEffect, forwardRef, ForwardedRef } from "react";
import useClonedRef from "../../hooks/useClonedRef";

interface props extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  maxRows: number;
  paddingVertical?: number; // default 2
  disabled?: boolean;
}
const MultilineInputbox = forwardRef(
  (
    { paddingVertical = 2, maxRows, onChange, ...props }: props,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => {
    const myRef = useClonedRef<HTMLTextAreaElement>(ref);
    const [maxHeight, setMaxHeight] = useState<number>(Number.MAX_SAFE_INTEGER);
    useEffect(() => {
      if (myRef.current) {
        const maxH =
          (myRef.current.clientHeight - paddingVertical * 2) * (maxRows - 1) +
          myRef.current.scrollHeight;
        setMaxHeight(maxH);
        myRef.current.style.height = "inherit";
        myRef.current.style.height = `${Math.min(
          maxH,
          myRef.current.scrollHeight
        )}px`;
      }
    }, [myRef, paddingVertical]);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      //https://stackoverflow.com/questions/39401504/javascript-react-dynamic-height-textarea-stop-at-a-max
      e.target.style.height = "inherit";
      e.target.style.height = `${Math.min(maxHeight, e.target.scrollHeight)}px`;
      onChange && onChange(e);
    };

    return (
      <textarea
        ref={myRef}
        {...props}
        onChange={handleChange}
        rows={1}
        style={{
          paddingTop: `${paddingVertical}px`,
          paddingBottom: `${paddingVertical}px`,
          resize: "none",
          flex: 1,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
        }}
        disabled={props.disabled}
      />
    );
  }
);

export default MultilineInputbox;
