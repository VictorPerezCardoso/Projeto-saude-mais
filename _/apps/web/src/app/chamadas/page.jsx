import { useState, useEffect } from "react";
import { Clock, CheckCircle2, Bell, Hospital, User, Hash } from "lucide-react";

export default function ChamadasPublicasPage() {
  const [calledPatients, setCalledPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCalledPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/patients/called-list");

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCalledPatients(data.patients || []);
      } catch (err) {
        console.error("Erro ao buscar pacientes chamados:", err);
        setError(err.message || "Erro ao carregar lista de chamadas");
      } finally {
        setLoading(false);
      }
    };

    // Primeira busca
    fetchCalledPatients();

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchCalledPatients, 5000);

    return () => clearInterval(interval);
  }, []);

  const getRiskColor = (level) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium_low: "bg-yellow-100 text-yellow-800",
      medium_high: "bg-orange-100 text-orange-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-poppins font-bold text-[#2E39C9] mb-2">
              Saúde Mais
            </h1>
            <p className="text-[#7B8198] font-inter text-lg">
              Chamadas de Atendimento - Painel Público
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E39C9] mx-auto mb-4"></div>
            <p className="text-[#7B8198] font-inter text-lg">
              Carregando lista de pacientes chamados...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-poppins font-bold text-[#2E39C9] mb-2">
            Saúde Mais
          </h1>
          <p className="text-[#7B8198] font-inter text-lg">
            Chamadas de Atendimento - Painel Público
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Bell className="text-[#2E39C9] animate-pulse" size={20} />
            <p className="text-[#7B8198] font-inter text-sm">
              Atualizado automaticamente a cada 5 segundos
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <Bell className="text-red-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-poppins font-semibold text-red-800">
                  Erro ao carregar
                </h3>
                <p className="text-red-700 font-inter">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-[#F8FAFF] border border-[#ECEFF9] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 text-center justify-center">
            <Hospital className="text-[#2E39C9]" size={24} />
            <p className="text-[#7B8198] font-inter">
              <strong className="text-[#2E39C9]">Pacientes Chamados:</strong>
              Acompanhe abaixo os pacientes que foram chamados para atendimento
            </p>
          </div>
        </div>

        {/* Lista de Pacientes Chamados */}
        {calledPatients.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Clock className="text-[#7B8198] mx-auto mb-4" size={48} />
            <h3 className="text-xl font-poppins font-semibold text-[#1E2559] mb-2">
              Nenhuma chamada ainda
            </h3>
            <p className="text-[#7B8198] font-inter">
              Os pacientes chamados para atendimento aparecerão aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header da tabela */}
            <div className="bg-[#2E39C9] text-white rounded-t-2xl p-6">
              <div className="grid grid-cols-4 gap-4 font-poppins font-semibold">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <span>Nome do Paciente</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Hash size={20} />
                  <span>Protocolo</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Hospital size={20} />
                  <span>Sala / Médico</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Clock size={20} />
                  <span>Chamado às</span>
                </div>
              </div>
            </div>

            {/* Lista de pacientes */}
            <div className="bg-white rounded-b-2xl shadow-lg overflow-hidden">
              {calledPatients.map((patient, index) => (
                <div
                  key={patient.protocol_number}
                  className={`p-6 border-b border-[#ECEFF9] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F8FAFF]"
                  } ${index === calledPatients.length - 1 ? "border-b-0" : ""}`}
                >
                  <div className="grid grid-cols-4 gap-4 items-center">
                    {/* Nome */}
                    <div>
                      <p className="font-poppins font-semibold text-[#1E2559] text-lg">
                        {patient.full_name}
                      </p>
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-inter font-medium ${getRiskColor(patient.risk_level)}`}
                      >
                        {patient.risk_level === "high"
                          ? "Alto Risco"
                          : patient.risk_level === "medium_high"
                            ? "Risco Médio Alto"
                            : patient.risk_level === "medium_low"
                              ? "Risco Médio"
                              : "Baixo Risco"}
                      </span>
                    </div>

                    {/* Protocolo */}
                    <div className="text-center">
                      <p className="text-2xl font-poppins font-bold text-[#2E39C9] animate-pulse">
                        {patient.protocol_number}
                      </p>
                    </div>

                    {/* Sala e Médico */}
                    <div className="text-center">
                      <p className="font-poppins font-bold text-[#1E2559] text-lg mb-1">
                        Sala {patient.called_to_room_number}
                      </p>
                      <p className="text-[#7B8198] font-inter text-sm">
                        Dr(a). {patient.called_to_doctor_name}
                      </p>
                    </div>

                    {/* Horário */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="text-green-600" size={20} />
                        <p className="font-poppins font-semibold text-[#1E2559]">
                          {formatTime(patient.called_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer com informações */}
        <div className="mt-8 bg-[#F8FAFF] border border-[#ECEFF9] rounded-2xl p-6 text-center">
          <p className="text-[#7B8198] font-inter text-sm">
            <strong>Instruções:</strong> Quando seu nome aparecer nesta lista,
            dirija-se à sala indicada para seu atendimento médico.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
        
        .font-poppins {
          font-family: 'Poppins', sans-serif;
        }
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </div>
  );
}
