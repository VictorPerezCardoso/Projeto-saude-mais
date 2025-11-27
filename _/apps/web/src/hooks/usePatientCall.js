import { useState } from "react";

export function usePatientCall(onSuccess) {
  const [calledPatients, setCalledPatients] = useState(new Set());
  const [callingPatientId, setCallingPatientId] = useState(null);

  const playNotificationSound = () => {
    try {
      // Criar um beep usando Web Audio API
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequência do beep
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.log("Não foi possível reproduzir o som:", error);
    }
  };

  const callPatient = async (patient, rooms, loadPatients, loadRooms) => {
    if (rooms.length === 0) {
      alert("⚠️ Nenhuma sala disponível no momento");
      return;
    }

    try {
      setCallingPatientId(patient.id);
      const room = rooms[0];

      console.log("📞 [CALL-PATIENT] Iniciando chamada do paciente:", {
        patient: patient.full_name,
        protocol: patient.protocol_number,
        room: room.room_number,
        doctor: room.doctor_name,
      });

      // 1. Criar a consulta
      console.log("🏥 [CALL-PATIENT] Criando consulta...");
      const consultationResponse = await fetch("/api/consultations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient.id,
          room_id: room.id,
          doctor_name: room.doctor_name,
          notes: "",
        }),
      });

      if (!consultationResponse.ok) {
        const errorData = await consultationResponse.json();
        console.error("❌ [CALL-PATIENT] Erro ao criar consulta:", errorData);
        throw new Error(errorData.error || "Erro ao chamar paciente");
      }

      const consultationData = await consultationResponse.json();
      console.log(
        "✅ [CALL-PATIENT] Consulta criada com sucesso:",
        consultationData,
      );

      // 2. Enviar notificação ao paciente
      console.log("📱 [CALL-PATIENT] Enviando notificação...");
      const notificationResponse = await fetch(
        "/api/notifications/call-patient",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patient.id,
            room_number: room.room_number,
            message: `${patient.full_name}, você foi chamado para a sala ${room.room_number}. Dirija-se ao consultório do Dr(a). ${room.doctor_name}.`,
          }),
        },
      );

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json();
        console.error(
          "❌ [CALL-PATIENT] Erro ao enviar notificação:",
          errorData,
        );
        throw new Error(errorData.error || "Erro ao enviar notificação");
      }

      const notificationData = await notificationResponse.json();
      console.log(
        "✅ [CALL-PATIENT] Notificação enviada com sucesso:",
        notificationData,
      );

      // 3. Reproduzir som de notificação
      console.log("🔊 [CALL-PATIENT] Reproduzindo som de confirmação...");
      playNotificationSound();

      // 4. Ativar animação de destaque
      console.log("✨ [CALL-PATIENT] Ativando animação de destaque...");
      setCalledPatients((prev) => new Set([...prev, patient.id]));

      // 5. Remover animação e recarregar dados após 5 segundos
      setTimeout(async () => {
        console.log(
          "🔄 [CALL-PATIENT] Removendo destaque e recarregando dados...",
        );
        setCalledPatients((prev) => {
          const newSet = new Set(prev);
          newSet.delete(patient.id);
          return newSet;
        });
        await loadPatients();
        await loadRooms();
        console.log("✅ [CALL-PATIENT] Dados recarregados");
      }, 5000);

      // Mostrar mensagem de sucesso
      const successMessage = `✅ PACIENTE CHAMADO COM SUCESSO!\n\n👤 ${patient.full_name}\n🎫 Protocolo: ${patient.protocol_number}\n🏥 Sala: ${room.room_number}\n👨‍⚕️ Dr(a). ${room.doctor_name}\n\n📱 Notificação enviada ao paciente!\n🔊 O paciente receberá um alerta sonoro e visual.`;

      console.log("🎉 [CALL-PATIENT] Processo concluído com sucesso!");
      alert(successMessage);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("❌ [CALL-PATIENT] Erro completo no processo:", error);
      alert(
        `❌ Erro ao chamar paciente: ${error.message}\n\nVerifique o console para mais detalhes.`,
      );
    } finally {
      setCallingPatientId(null);
      console.log("🏁 [CALL-PATIENT] Processo finalizado");
    }
  };

  return {
    calledPatients,
    callingPatientId,
    callPatient,
  };
}
