export function QuickResponseButtons({ questionType, onResponse }) {
  if (questionType === "intensity") {
    return (
      <div className="space-y-3">
        <p className="text-[#7B8198] font-inter text-sm text-center">
          Clique na intensidade ou fale sua resposta:
        </p>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((level) => (
            <button
              key={level}
              onClick={() => onResponse(level.toString())}
              className="py-3 px-2 bg-white border-2 border-[#2E39C9] text-[#2E39C9] rounded-lg font-poppins font-bold text-lg hover:bg-[#2E39C9] hover:text-white active:bg-[#1E2A99] transition-colors"
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (questionType === "yesno") {
    return (
      <div className="space-y-3">
        <p className="text-[#7B8198] font-inter text-sm text-center">
          Clique em uma opção ou fale sua resposta:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onResponse("Sim")}
            className="py-4 px-4 bg-white border-2 border-green-500 text-green-600 rounded-lg font-poppins font-bold text-lg hover:bg-green-500 hover:text-white active:bg-green-600 transition-colors"
          >
            ✓ SIM
          </button>
          <button
            onClick={() => onResponse("Não")}
            className="py-4 px-4 bg-white border-2 border-red-500 text-red-600 rounded-lg font-poppins font-bold text-lg hover:bg-red-500 hover:text-white active:bg-red-600 transition-colors"
          >
            ✗ NÃO
          </button>
        </div>
      </div>
    );
  }

  return null;
}
