import { Mic } from "lucide-react";

export function VoiceButton({ isRecording, onStart, onStop }) {
  return (
    <button
      onClick={isRecording ? onStop : onStart}
      className={`px-4 py-3 rounded-lg transition-colors flex items-center gap-2 ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-green-500 hover:bg-green-600 text-white"
      }`}
    >
      <Mic size={20} />
    </button>
  );
}
