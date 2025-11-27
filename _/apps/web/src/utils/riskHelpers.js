export const getRiskColor = (level, isBlinking = false) => {
  const baseColors = {
    low: "text-green-600 bg-green-100",
    medium_low: "text-yellow-600 bg-yellow-100",
    medium_high: "text-orange-600 bg-orange-100",
    high: "text-red-600 bg-red-100",
  };

  const blinkingColors = {
    low: "text-green-800 bg-green-200 animate-pulse",
    medium_low: "text-yellow-800 bg-yellow-200 animate-pulse",
    medium_high: "text-orange-800 bg-orange-200 animate-pulse",
    high: "text-red-800 bg-red-200 animate-pulse",
  };

  if (isBlinking) {
    return (
      (blinkingColors[level] || "text-gray-600 bg-gray-100 animate-pulse") +
      " ring-2 ring-blue-400 ring-opacity-75"
    );
  }

  return baseColors[level] || "text-gray-600 bg-gray-100";
};

export const getRiskLevelText = (level) => {
  const levels = {
    low: "Baixo risco",
    medium_low: "Risco médio baixo",
    medium_high: "Risco médio alto",
    high: "Alto risco",
  };
  return levels[level] || level;
};
