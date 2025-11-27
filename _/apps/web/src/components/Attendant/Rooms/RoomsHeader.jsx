import { Plus } from "lucide-react";

export function RoomsHeader({ onCreateRoom }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
        Salas de Atendimento
      </h2>
      <button
        onClick={onCreateRoom}
        className="flex items-center gap-2 px-6 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] transition-colors"
      >
        <Plus size={20} />
        Nova Sala
      </button>
    </div>
  );
}
