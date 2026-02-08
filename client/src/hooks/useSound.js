export const useSound = () => {
  const playPing = () => {
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    audio.volume = 0.1;
    audio.play().catch(e => console.log("Audio play failed", e));
  };
  return { playPing };
};