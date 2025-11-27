import { FileText } from "lucide-react";
import { StatsCard } from "./StatsCard";

export function StatsView({ stats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
        Relatórios do Dia
      </h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard
            label="Atendidos"
            value={stats.totalAttended}
            color="text-[#2E39C9]"
          />
          <StatsCard
            label="Em Espera"
            value={stats.waitingCount}
            color="text-[#FF9500]"
          />
          <StatsCard
            label="Idosos"
            value={stats.elderlyCount}
            color="text-[#1E9E63]"
          />
          <StatsCard
            label="Tempo Médio"
            value={`${stats.avgTimeMinutes} min`}
            color="text-[#6B7280]"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] transition-colors">
          <FileText size={20} />
          Gerar Relatório PDF
        </button>
      </div>
    </div>
  );
}
