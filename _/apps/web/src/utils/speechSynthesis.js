export const speakMessage = (message) => {
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = "pt-BR";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
};
