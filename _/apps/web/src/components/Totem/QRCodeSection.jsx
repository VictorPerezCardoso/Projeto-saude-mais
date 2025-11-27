import { generateQRCode, downloadQRCode } from "@/utils/qrCodeHelpers";

export function QRCodeSection({ protocolNumber }) {
  return (
    <div className="text-center space-y-2">
      <p className="text-[#7B8198] font-inter text-sm">
        QR Code para visualizar seus dados:
      </p>
      <div className="bg-white border-2 border-[#ECEFF9] rounded-lg p-4 inline-block">
        <img
          src={generateQRCode(protocolNumber)}
          alt="QR Code do Protocolo"
          className="w-[250px] h-[250px]"
        />
      </div>
      <p className="text-[#7B8198] font-inter text-xs mt-2">
        Escaneie com seu celular para visualizar seus dados
      </p>
      <button
        onClick={() => downloadQRCode(protocolNumber)}
        className="mt-4 px-6 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] transition-colors inline-block"
      >
        📥 Baixar QR Code
      </button>
    </div>
  );
}
