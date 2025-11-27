import { Bell } from "lucide-react";

export function CallNotification({ callInfo, isBlinking }) {
  return (
    <div
      className={`${isBlinking ? "animate-pulse" : ""} bg-green-500 text-white rounded-2xl p-8 text-center space-y-4 border-4 border-green-300`}
    >
      <div className="flex items-center justify-center gap-3">
        <Bell className="animate-bounce" size={32} />
        <h2 className="text-3xl font-poppins font-bold">VOCÊ FOI CHAMADO!</h2>
        <Bell className="animate-bounce" size={32} />
      </div>
      <div className="space-y-2">
        <p className="text-xl font-inter">
          🏥 Dirija-se à <strong>SALA {callInfo.room_number}</strong>
        </p>
        <p className="text-lg font-inter">👨‍⚕️ Dr(a). {callInfo.doctor_name}</p>
        <p className="text-base font-inter opacity-90">
          Apresente-se na recepção da sala
        </p>
      </div>
    </div>
  );
}
