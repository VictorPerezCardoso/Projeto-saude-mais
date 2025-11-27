import { Send, Mic } from "lucide-react";
import { ListeningFeedback } from "./ListeningFeedback";

export function SymptomsStep({
  aiMessage,
  symptoms,
  setSymptoms,
  isListening,
  listeningFeedback,
  isRecording,
  speechSupported,
  loading,
  onStartVoice,
  onStopVoice,
  onAnalyze,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-[#F0F2FF] rounded-xl p-4">
        <p className="text-[#2E39C9] font-inter font-semibold">{aiMessage}</p>
      </div>

      {isListening && <ListeningFeedback feedback={listeningFeedback} />}

      <textarea
        placeholder="Descreva seus sintomas..."
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        className="w-full px-4 py-3 border-2 border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9] min-h-[120px]"
      />

      <div className="flex gap-4">
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="flex-1 bg-[#2E39C9] text-white font-poppins font-semibold py-3 rounded-lg hover:bg-[#1E2A99] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <Send size={20} />
          Enviar
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
          Analisando seus sintomas...
        </p>
      )}
    </div>
  );
}
