import { useEffect } from "react";

export default function useAutoDismiss<T extends string | boolean | null>(
  value: T,
  setValue: React.Dispatch<React.SetStateAction<T>>,
  ms = 3000
) {
  useEffect(() => {
    if (value === "" || value === false || value === null || value === undefined) return;

    const id = window.setTimeout(() => {
      setValue((prev) => (typeof prev === "boolean" ? (false as T) : ("" as T)));
    }, ms);

    return () => clearTimeout(id);
  }, [value, setValue, ms]);
}
