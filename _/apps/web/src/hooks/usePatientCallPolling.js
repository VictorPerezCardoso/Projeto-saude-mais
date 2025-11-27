import { useEffect } from "react";

export function usePatientCallPolling({
  step,
  patientId,
  pollIntervalRef,
  setIsPatientCalled,
  setCallInfo,
  setIsBlinking,
}) {
  useEffect(() => {
    if (step === "results" && patientId) {
      startPollingForCall();
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [step, patientId]);

  const startPollingForCall = () => {
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/patients/check-call-status?patient_id=${patientId}`,
        );
        if (response.ok) {
          const data = await response.json();

          if (data.is_called && !data.notification_acknowledged) {
            setIsPatientCalled(true);
            setCallInfo({
              room_number: data.room_number,
              doctor_name: data.doctor_name,
              called_at: data.called_at,
            });

            setIsBlinking(true);
            playCallAlert();

            setTimeout(async () => {
              await acknowledgeCall();
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar status de chamada:", error);
      }
    }, 2000);
  };

  const playCallAlert = () => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.value = 1000;
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.8,
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.8);
        }, i * 1000);
      }
    } catch (error) {
      console.log("Não foi possível reproduzir o som:", error);
    }
  };

  const acknowledgeCall = async () => {
    try {
      await fetch("/api/patients/check-call-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patientId }),
      });

      setTimeout(() => {
        setIsBlinking(false);
      }, 5000);
    } catch (error) {
      console.error("Erro ao reconhecer notificação:", error);
    }
  };
}
