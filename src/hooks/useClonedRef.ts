import { ForwardedRef, useEffect, useRef } from "react";
//https://stackoverflow.com/questions/62238716/using-ref-current-in-react-forwardref
const useClonedRef = <T>(ref: ForwardedRef<T>, initialValue: any = null) => {
  const clonedRef = useRef<T>(initialValue);

  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(clonedRef.current);
    } else {
      ref.current = clonedRef.current;
    }
  });
  return clonedRef;
};

export default useClonedRef;
