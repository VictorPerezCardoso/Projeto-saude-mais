import { Loader } from "lucide-react";

export function ListeningFeedback({ feedback }) {
  return (
    <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-4">
      <div className="flex items-center gap-3 mb-2">
        <Loader className="animate-spin text-blue-600" size={20} />
        <p className="text-blue-600 font-semibold">Escutando...</p>
      </div>
      <p className="text-blue-700 font-inter text-sm min-h-6">{feedback}</p>
    </div>
  );
}
