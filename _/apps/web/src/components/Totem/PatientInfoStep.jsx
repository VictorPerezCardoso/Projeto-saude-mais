import { ListeningFeedback } from "./ListeningFeedback";
import { VoiceButton } from "./VoiceButton";

export function PatientInfoStep({
  aiMessage,
  fullName,
  setFullName,
  age,
  setAge,
  phone,
  setPhone,
  isListening,
  listeningFeedback,
  isRecording,
  speechSupported,
  onStartVoice,
  onStopVoice,
  onNext,
}) {
  return (
    <div className="space-y-6">
      <div className="bg-[#F0F2FF] rounded-xl p-4">
        <p className="text-[#2E39C9] font-inter font-semibold">{aiMessage}</p>
      </div>

      {isListening && <ListeningFeedback feedback={listeningFeedback} />}

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
          />
          {speechSupported && (
            <VoiceButton
              isRecording={isRecording}
              onStart={onStartVoice}
              onStop={onStopVoice}
            />
          )}
        </div>
        <input
          type="number"
          placeholder="Idade"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full px-4 py-3 border-2 border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
        />
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="flex-1 px-4 py-3 border-2 border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
          />
          {speechSupported && !fullName && (
            <VoiceButton
              isRecording={isRecording}
              onStart={onStartVoice}
              onStop={onStopVoice}
            />
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full bg-[#2E39C9] text-white font-poppins font-semibold py-3 rounded-lg hover:bg-[#1E2A99] transition-colors"
      >
        Próximo
      </button>
    </div>
  );
}
