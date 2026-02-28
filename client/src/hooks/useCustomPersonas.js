import { useLocalStorage } from "./useLocalStorage";

export const useCustomPersonas = () => {
  const [customPersonas, setCustomPersonas] = useLocalStorage("aethel_custom_personas", []);

  const addPersona = (name, description, instruction) => {
    const newPersona = { id: `custom_${Date.now()}`, name, description, instruction, isCustom: true };
    setCustomPersonas([...customPersonas, newPersona]);
    return newPersona;
  };

  const deletePersona = (id) => {
    setCustomPersonas(customPersonas.filter(p => p.id !== id));
  };

  return { customPersonas, addPersona, deletePersona };
};