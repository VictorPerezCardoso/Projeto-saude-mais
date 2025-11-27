export const getRiskLevelText = (level) => {
  const levels = {
    low: "Baixo risco",
    medium_low: "Risco médio baixo",
    medium_high: "Risco médio alto",
    high: "Alto risco",
  };
  return levels[level] || level;
};

export const getRiskColor = (level) => {
  const colors = {
    low: "bg-green-500",
    medium_low: "bg-yellow-500",
    medium_high: "bg-orange-500",
    high: "bg-red-500",
  };
  return colors[level] || "bg-gray-500";
};
