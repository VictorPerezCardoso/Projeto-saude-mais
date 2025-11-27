import { useState, useRef } from "react";

export function useTotemState() {
  const [step, setStep] = useState("welcome");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningFeedback, setListeningFeedback] = useState("");
  const [riskLevel, setRiskLevel] = useState(null);
  const [protocolNumber, setProtocolNumber] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [questionsAsked, setQuestionsAsked] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [isPatientCalled, setIsPatientCalled] = useState(false);
  const [callInfo, setCallInfo] = useState(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  const resetState = () => {
    // Limpar timer de resultados
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Limpar polling de chamadas
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    // Parar reconhecimento de voz
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {
        console.log("Speech recognition already stopped");
      }
    }

    // Resetar todos os states
    setStep("welcome");
    setFullName("");
    setAge("");
    setPhone("");
    setSymptoms("");
    setRiskLevel(null);
    setProtocolNumber("");
    setPatientId(null);
    setQuestionCount(0);
    setCurrentAnswer("");
    setAllAnswers([]);
    setQuestionsAsked([]);
    setTimeRemaining(90); // Importante: resetar para 90
    setListeningFeedback("");
    setIsPatientCalled(false);
    setCallInfo(null);
    setIsBlinking(false);
    setAiMessage("");
    setLoading(false);
    setIsRecording(false);
    setIsListening(false);

    console.log("Estado resetado completamente");
  };

  return {
    step,
    setStep,
    fullName,
    setFullName,
    age,
    setAge,
    phone,
    setPhone,
    symptoms,
    setSymptoms,
    isRecording,
    setIsRecording,
    isListening,
    setIsListening,
    listeningFeedback,
    setListeningFeedback,
    riskLevel,
    setRiskLevel,
    protocolNumber,
    setProtocolNumber,
    patientId,
    setPatientId,
    loading,
    setLoading,
    aiMessage,
    setAiMessage,
    questionCount,
    setQuestionCount,
    currentAnswer,
    setCurrentAnswer,
    allAnswers,
    setAllAnswers,
    questionsAsked,
    setQuestionsAsked,
    timeRemaining,
    setTimeRemaining,
    isPatientCalled,
    setIsPatientCalled,
    callInfo,
    setCallInfo,
    isBlinking,
    setIsBlinking,
    speechSupported,
    setSpeechSupported,
    mediaRecorderRef,
    chunksRef,
    timerRef,
    pollIntervalRef,
    speechRecognitionRef,
    resetState,
  };
}
