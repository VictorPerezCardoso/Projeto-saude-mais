import { XCircle } from "lucide-react";

export function NoRoomsWarning() {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-6">
      <div className="flex items-start gap-3">
        <XCircle className="text-yellow-600 flex-shrink-0" size={24} />
        <div>
          <h3 className="text-lg font-poppins font-semibold text-yellow-800 mb-1">
            Nenhuma Sala Disponível
          </h3>
          <p className="text-yellow-700 font-inter text-sm">
            Para chamar pacientes, você precisa ter pelo menos uma sala
            disponível. Vá até a aba "Salas" para criar ou liberar uma sala.
          </p>
        </div>
      </div>
    </div>
  );
}
