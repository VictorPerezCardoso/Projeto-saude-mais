"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Clock } from "lucide-react";

export default function CallsDisplayPage() {
  const [recentCalls, setRecentCalls] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef(null);

  // Atualizar relógio a cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Buscar chamadas recentes
  useEffect(() => {
    const fetchRecentCalls = async () => {
      try {
        const response = await fetch("/api/patients/called-list");
        if (response.ok) {
          const data = await response.json();
          const patients = data.patients || [];

          // Verificar se há novas chamadas
          if (patients.length > 0) {
            const newCalls = patients.filter(
              (call) =>
                !recentCalls.find(
                  (rc) => rc.protocol_number === call.protocol_number,
                ),
            );

            if (newCalls.length > 0) {
              console.log("🔔 Novas chamadas detectadas:", newCalls);

              // Reproduzir som de notificação
              playDisplaySound();

              // Atualizar lista
              setRecentCalls(patients.slice(0, 5)); // Mostrar apenas últimas 5
            } else {
              setRecentCalls(patients.slice(0, 5));
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar chamadas:", error);
      }
    };

    // Buscar a cada 2 segundos
    const interval = setInterval(fetchRecentCalls, 2000);

    // Primeira busca imediata
    fetchRecentCalls();

    return () => clearInterval(interval);
  }, [recentCalls]);

  const playDisplaySound = () => {
    try {
      const audioContext = new (
        window.AudioContext || window.webkitAudioContext
      )();

      // Som de notificação agradável
      const frequencies = [800, 1000, 1200];
      let time = audioContext.currentTime;

      frequencies.forEach((freq) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

        oscillator.start(time);
        oscillator.stop(time + 0.4);

        time += 0.5;
      });
    } catch (error) {
      console.log("Erro ao reproduzir som:", error);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeSinceCall = (calledAt) => {
    if (!calledAt) return "";

    const now = new Date();
    const callTime = new Date(calledAt);
    const diffMs = now - callTime;
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) return `${diffSecs}s atrás`;

    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}min atrás`;

    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h atrás`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E2559] via-[#2E39C9] to-[#4B5CFF] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-poppins font-black text-white mb-2">
                🏥 Saúde Mais
              </h1>
              <p className="text-2xl text-white/80 font-inter">
                Painel de Chamadas
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-poppins font-bold text-white mb-1">
                {formatTime(currentTime)}
              </div>
              <div className="text-lg text-white/80 font-inter">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {recentCalls.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-16 text-center border border-white/20">
            <Clock className="text-white/50 mx-auto mb-6" size={80} />
            <h2 className="text-4xl font-poppins font-bold text-white mb-4">
              Aguardando chamadas...
            </h2>
            <p className="text-xl text-white/70 font-inter">
              As chamadas aparecerão aqui automaticamente
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {recentCalls.map((call, index) => (
              <div
                key={call.id}
                className={`bg-white rounded-3xl p-8 shadow-2xl border-4 transition-all ${
                  index === 0
                    ? "border-green-400 animate-highlight-call scale-105"
                    : "border-white/20 opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Left Side - Patient Info */}
                  <div className="flex items-center gap-8">
                    {index === 0 && (
                      <div className="bg-green-500 rounded-full p-6 animate-bell-shake">
                        <Bell className="text-white" size={48} />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-6 py-2 bg-[#2E39C9] text-white rounded-xl text-2xl font-poppins font-bold">
                          {call.protocol_number}
                        </span>
                        {index === 0 && (
                          <span className="px-4 py-2 bg-green-500 text-white rounded-xl text-lg font-inter font-semibold animate-pulse">
                            🔔 CHAMADO AGORA
                          </span>
                        )}
                      </div>
                      <h2 className="text-4xl font-poppins font-bold text-[#1E2559] mb-2">
                        {call.full_name}
                      </h2>
                      <p className="text-xl text-[#7B8198] font-inter">
                        Protocolo de atendimento •{" "}
                        {getTimeSinceCall(call.called_at)}
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Room & Doctor */}
                  <div className="text-right">
                    <p className="text-lg text-[#7B8198] font-inter uppercase tracking-wider mb-2">
                      🏥 Dirija-se à
                    </p>
                    <div className="text-6xl font-poppins font-black text-[#2E39C9] mb-4">
                      SALA {call.called_to_room_number}
                    </div>
                    <p className="text-xl text-[#7B8198] font-inter">
                      👨‍⚕️ Dr(a). {call.called_to_doctor_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/60 font-inter text-lg">
            Atualização automática a cada 2 segundos
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes highlight-call {
          0%, 100% {
            box-shadow: 0 10px 40px rgba(34, 197, 94, 0.3);
          }
          50% {
            box-shadow: 0 10px 60px rgba(34, 197, 94, 0.6);
          }
        }

        @keyframes bell-shake {
          0%, 100% { 
            transform: rotate(0deg);
          }
          10%, 30% { 
            transform: rotate(-10deg);
          }
          20%, 40% { 
            transform: rotate(10deg);
          }
          50% { 
            transform: rotate(0deg);
          }
        }

        .animate-highlight-call {
          animation: highlight-call 2s ease-in-out infinite;
        }

        .animate-bell-shake {
          animation: bell-shake 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
