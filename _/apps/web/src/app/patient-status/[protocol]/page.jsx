"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  Bell,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function PatientStatusPage({ params }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCalled, setIsCalled] = useState(false);
  const [calledInfo, setCalledInfo] = useState(null);
  const hasPlayedSoundRef = useRef(false);
  const hasShownNotificationRef = useRef(false);

  const protocol = params.protocol;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔍 Buscando paciente com protocolo:", protocol);

        const response = await fetch(
          `/api/patients/get?protocol_number=${encodeURIComponent(protocol)}`,
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Paciente não encontrado com este protocolo");
          } else {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
          }
        }

        const data = await response.json();
        console.log("✅ Dados do paciente recebidos:", data);
        setPatient(data);
      } catch (err) {
        console.error("❌ Erro ao buscar paciente:", err);
        setError(err.message || "Erro ao carregar dados do paciente");
      } finally {
        setLoading(false);
      }
    };

    if (protocol) {
      fetchPatient();
    }
  }, [protocol]);

  // Polling para verificar se o paciente foi chamado (mais frequente)
  useEffect(() => {
    if (!patient) return;

    const checkIfCalled = async () => {
      try {
        const response = await fetch(
          `/api/patients/check-call-status?patient_id=${patient.id}`,
        );
        if (response.ok) {
          const data = await response.json();

          console.log("🔄 Status de chamada:", data);

          if (data.is_called && !isCalled) {
            console.log("🔔 PACIENTE CHAMADO! Ativando notificação...");
            setIsCalled(true);
            setCalledInfo({
              room_number: data.room_number,
              doctor_name: data.doctor_name,
              called_at: data.called_at,
            });

            // Reproduzir som de notificação ALTO (apenas uma vez)
            if (!hasPlayedSoundRef.current) {
              hasPlayedSoundRef.current = true;
              console.log("🔊 Tentando reproduzir som...");

              // Tentar reproduzir som com múltiplas estratégias
              playLoudNotificationSound();

              // Backup: tentar novamente após 100ms caso falhe
              setTimeout(() => {
                console.log("🔊 Tentando reproduzir som novamente (backup)...");
                playLoudNotificationSound();
              }, 100);

              // Vibrar o dispositivo se suportado (padrão longo e forte)
              if ("vibrate" in navigator) {
                console.log("📳 Ativando vibração...");
                navigator.vibrate([500, 200, 500, 200, 500, 200, 500]);
              }

              // Mostrar notificação nativa se permitido
              if (!hasShownNotificationRef.current) {
                hasShownNotificationRef.current = true;
                if (
                  "Notification" in window &&
                  Notification.permission === "granted"
                ) {
                  console.log("🔔 Mostrando notificação nativa...");
                  new Notification("🔔 Saúde Mais - VOCÊ FOI CHAMADO!", {
                    body: `${patient.full_name}, dirija-se à Sala ${data.room_number}\nDr(a). ${data.doctor_name}`,
                    icon: "/favicon.ico",
                    tag: "patient-call",
                    requireInteraction: true,
                    vibrate: [500, 200, 500, 200, 500],
                  });
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ Erro ao verificar status:", error);
      }
    };

    // Verificar a cada 2 segundos (mais rápido)
    const interval = setInterval(checkIfCalled, 2000);

    // Primeira verificação imediata
    checkIfCalled();

    return () => clearInterval(interval);
  }, [patient, isCalled]);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("📱 Permissão de notificação:", permission);
      });
    }
  }, []);

  // Função para reproduzir som de notificação ALTO (sequência de 5 beeps crescentes)
  const playLoudNotificationSound = () => {
    try {
      console.log(
        "🔊 [playLoudNotificationSound] Iniciando reprodução de som...",
      );

      // Estratégia 1: Usar Web Audio API
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();

        // Garantir que o contexto está rodando
        if (audioContext.state === "suspended") {
          audioContext.resume().then(() => {
            playSoundSequence(audioContext);
          });
        } else {
          playSoundSequence(audioContext);
        }
      }

      // Estratégia 2: Usar HTML5 Audio como backup
      try {
        // Criar múltiplos beeps usando data URLs
        const frequencies = [600, 750, 900, 1050, 1200];
        frequencies.forEach((freq, index) => {
          setTimeout(() => {
            const audio = new Audio();
            // Gerar tom usando data URL
            const duration = 0.5;
            const sampleRate = 44100;
            const samples = duration * sampleRate;
            const buffer = new ArrayBuffer(samples * 2);
            const view = new DataView(buffer);

            for (let i = 0; i < samples; i++) {
              const sample =
                Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.8;
              view.setInt16(i * 2, sample * 32767, true);
            }

            const blob = new Blob([buffer], { type: "audio/wav" });
            audio.src = URL.createObjectURL(blob);
            audio.volume = 1.0;
            audio.play().catch(console.error);
          }, index * 700);
        });
      } catch (audioError) {
        console.error("❌ Erro no backup de áudio:", audioError);
      }

      // Estratégia 3: Usar beep simples como último recurso
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            // Criar beep usando oscillator simples
            try {
              const context = new (
                window.AudioContext || window.webkitAudioContext
              )();
              const oscillator = context.createOscillator();
              const gainNode = context.createGain();

              oscillator.connect(gainNode);
              gainNode.connect(context.destination);

              oscillator.frequency.value = 800 + i * 100;
              oscillator.type = "sine";
              gainNode.gain.setValueAtTime(0.8, context.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                context.currentTime + 0.5,
              );

              oscillator.start(context.currentTime);
              oscillator.stop(context.currentTime + 0.5);
            } catch (e) {
              console.error("❌ Erro no beep simples:", e);
            }
          }, i * 600);
        }
      }, 100);
    } catch (error) {
      console.error("❌ Erro geral ao reproduzir som:", error);
    }
  };

  const playSoundSequence = (audioContext) => {
    try {
      // Sequência de 5 beeps crescentes e MUITO ALTOS
      const frequencies = [600, 750, 900, 1050, 1200];
      let time = audioContext.currentTime;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        // Volume ALTO e crescente
        const volume = 0.6 + index * 0.1; // De 0.6 a 1.0
        gainNode.gain.setValueAtTime(volume, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.6);

        oscillator.start(time);
        oscillator.stop(time + 0.6);

        time += 0.7;

        console.log(
          `🎵 Beep ${index + 1}/5 - Frequência: ${freq}Hz, Volume: ${volume.toFixed(2)}`,
        );
      });

      console.log("✅ Som de notificação reproduzido com sucesso");
    } catch (error) {
      console.error("❌ Erro ao reproduzir sequência de sons:", error);
    }
  };

  const getRiskColor = (level) => {
    const colors = {
      low: "bg-green-100 border-green-300 text-green-800",
      medium_low: "bg-yellow-100 border-yellow-300 text-yellow-800",
      medium_high: "bg-orange-100 border-orange-300 text-orange-800",
      high: "bg-red-100 border-red-300 text-red-800",
    };
    return colors[level] || "bg-gray-100";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-poppins font-bold text-[#2E39C9] mb-2">
              Saúde Mais
            </h1>
            <p className="text-[#7B8198] font-inter">Portal do Paciente</p>
            <p className="text-[#7B8198] font-inter text-sm mt-2">
              Protocolo: {protocol}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2E39C9] mx-auto mb-4"></div>
            <p className="text-[#7B8198] font-inter">
              Carregando informações do paciente...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-poppins font-bold text-[#2E39C9] mb-2">
            Saúde Mais
          </h1>
          <p className="text-[#7B8198] font-inter">Portal do Paciente</p>
        </div>

        {/* ALERTA GRANDE - Paciente foi chamado */}
        {isCalled && calledInfo && (
          <div className="mb-8 bg-gradient-to-r from-green-500 via-green-600 to-green-500 rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-12 text-white animate-call-alert border-4 border-green-300">
            <div className="text-center space-y-4 md:space-y-6">
              {/* Ícone animado de sino */}
              <div className="flex justify-center">
                <div className="bg-white rounded-full p-4 md:p-6 animate-bell-ring">
                  <Bell className="text-green-600" size={40} />
                </div>
              </div>

              {/* Título GRANDE e piscante - responsivo */}
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-poppins font-black animate-blink-strong uppercase tracking-wide drop-shadow-lg px-2">
                🔔 VOCÊ FOI CHAMADO! 🔔
              </h2>

              {/* Protocolo ENORME e piscante - responsivo e com quebra de texto */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-3xl p-4 md:p-8 animate-flash-strong border-4 border-white/40">
                <p className="text-xs md:text-base font-inter mb-2 md:mb-3 uppercase tracking-widest font-bold">
                  SEU PROTOCOLO
                </p>
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-black tracking-tight leading-none text-white drop-shadow-2xl animate-pulse-fast break-words overflow-hidden">
                  {patient.protocol_number}
                </p>
              </div>

              {/* Sala e Médico - DESTAQUE MÁXIMO - responsivo */}
              <div className="bg-white rounded-xl md:rounded-3xl p-4 md:p-8 text-left space-y-4 md:space-y-6 shadow-2xl">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="bg-green-100 rounded-xl md:rounded-2xl p-2 md:p-4 animate-bounce-gentle flex-shrink-0">
                    <ArrowRight className="text-green-600" size={28} />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="text-green-700 font-inter text-xs md:text-base uppercase tracking-wider font-bold mb-1 md:mb-2">
                      🏥 Dirija-se à
                    </p>
                    <p className="text-green-900 font-poppins font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight break-words overflow-hidden">
                      Sala {calledInfo.room_number}
                    </p>
                  </div>
                </div>

                <div className="border-t-4 border-green-100 pt-4 md:pt-6">
                  <p className="text-green-700 font-inter text-xs md:text-base uppercase tracking-wider font-bold mb-1 md:mb-2">
                    👨‍⚕️ Médico responsável
                  </p>
                  <p className="text-green-900 font-poppins font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl break-words overflow-hidden">
                    Dr(a). {calledInfo.doctor_name}
                  </p>
                </div>
              </div>

              {/* Instrução DESTACADA - responsivo */}
              <div className="bg-white/30 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border-2 border-white/50">
                <p className="text-white font-inter text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold animate-pulse-slow">
                  ⚡ Por favor, dirija-se à sala indicada IMEDIATAMENTE ⚡
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl shadow-lg p-8">
            <div className="flex items-start gap-4">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-1"
                size={24}
              />
              <div>
                <h2 className="text-lg font-poppins font-semibold text-red-800 mb-2">
                  Erro
                </h2>
                <p className="text-red-700 font-inter">{error}</p>
                <p className="text-red-600 font-inter text-sm mt-2">
                  Certifique-se de que o QR Code foi escaneado corretamente.
                </p>
              </div>
            </div>
          </div>
        )}

        {patient && !loading && !error && (
          <div className="space-y-6">
            {/* Patient Info Card */}
            <div
              className={`bg-white rounded-2xl shadow-lg p-8 transition-all ${
                isCalled ? "opacity-50" : ""
              }`}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-[#7B8198] font-inter text-sm mb-1">
                    NOME DO PACIENTE
                  </p>
                  <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
                    {patient.full_name}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#ECEFF9] pt-4">
                  <div>
                    <p className="text-[#7B8198] font-inter text-xs mb-1 uppercase tracking-wide">
                      IDADE
                    </p>
                    <p className="font-poppins font-semibold text-[#1E2559]">
                      {patient.age} anos
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7B8198] font-inter text-xs mb-1 uppercase tracking-wide">
                      TELEFONE
                    </p>
                    <p className="font-poppins font-semibold text-[#1E2559]">
                      {patient.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7B8198] font-inter text-xs mb-1 uppercase tracking-wide">
                      IDOSO
                    </p>
                    <p className="font-poppins font-semibold text-[#1E2559]">
                      {patient.is_elderly ? "Sim" : "Não"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#7B8198] font-inter text-xs mb-1 uppercase tracking-wide">
                      PROTOCOLO
                    </p>
                    <p className="font-poppins font-semibold text-[#2E39C9]">
                      {patient.protocol_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Level Card */}
            <div
              className={`rounded-2xl shadow-lg p-8 border-2 ${getRiskColor(patient.risk_level)} transition-all ${
                isCalled ? "opacity-50" : ""
              }`}
            >
              <div className="text-center space-y-2">
                <p className="font-inter text-sm uppercase tracking-wide">
                  Nível de Risco
                </p>
                <p className="text-3xl font-poppins font-bold">
                  {getRiskLevelText(patient.risk_level)}
                </p>
              </div>
            </div>

            {/* Symptoms Card */}
            {patient.symptoms && (
              <div
                className={`bg-white rounded-2xl shadow-lg p-8 transition-all ${
                  isCalled ? "opacity-50" : ""
                }`}
              >
                <h3 className="text-lg font-poppins font-semibold text-[#1E2559] mb-4">
                  Sintomas Relatados
                </h3>
                <p className="text-[#7B8198] font-inter">{patient.symptoms}</p>
              </div>
            )}

            {/* Queue Status Card - apenas se NÃO foi chamado */}
            {!isCalled && (
              <div className="border-2 rounded-2xl shadow-lg p-8 bg-blue-50 border-[#2E39C9]">
                <div className="flex items-start gap-4">
                  <Clock
                    className="text-[#2E39C9] flex-shrink-0 mt-1 animate-pulse-slow"
                    size={24}
                  />
                  <div>
                    <h3 className="text-lg font-poppins font-semibold mb-2 text-[#1E2559]">
                      ⏳ Aguardando Chamada
                    </h3>
                    <p className="font-inter text-[#7B8198]">
                      Você está na fila para atendimento. Quando for sua vez,
                      esta página exibirá um grande alerta com a sala e o médico
                      responsável.
                    </p>
                    <p className="font-inter text-[#7B8198] mt-2 text-sm">
                      <strong>Dica:</strong> Mantenha esta página aberta para
                      ser notificado instantaneamente!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Important Info */}
            <div
              className={`bg-[#F8FAFF] rounded-2xl border border-[#ECEFF9] p-6 transition-all ${
                isCalled ? "opacity-50" : ""
              }`}
            >
              <p className="text-[#7B8198] font-inter text-sm">
                <strong>Importante:</strong>{" "}
                {isCalled
                  ? "Você foi chamado! Dirija-se à sala indicada o mais breve possível."
                  : "Mantenha este número de protocolo à mão. Você será chamado por este número quando sua consulta estiver pronta."}
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        /* Animação de flash FORTE para o protocolo */
        @keyframes flash-strong {
          0%,
          40% {
            opacity: 1;
            transform: scale(1);
            filter: brightness(1);
          }
          50%,
          90% {
            opacity: 0.4;
            transform: scale(1.05);
            filter: brightness(1.5);
          }
        }

        /* Animação de piscar FORTE para o título */
        @keyframes blink-strong {
          0%,
          40% {
            opacity: 1;
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          }
          50%,
          90% {
            opacity: 0.3;
            text-shadow: 0 0 40px rgba(255, 255, 255, 1);
          }
        }

        /* Animação de pulse RÁPIDA */
        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.02);
          }
        }

        /* Animação de pulse LENTA */
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Animação de bounce SUAVE */
        @keyframes bounce-gentle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        /* Animação de sino balançando */
        @keyframes bell-ring {
          0%,
          100% {
            transform: rotate(0deg);
          }
          10% {
            transform: rotate(-15deg);
          }
          20% {
            transform: rotate(15deg);
          }
          30% {
            transform: rotate(-10deg);
          }
          40% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(0deg);
          }
        }

        /* Animação de alerta geral do card */
        @keyframes call-alert {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          }
          50% {
            transform: scale(1.01);
            box-shadow: 0 25px 50px rgba(34, 197, 94, 0.4);
          }
        }

        .animate-flash-strong {
          animation: flash-strong 1s ease-in-out infinite;
        }

        .animate-blink-strong {
          animation: blink-strong 1s ease-in-out infinite;
        }

        .animate-pulse-fast {
          animation: pulse-fast 1.5s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }

        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }

        .animate-bell-ring {
          animation: bell-ring 2s ease-in-out infinite;
        }

        .animate-call-alert {
          animation: call-alert 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
