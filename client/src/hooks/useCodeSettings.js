import { useLocalStorage } from "./useLocalStorage";

export const useCodeSettings = () => {
  const [showLineNumbers, setShowLineNumbers] = useLocalStorage(
    "aethel_code_lines",
    true,
  );
  const [wordWrap, setWordWrap] = useLocalStorage("aethel_code_wrap", false);

  return { showLineNumbers, setShowLineNumbers, wordWrap, setWordWrap };
};
