export function TimerDisplay({ timeRemaining }) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const progress = (timeRemaining / 60) * 100; // Progresso da barra (60 segundos = 100%) - alterado de 90

  // Mudar cor conforme o tempo restante
  const getTimerColor = () => {
    if (timeRemaining > 40) return "text-[#2E39C9]"; // Azul para mais de 40 segundos
    if (timeRemaining > 20) return "text-yellow-600"; // Amarelo para 20-40 segundos
    return "text-red-600"; // Vermelho para menos de 20 segundos
  };

  const getProgressColor = () => {
    if (timeRemaining > 40) return "bg-[#2E39C9]";
    if (timeRemaining > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center space-y-4">
      <p className="text-[#7B8198] font-inter text-sm">
        Retornando à tela inicial em:
      </p>

      <p className={`text-5xl font-poppins font-bold ${getTimerColor()}`}>
        {minutes}:{String(seconds).padStart(2, "0")}
      </p>

      {/* Barra de progresso */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-1000 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-[#7B8198] font-inter text-xs">
        O totem será resetado automaticamente
        {timeRemaining <= 20 && (
          <span
            className={`block mt-1 font-semibold ${timeRemaining <= 10 ? "animate-pulse text-red-600" : "text-yellow-600"}`}
          >
            {timeRemaining <= 10
              ? "⚠️ Resetando em breve!"
              : "⚠️ Preparando reset..."}
          </span>
        )}
      </p>
    </div>
  );
}
