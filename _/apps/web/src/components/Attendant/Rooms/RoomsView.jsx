import { RoomsHeader } from "./RoomsHeader";
import { RoomCard } from "./RoomCard";

export function RoomsView({ rooms, onCreateRoom, onEditRoom, onReleaseRoom }) {
  return (
    <div className="space-y-6">
      <RoomsHeader onCreateRoom={onCreateRoom} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={onEditRoom}
            onRelease={onReleaseRoom}
          />
        ))}

        {rooms.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center">
            <p className="text-[#7B8198] font-inter">Nenhuma sala cadastrada</p>
          </div>
        )}
      </div>
    </div>
  );
}
