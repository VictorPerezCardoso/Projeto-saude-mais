import { Users, Stethoscope, BarChart3 } from "lucide-react";

export function AttendantSidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 bg-white border-r border-[#ECEFF9] p-6 hidden md:block">
      <nav className="space-y-2">
        <button
          onClick={() => setActiveTab("queue")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "queue"
              ? "bg-[#2E39C9] text-white"
              : "text-[#7B8198] hover:bg-[#F0F2FF]"
          }`}
        >
          <Users size={20} />
          <span className="font-inter font-medium">Fila de Espera</span>
        </button>
        <button
          onClick={() => setActiveTab("rooms")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "rooms"
              ? "bg-[#2E39C9] text-white"
              : "text-[#7B8198] hover:bg-[#F0F2FF]"
          }`}
        >
          <Stethoscope size={20} />
          <span className="font-inter font-medium">Salas</span>
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            activeTab === "stats"
              ? "bg-[#2E39C9] text-white"
              : "text-[#7B8198] hover:bg-[#F0F2FF]"
          }`}
        >
          <BarChart3 size={20} />
          <span className="font-inter font-medium">Relatórios</span>
        </button>
      </nav>
    </aside>
  );
}
