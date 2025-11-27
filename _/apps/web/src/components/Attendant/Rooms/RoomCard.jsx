import { Edit2, DoorOpen } from "lucide-react";

export function RoomCard({ room, onEdit, onRelease }) {
  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-[#2E39C9] transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-poppins font-bold text-[#1E2559]">
            Sala {room.room_number}
          </h3>
          <p className="text-[#7B8198] font-inter text-sm">{room.specialty}</p>
        </div>
        <div className="flex gap-2">
          {room.status === "occupied" && (
            <button
              onClick={() => onRelease(room)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Liberar sala"
            >
              <DoorOpen size={16} />
            </button>
          )}
          <button
            onClick={() => onEdit(room)}
            className="p-2 text-[#2E39C9] hover:bg-[#F0F2FF] rounded-lg transition-colors"
            title="Editar sala"
          >
            <Edit2 size={16} />
          </button>
          <span
            className={`px-3 py-1 rounded-lg text-xs font-inter font-semibold ${
              room.status === "available"
                ? "bg-green-100 text-green-700"
                : room.status === "occupied"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {room.status === "available"
              ? "Disponível"
              : room.status === "occupied"
                ? "Ocupada"
                : "Manutenção"}
          </span>
        </div>
      </div>
      <div className="border-t border-[#ECEFF9] pt-4">
        <p className="text-sm text-[#7B8198] font-inter mb-1">
          Médico responsável:
        </p>
        <p className="font-poppins font-semibold text-[#1E2559]">
          {room.doctor_name}
        </p>
      </div>
    </div>
  );
}
