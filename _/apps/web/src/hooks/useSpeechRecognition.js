import { useEffect } from "react";

export function useSpeechRecognition({
  step,
  fullName,
  phone,
  speechRecognitionRef,
  setSpeechSupported,
  setIsListening,
  setListeningFeedback,
  setFullName,
  setPhone,
  setSymptoms,
  setCurrentAnswer,
}) {
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);

    if (SpeechRecognition) {
      speechRecognitionRef.current = new SpeechRecognition();
      speechRecognitionRef.current.lang = "pt-BR";
      speechRecognitionRef.current.continuous = false;
      speechRecognitionRef.current.interimResults = true;

      speechRecognitionRef.current.onstart = () => {
        setIsListening(true);
        setListeningFeedback("Escutando...");
      };

      speechRecognitionRef.current.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (interimTranscript || finalTranscript) {
          setListeningFeedback(finalTranscript || interimTranscript);
        }

        if (finalTranscript) {
          if (step === "patient_info") {
            if (!fullName) {
              setFullName(finalTranscript.trim());
            } else if (!phone) {
              setPhone(finalTranscript.trim());
            }
          } else if (step === "symptoms") {
            setSymptoms(finalTranscript.trim());
          } else if (step === "questionnaire") {
            setCurrentAnswer(finalTranscript.trim());
          }
        }
      };

      speechRecognitionRef.current.onerror = (event) => {
        console.error("Erro no reconhecimento de fala:", event.error);
        setListeningFeedback(`Erro: ${event.error}`);
      };

      speechRecognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [
    step,
    fullName,
    phone,
    speechRecognitionRef,
    setSpeechSupported,
    setIsListening,
    setListeningFeedback,
    setFullName,
    setPhone,
    setSymptoms,
    setCurrentAnswer,
  ]);

  const startVoiceRecognition = () => {
    if (!speechRecognitionRef.current) {
      alert("Reconhecimento de voz não é suportado neste navegador");
      return;
    }

    try {
      speechRecognitionRef.current.start();
    } catch (error) {
      console.error("Erro ao iniciar reconhecimento de voz:", error);
    }
  };

  const stopVoiceRecognition = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
  };

  return {
    startVoiceRecognition,
    stopVoiceRecognition,
  };
}
