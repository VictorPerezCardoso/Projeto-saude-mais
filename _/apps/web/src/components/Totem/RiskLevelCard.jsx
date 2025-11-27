import { getRiskLevelText, getRiskColor } from "@/utils/riskLevelHelpers";

export function RiskLevelCard({ riskLevel, age }) {
  return (
    <div
      className={`${getRiskColor(riskLevel)} text-white rounded-2xl p-8 text-center space-y-4`}
    >
      <h3 className="text-2xl font-poppins font-bold">Avaliação Completa</h3>
      <p className="text-lg font-inter">
        Nível de Risco: {getRiskLevelText(riskLevel)}
      </p>
      {age >= 60 && (
        <p className="text-sm font-inter">
          ✓ Paciente Idoso - Atendimento Prioritário
        </p>
      )}
    </div>
  );
}
