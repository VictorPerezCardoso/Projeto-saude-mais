export const generateQRCode = (protocolNumber) => {
  const url = `${window.location.origin}/patient-status/${protocolNumber}`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
};

export const downloadQRCode = async (protocolNumber) => {
  try {
    const qrUrl = generateQRCode(protocolNumber);
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `protocolo_${protocolNumber}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erro ao baixar QR code:", error);
    alert("Erro ao baixar QR code");
  }
};
