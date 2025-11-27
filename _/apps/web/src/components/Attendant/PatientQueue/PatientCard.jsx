import { Bell, CheckCircle2, Trash2 } from "lucide-react";
import { getRiskColor, getRiskLevelText } from "@/utils/riskHelpers";

export function PatientCard({
  patient,
  onCall,
  onDelete,
  isCallingPatientId,
  isCalledPatient,
  roomsAvailable,
}) {
  const isDisabled = isCallingPatientId || !roomsAvailable || isCalledPatient;

  return (
    <div
      className={`bg-white rounded-2xl p-6 border-2 transition-all ${
        isCalledPatient
          ? "border-green-400 bg-green-50 shadow-lg scale-[1.02]"
          : "border-[#ECEFF9] hover:border-[#2E39C9]"
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <span
              className={`px-3 py-1 rounded-lg text-sm font-inter font-semibold transition-all ${getRiskColor(patient.risk_level, isCalledPatient)}`}
            >
              {getRiskLevelText(patient.risk_level)}
            </span>
            {patient.is_elderly && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-inter font-semibold">
                👴 Idoso
              </span>
            )}
            {isCalledPatient && (
              <span className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm font-inter font-semibold animate-pulse flex items-center gap-1">
                <CheckCircle2 size={16} />
                CHAMADO!
              </span>
            )}
          </div>
          <h3 className="text-lg font-poppins font-semibold text-[#1E2559] mb-1">
            {patient.full_name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-inter text-[#7B8198]">
            <div>
              <span className="font-semibold">Idade:</span> {patient.age}
            </div>
            <div>
              <span className="font-semibold">Protocolo:</span>{" "}
              {patient.protocol_number}
            </div>
            <div>
              <span className="font-semibold">Telefone:</span> {patient.phone}
            </div>
          </div>
          {patient.symptoms && (
            <p className="text-sm text-[#7B8198] font-inter mt-2">
              <span className="font-semibold">Sintomas:</span>{" "}
              {patient.symptoms}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onDelete(patient)}
            className="px-4 py-3 rounded-lg font-inter font-semibold transition-all flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 hover:shadow-lg"
            title="Excluir paciente"
          >
            <Trash2 size={16} />
            Excluir
          </button>
          <button
            onClick={() => onCall(patient)}
            disabled={isDisabled}
            className={`px-6 py-3 rounded-lg font-inter font-semibold transition-all flex items-center gap-2 ${
              isCalledPatient
                ? "bg-green-500 text-white cursor-not-allowed"
                : isCallingPatientId
                  ? "bg-[#7B8198] text-white cursor-wait"
                  : "bg-[#2E39C9] text-white hover:bg-[#1E2A99] hover:shadow-lg"
            } disabled:opacity-50`}
          >
            {isCallingPatientId ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Chamando...
              </>
            ) : isCalledPatient ? (
              <>
                <CheckCircle2 size={16} />
                Chamado
              </>
            ) : (
              <>
                <Bell size={16} />
                Chamar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
