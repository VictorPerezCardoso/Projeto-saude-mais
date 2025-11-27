import { Stethoscope } from "lucide-react";

export function ProtocolCard({
  protocolNumber,
  isPatientCalled,
  callInfo,
  isBlinking,
}) {
  return (
    <div className="bg-[#F8FAFF] rounded-2xl p-8 space-y-4">
      <div className="text-center">
        <p className="text-[#7B8198] font-inter text-sm mb-2">
          Seu Número de Protocolo
        </p>
        <p
          className={`text-4xl font-poppins font-bold text-[#2E39C9] ${isBlinking && !isPatientCalled ? "animate-pulse" : ""}`}
        >
          {protocolNumber}
        </p>
      </div>

      {isPatientCalled && callInfo && (
        <div className="border-t border-[#ECEFF9] pt-4 space-y-3">
          <div className="flex items-center justify-center gap-2 text-green-600">
            <Stethoscope size={20} />
            <p className="font-inter font-semibold">
              Informações do Atendimento
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 text-center">
            <p className="text-lg font-poppins font-bold text-[#2E39C9]">
              Sala {callInfo.room_number}
            </p>
            <p className="text-base font-inter text-[#7B8198]">
              Dr(a). {callInfo.doctor_name}
            </p>
          </div>
        </div>
      )}

      <div className="border-t border-[#ECEFF9] pt-4">
        <p className="text-[#7B8198] font-inter text-sm text-center">
          {isPatientCalled
            ? "Dirija-se à sala indicada acima"
            : "Guarde este número. Você será chamado em breve."}
        </p>
      </div>
    </div>
  );
}
