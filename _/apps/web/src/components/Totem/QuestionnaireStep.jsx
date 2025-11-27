import { Send, Mic } from "lucide-react";
import { ListeningFeedback } from "./ListeningFeedback";
import { QuickResponseButtons } from "./QuickResponseButtons";

export function QuestionnaireStep({
  questionCount,
  aiMessage,
  currentAnswer,
  setCurrentAnswer,
  isListening,
  listeningFeedback,
  isRecording,
  speechSupported,
  loading,
  questionType,
  onStartVoice,
  onStopVoice,
  onNext,
  onQuickResponse,
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#2E39C9] font-inter font-semibold">
          Pergunta {questionCount} de 5
        </h3>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-2 w-8 rounded ${
                i < questionCount ? "bg-[#2E39C9]" : "bg-[#ECEFF9]"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-[#F0F2FF] rounded-xl p-4">
        <p className="text-[#2E39C9] font-inter font-semibold">{aiMessage}</p>
      </div>

      {isListening && <ListeningFeedback feedback={listeningFeedback} />}

      <QuickResponseButtons
        questionType={questionType}
        onResponse={onQuickResponse}
      />

      <div className="space-y-2">
        <p className="text-[#7B8198] font-inter text-xs">
          {questionType ? "Ou digite sua resposta:" : "Digite sua resposta:"}
        </p>
        <textarea
          placeholder="Sua resposta..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9] min-h-[100px]"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onNext}
          disabled={loading}
          className="flex-1 bg-[#2E39C9] text-white font-poppins font-semibold py-3 rounded-lg hover:bg-[#1E2A99] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <Send size={20} />
          {questionCount >= 5 ? "Finalizar" : "Próxima"}
        </button>
        {speechSupported && (
          <button
            onClick={isRecording ? onStopVoice : onStartVoice}
            className={`flex-1 ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white font-poppins font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
          >
            <Mic size={20} />
            {isRecording ? "Parar" : "Falar"}
          </button>
        )}
      </div>

      {loading && (
        <p className="text-center text-[#7B8198] font-inter">
          Processando resposta...
        </p>
      )}
    </div>
  );
}
