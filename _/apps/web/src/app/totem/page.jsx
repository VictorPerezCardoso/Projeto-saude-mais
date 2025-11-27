"use client";

import { useTotemState } from "@/hooks/useTotemState";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { usePatientCallPolling } from "@/hooks/usePatientCallPolling";
import { useResultsTimer } from "@/hooks/useResultsTimer";
import { speakMessage } from "@/utils/speechSynthesis";
import { getQuestionType } from "@/utils/questionTypeDetector";
import {
  analyzeSymptoms,
  getNextQuestion,
  createPatient,
} from "@/utils/triageApi";
import { TotemHeader } from "@/components/Totem/TotemHeader";
import { WelcomeStep } from "@/components/Totem/WelcomeStep";
import { PatientInfoStep } from "@/components/Totem/PatientInfoStep";
import { SymptomsStep } from "@/components/Totem/SymptomsStep";
import { QuestionnaireStep } from "@/components/Totem/QuestionnaireStep";
import { ResultsStep } from "@/components/Totem/ResultsStep";

export default function TotemPage() {
  const state = useTotemState();

  const { startVoiceRecognition, stopVoiceRecognition } = useSpeechRecognition({
    step: state.step,
    fullName: state.fullName,
    phone: state.phone,
    speechRecognitionRef: state.speechRecognitionRef,
    setSpeechSupported: state.setSpeechSupported,
    setIsListening: state.setIsListening,
    setListeningFeedback: state.setListeningFeedback,
    setFullName: state.setFullName,
    setPhone: state.setPhone,
    setSymptoms: state.setSymptoms,
    setCurrentAnswer: state.setCurrentAnswer,
  });

  usePatientCallPolling({
    step: state.step,
    patientId: state.patientId,
    pollIntervalRef: state.pollIntervalRef,
    setIsPatientCalled: state.setIsPatientCalled,
    setCallInfo: state.setCallInfo,
    setIsBlinking: state.setIsBlinking,
  });

  useResultsTimer({
    step: state.step,
    timerRef: state.timerRef,
    setTimeRemaining: state.setTimeRemaining,
    onTimeout: state.resetState,
  });

  const handleWelcome = () => {
    state.setStep("patient_info");
    const message =
      "Olá! Bem-vindo ao sistema de triagem inteligente. Por favor, digite seu nome completo.";
    state.setAiMessage(message);
    speakMessage(message);
  };

  const handlePatientInfo = async () => {
    if (!state.fullName || !state.age) {
      alert("Por favor, preencha nome e idade");
      return;
    }

    if (!state.phone) {
      const message = "Agora preciso do seu número de telefone.";
      state.setAiMessage(message);
      speakMessage(message);
      return;
    }

    state.setStep("symptoms");
    const message =
      "Obrigado! Agora, por favor, descreva o que está sentindo. Você pode digitar ou clicar no microfone para falar.";
    state.setAiMessage(message);
    speakMessage(message);
  };

  const handleAnalyzeSymptoms = async () => {
    if (!state.symptoms) {
      alert("Por favor, descreva seus sintomas");
      return;
    }

    state.setLoading(true);
    try {
      const analysis = await analyzeSymptoms(state.symptoms, state.age);

      state.setRiskLevel(analysis.risk_level);
      state.setQuestionsAsked([analysis.question]);
      state.setQuestionCount(1);
      state.setAllAnswers([]);
      state.setCurrentAnswer("");
      state.setStep("questionnaire");
      state.setAiMessage(analysis.question);
      speakMessage(analysis.question);
    } catch (error) {
      console.error("Erro na análise:", error);
      alert("Erro ao processar análise de sintomas");
    } finally {
      state.setLoading(false);
    }
  };

  const handleAskNextQuestion = async () => {
    if (!state.currentAnswer.trim()) {
      alert("Por favor, responda a pergunta");
      return;
    }

    state.setLoading(true);
    try {
      const newAnswers = [...state.allAnswers, state.currentAnswer];
      state.setAllAnswers(newAnswers);
      state.setCurrentAnswer("");

      if (state.questionCount >= 5) {
        await completeTriagem(state.riskLevel, newAnswers);
        return;
      }

      if (state.riskLevel === "high") {
        await completeTriagem(state.riskLevel, newAnswers);
        return;
      }

      const analysis = await getNextQuestion(
        state.symptoms,
        state.age,
        state.questionsAsked,
        newAnswers,
      );

      state.setRiskLevel(analysis.risk_level);

      if (!analysis.question || state.questionCount >= 5) {
        await completeTriagem(analysis.risk_level, newAnswers);
        return;
      }

      state.setQuestionsAsked([...state.questionsAsked, analysis.question]);
      state.setQuestionCount(state.questionCount + 1);
      state.setAiMessage(analysis.question);
      speakMessage(analysis.question);
    } catch (error) {
      console.error("Erro ao obter próxima pergunta:", error);
      alert("Erro ao processar pergunta");
    } finally {
      state.setLoading(false);
    }
  };

  const handleQuickResponse = (response) => {
    state.setCurrentAnswer(response);
    setTimeout(() => {
      handleAskNextQuestion();
    }, 100);
  };

  const completeTriagem = async (risk, answers = []) => {
    state.setLoading(true);
    try {
      const allSymptoms = [state.symptoms, ...answers].join(" | ");

      const patient = await createPatient(
        state.fullName,
        state.age,
        state.phone,
        allSymptoms,
        risk,
      );

      state.setPatientId(patient.id);
      state.setRiskLevel(patient.risk_level);
      state.setProtocolNumber(patient.protocol_number);

      // Garantir que o timer está resetado antes de ir para results (alterado para 60 segundos)
      state.setTimeRemaining(60);

      state.setStep("results");

      const resultMessage = `Sua avaliação está completa! Nível de risco: ${getRiskLevelText(patient.risk_level)}. Seu número de protocolo é: ${patient.protocol_number}. Por favor, aguarde sua chamada.`;
      state.setAiMessage(resultMessage);
      speakMessage(resultMessage);

      console.log("Triagem completa, timer deve iniciar com 60 segundos");
    } catch (error) {
      console.error("Erro ao completar triagem:", error);
      alert("Erro ao finalizar triagem");
    } finally {
      state.setLoading(false);
    }
  };

  const getRiskLevelText = (level) => {
    const levels = {
      low: "Baixo risco",
      medium_low: "Risco médio baixo",
      medium_high: "Risco médio alto",
      high: "Alto risco",
    };
    return levels[level] || level;
  };

  const questionType = getQuestionType(state.aiMessage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 md:p-12">
        <TotemHeader />

        {state.step === "welcome" && <WelcomeStep onStart={handleWelcome} />}

        {state.step === "patient_info" && (
          <PatientInfoStep
            aiMessage={state.aiMessage}
            fullName={state.fullName}
            setFullName={state.setFullName}
            age={state.age}
            setAge={state.setAge}
            phone={state.phone}
            setPhone={state.setPhone}
            isListening={state.isListening}
            listeningFeedback={state.listeningFeedback}
            isRecording={state.isRecording}
            speechSupported={state.speechSupported}
            onStartVoice={startVoiceRecognition}
            onStopVoice={stopVoiceRecognition}
            onNext={handlePatientInfo}
          />
        )}

        {state.step === "symptoms" && (
          <SymptomsStep
            aiMessage={state.aiMessage}
            symptoms={state.symptoms}
            setSymptoms={state.setSymptoms}
            isListening={state.isListening}
            listeningFeedback={state.listeningFeedback}
            isRecording={state.isRecording}
            speechSupported={state.speechSupported}
            loading={state.loading}
            onStartVoice={startVoiceRecognition}
            onStopVoice={stopVoiceRecognition}
            onAnalyze={handleAnalyzeSymptoms}
          />
        )}

        {state.step === "questionnaire" && (
          <QuestionnaireStep
            questionCount={state.questionCount}
            aiMessage={state.aiMessage}
            currentAnswer={state.currentAnswer}
            setCurrentAnswer={state.setCurrentAnswer}
            isListening={state.isListening}
            listeningFeedback={state.listeningFeedback}
            isRecording={state.isRecording}
            speechSupported={state.speechSupported}
            loading={state.loading}
            questionType={questionType}
            onStartVoice={startVoiceRecognition}
            onStopVoice={stopVoiceRecognition}
            onNext={handleAskNextQuestion}
            onQuickResponse={handleQuickResponse}
          />
        )}

        {state.step === "results" && (
          <ResultsStep
            isPatientCalled={state.isPatientCalled}
            callInfo={state.callInfo}
            isBlinking={state.isBlinking}
            riskLevel={state.riskLevel}
            age={state.age}
            protocolNumber={state.protocolNumber}
            timeRemaining={state.timeRemaining}
            onReset={state.resetState}
          />
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }
        
        .animate-blink {
          animation: blink 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
