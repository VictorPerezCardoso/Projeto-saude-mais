export const getQuestionType = (aiMessage) => {
  if (!aiMessage) return null;

  const messageLower = aiMessage.toLowerCase();

  if (
    messageLower.includes("intensidade") ||
    messageLower.includes("1 a 5") ||
    messageLower.includes("1 ao 5")
  ) {
    return "intensity";
  }

  if (
    messageLower.includes("sim ou não") ||
    messageLower.includes("sim/não") ||
    (messageLower.endsWith("?") &&
      (messageLower.includes("você") ||
        messageLower.includes("tem") ||
        messageLower.includes("teve") ||
        messageLower.includes("sente")))
  ) {
    return "yesno";
  }

  return null;
};
