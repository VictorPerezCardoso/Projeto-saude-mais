"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Play, RefreshCw } from "lucide-react";

export default function TestCallFlowPage() {
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Carregar pacientes
      const patientsResponse = await fetch("/api/patients/list");
      if (patientsResponse.ok) {
        const patientsData = await patientsResponse.json();
        setPatients(patientsData.patients || []);
      }

      // Carregar salas
      const roomsResponse = await fetch("/api/rooms/list");
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        setRooms(roomsData.rooms || []);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTestResult = (step, status, message, data = null) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp,
        step,
        status,
        message,
        data,
      },
    ]);
  };

  const testCallFlow = async (patient) => {
    if (!patient) return;

    setTestResults([]);
    setSelectedPatient(patient);

    addTestResult(
      "INÍCIO",
      "info",
      `Testando chamada do paciente: ${patient.full_name} (${patient.protocol_number})`,
    );

    try {
      // 1. Verificar status inicial
      addTestResult(
        "VERIFICAÇÃO",
        "info",
        "Verificando status inicial do paciente...",
      );

      const initialStatusResponse = await fetch(
        `/api/patients/check-call-status?patient_id=${patient.id}`,
      );
      if (initialStatusResponse.ok) {
        const initialStatus = await initialStatusResponse.json();
        addTestResult(
          "VERIFICAÇÃO",
          "success",
          `Status inicial: ${initialStatus.is_called ? "JÁ CHAMADO" : "AGUARDANDO"}`,
          initialStatus,
        );
      }

      // 2. Simular chamada
      if (rooms.length === 0) {
        addTestResult("ERRO", "error", "Nenhuma sala disponível para teste");
        return;
      }

      const room = rooms[0];
      addTestResult(
        "CHAMADA",
        "info",
        `Chamando paciente para sala ${room.room_number} - Dr(a). ${room.doctor_name}`,
      );

      // 3. Criar consulta
      const consultationResponse = await fetch("/api/consultations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: patient.id,
          room_id: room.id,
          doctor_name: room.doctor_name,
          notes: "Teste de chamada automática",
        }),
      });

      if (consultationResponse.ok) {
        const consultationData = await consultationResponse.json();
        addTestResult(
          "CONSULTA",
          "success",
          "Consulta criada com sucesso",
          consultationData,
        );
      } else {
        const error = await consultationResponse.json();
        addTestResult(
          "CONSULTA",
          "error",
          `Erro ao criar consulta: ${error.error}`,
          error,
        );
        return;
      }

      // 4. Enviar notificação
      const notificationResponse = await fetch(
        "/api/notifications/call-patient",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patient_id: patient.id,
            room_number: room.room_number,
            message: `TESTE: ${patient.full_name}, você foi chamado para a sala ${room.room_number}.`,
          }),
        },
      );

      if (notificationResponse.ok) {
        const notificationData = await notificationResponse.json();
        addTestResult(
          "NOTIFICAÇÃO",
          "success",
          "Notificação enviada com sucesso",
          notificationData,
        );
      } else {
        const error = await notificationResponse.json();
        addTestResult(
          "NOTIFICAÇÃO",
          "error",
          `Erro ao enviar notificação: ${error.error}`,
          error,
        );
        return;
      }

      // 5. Verificar status final
      addTestResult(
        "VERIFICAÇÃO FINAL",
        "info",
        "Aguardando 2 segundos e verificando status final...",
      );

      setTimeout(async () => {
        const finalStatusResponse = await fetch(
          `/api/patients/check-call-status?patient_id=${patient.id}`,
        );
        if (finalStatusResponse.ok) {
          const finalStatus = await finalStatusResponse.json();
          addTestResult(
            "VERIFICAÇÃO FINAL",
            "success",
            `Status final: ${finalStatus.is_called ? "CHAMADO ✅" : "ERRO - NÃO CHAMADO ❌"}`,
            finalStatus,
          );

          if (finalStatus.is_called) {
            addTestResult(
              "SUCESSO",
              "success",
              `🎉 TESTE CONCLUÍDO! Paciente chamado para sala ${finalStatus.room_number} - Dr(a). ${finalStatus.doctor_name}`,
            );
            addTestResult(
              "INSTRUÇÃO",
              "info",
              `📱 Agora acesse: /patient-status/${patient.protocol_number} para ver o alerta do paciente`,
            );
          }
        }
      }, 2000);
    } catch (error) {
      addTestResult(
        "ERRO GERAL",
        "error",
        `Erro durante o teste: ${error.message}`,
        error,
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="text-green-600" size={16} />;
      case "error":
        return <AlertCircle className="text-red-600" size={16} />;
      default:
        return <Bell className="text-blue-600" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-poppins font-bold text-[#2E39C9] mb-2">
            🧪 Teste de Fluxo de Chamada
          </h1>
          <p className="text-[#7B8198] font-inter">
            Teste completo do fluxo: Atendente → API → Paciente
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Painel de Controle */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-poppins font-semibold text-[#1E2559]">
                Painel de Controle
              </h2>
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#2E39C9] text-white rounded-lg hover:bg-[#1E2A99] disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
                Recarregar
              </button>
            </div>

            {/* Status */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-600 font-inter text-sm">Pacientes</p>
                <p className="text-2xl font-poppins font-bold text-blue-800">
                  {patients.length}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-green-600 font-inter text-sm">Salas</p>
                <p className="text-2xl font-poppins font-bold text-green-800">
                  {rooms.length}
                </p>
              </div>
            </div>

            {/* Lista de Pacientes */}
            <div className="space-y-3">
              <h3 className="font-poppins font-semibold text-[#1E2559]">
                Selecione um Paciente para Testar:
              </h3>
              {patients.length === 0 ? (
                <p className="text-[#7B8198] font-inter text-center py-4">
                  Nenhum paciente encontrado
                </p>
              ) : (
                patients.slice(0, 5).map((patient) => (
                  <div
                    key={patient.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPatient?.id === patient.id
                        ? "border-[#2E39C9] bg-blue-50"
                        : "border-[#ECEFF9] hover:border-[#2E39C9]"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-poppins font-semibold text-[#1E2559]">
                          {patient.full_name}
                        </p>
                        <p className="text-sm text-[#7B8198] font-inter">
                          Protocolo: {patient.protocol_number} | Idade:{" "}
                          {patient.age}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          testCallFlow(patient);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2E39C9] text-white rounded-lg hover:bg-[#1E2A99]"
                      >
                        <Play size={16} />
                        Testar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Log de Resultados */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-poppins font-semibold text-[#1E2559] mb-6">
              Log de Teste
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-[#7B8198] font-inter text-center py-8">
                  Selecione um paciente e clique em "Testar" para iniciar
                </p>
              ) : (
                testResults.map((result) => (
                  <div
                    key={result.id}
                    className={`border rounded-lg p-3 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-inter font-semibold text-xs">
                            {result.step}
                          </span>
                          <span className="text-xs opacity-70">
                            {result.timestamp}
                          </span>
                        </div>
                        <p className="font-inter text-sm">{result.message}</p>
                        {result.data && (
                          <details className="mt-2">
                            <summary className="text-xs cursor-pointer opacity-70">
                              Ver dados
                            </summary>
                            <pre className="text-xs mt-1 p-2 bg-black/5 rounded overflow-x-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instruções */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
          <h3 className="font-poppins font-semibold text-yellow-800 mb-3">
            📋 Como usar este teste:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700 font-inter text-sm">
            <li>Selecione um paciente da lista acima</li>
            <li>Clique em "Testar" para simular a chamada</li>
            <li>Acompanhe o log para ver cada etapa do processo</li>
            <li>
              Se bem-sucedido, acesse o link fornecido para ver o alerta do
              paciente
            </li>
            <li>Verifique se o som e as animações estão funcionando</li>
          </ol>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        
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
