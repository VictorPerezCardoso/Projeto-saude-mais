import { Search } from "lucide-react";

export function PatientQueueHeader({
  patientCount,
  searchTerm,
  setSearchTerm,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
          Fila de Espera
        </h2>
        <p className="text-sm text-[#7B8198] font-inter mt-1">
          {patientCount} paciente(s) aguardando
        </p>
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-3 text-[#7B8198]" size={20} />
        <input
          type="text"
          placeholder="Buscar paciente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
        />
      </div>
    </div>
  );
}
