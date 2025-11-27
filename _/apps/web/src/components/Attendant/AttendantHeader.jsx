import { LogOut } from "lucide-react";

export function AttendantHeader() {
  return (
    <header className="bg-white border-b border-[#ECEFF9] sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-[#2E39C9]">
            Saúde Mais
          </h1>
          <p className="text-sm text-[#7B8198]">Painel de Atendente</p>
        </div>
        <button className="flex items-center gap-2 text-[#7B8198] hover:text-[#1E2559] font-inter">
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </header>
  );
}
