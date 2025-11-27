import { CallNotification } from "./CallNotification";
import { RiskLevelCard } from "./RiskLevelCard";
import { ProtocolCard } from "./ProtocolCard";
import { QRCodeSection } from "./QRCodeSection";

export function ResultsStep({
  isPatientCalled,
  callInfo,
  isBlinking,
  riskLevel,
  age,
  protocolNumber,
  onReset,
}) {
  return (
    <div className="space-y-8">
      {isPatientCalled && callInfo && (
        <CallNotification callInfo={callInfo} isBlinking={isBlinking} />
      )}

      <RiskLevelCard riskLevel={riskLevel} age={age} />

      <ProtocolCard
        protocolNumber={protocolNumber}
        isPatientCalled={isPatientCalled}
        callInfo={callInfo}
        isBlinking={isBlinking}
      />

      <QRCodeSection protocolNumber={protocolNumber} />

      <button
        onClick={onReset}
        className="w-full bg-red-600 text-white font-poppins font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors"
      >
        Finalizar Atendimento
      </button>
    </div>
  );
}
