import { useState, useEffect } from "react";
import { AlertCircle, Clock, Bell, Hospital, User, Hash } from "lucide-react";

export default function PatientPortalPage() {
  const [calledPatients, setCalledPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar lista geral de pacientes chamados
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-poppins font-bold text-[#2E39C9] mb-2">
              Saúde Mais
            </h1>
            <p className="text-[#7B8198] font-inter text-lg">
              Portal do Paciente
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-poppins font-bold text-[#2E39C9] mb-2">
            Saúde Mais
          </h1>
          <p className="text-[#7B8198] font-inter text-lg">
            Portal do Paciente
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
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header da lista */}
            <div className="bg-[#2E39C9] text-white p-6">
              <div className="grid grid-cols-3 gap-4 font-poppins font-semibold text-center">
                <div className="flex items-center justify-center gap-2">
                  <User size={20} />
                  <span>Nome do Paciente</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Hash size={20} />
                  <span>Protocolo</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Hospital size={20} />
                  <span>Sala</span>
                </div>
              </div>
            </div>

            {/* Lista de pacientes */}
            <div className="divide-y divide-[#ECEFF9]">
              {calledPatients.map((patient, index) => (
                <div
                  key={patient.protocol_number}
                  className={`p-6 ${
                    index % 2 === 0 ? "bg-white" : "bg-[#F8FAFF]"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-4 items-center text-center">
                    {/* Nome */}
                    <div>
                      <p className="text-xl font-poppins font-bold text-[#1E2559] mb-1">
                        {patient.full_name}
                      </p>
                      <p className="text-[#7B8198] font-inter text-sm">
                        Chamado às {formatTime(patient.called_at)}
                      </p>
                    </div>

                    {/* Protocolo */}
                    <div>
                      <p className="text-3xl font-poppins font-bold text-[#2E39C9] animate-pulse">
                        {patient.protocol_number}
                      </p>
                    </div>

                    {/* Sala */}
                    <div>
                      <p className="text-2xl font-poppins font-bold text-[#1E2559] mb-1">
                        Sala {patient.called_to_room_number}
                      </p>
                      <p className="text-[#7B8198] font-inter">
                        Dr(a). {patient.called_to_doctor_name}
                      </p>
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
            <strong>Instruções:</strong> Quando seu nome e protocolo aparecerem
            nesta lista, dirija-se à sala indicada para seu atendimento médico.
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
