export function WelcomeStep({ onStart }) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-poppins font-semibold text-[#1E2559]">
          Bem-vindo!
        </h2>
        <p className="text-[#7B8198] font-inter text-lg">
          Clique no botão abaixo para iniciar o processo de triagem.
        </p>
      </div>
      <button
        onClick={onStart}
        className="w-full bg-[#2E39C9] text-white font-poppins font-semibold text-xl py-6 rounded-xl hover:bg-[#1E2A99] active:bg-[#1B2080] transition-colors duration-200"
      >
        INICIAR
      </button>
    </div>
  );
}
