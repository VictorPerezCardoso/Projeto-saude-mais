import { useState, useEffect } from "react";
import {
  Users,
  Settings,
  BarChart3,
  LogOut,
  Trash2,
  Edit2,
  Plus,
  Search,
  FileText,
} from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("attendants");
  const [attendants, setAttendants] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create"); // 'create', 'edit'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendant",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  // Estados para gerenciar salas
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomModalType, setRoomModalType] = useState("create"); // 'create', 'edit'
  const [roomFormData, setRoomFormData] = useState({
    id: null,
    room_number: "",
    doctor_name: "",
    specialty: "",
    status: "available",
  });

  useEffect(() => {
    if (activeTab === "attendants") loadAttendants();
    if (activeTab === "rooms") loadRooms();
    if (activeTab === "reports") loadStats();
  }, [activeTab, selectedPeriod]);

  const loadAttendants = async () => {
    try {
      setLoading(true);
      // Simular carregamento de atendentes
      // Em produção, chamaria uma API
      setAttendants([
        {
          id: 1,
          name: "Maria Silva",
          email: "maria@saude.com",
          role: "attendant",
        },
        {
          id: 2,
          name: "João Santos",
          email: "joao@saude.com",
          role: "attendant",
        },
        { id: 3, name: "Ana Costa", email: "ana@saude.com", role: "admin" },
      ]);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/rooms/list");
      if (!response.ok) throw new Error("Erro ao carregar salas");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  // Funções para gerenciar salas - similares ao attendant
  const handleCreateRoom = async () => {
    if (
      !roomFormData.room_number ||
      !roomFormData.doctor_name ||
      !roomFormData.specialty
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          room_number: roomFormData.room_number,
          doctor_name: roomFormData.doctor_name,
          specialty: roomFormData.specialty,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao criar sala");
      }

      alert("Sala criada com sucesso!");
      setShowRoomModal(false);
      setRoomFormData({
        id: null,
        room_number: "",
        doctor_name: "",
        specialty: "",
        status: "available",
      });
      loadRooms();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRoom = async () => {
    if (!roomFormData.id) {
      alert("ID da sala não encontrado");
      return;
    }

    if (
      !roomFormData.room_number ||
      !roomFormData.doctor_name ||
      !roomFormData.specialty
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/rooms/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: roomFormData.id,
          room_number: roomFormData.room_number,
          doctor_name: roomFormData.doctor_name,
          specialty: roomFormData.specialty,
          status: roomFormData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erro ao atualizar sala");
      }

      alert("Sala atualizada com sucesso!");
      setShowRoomModal(false);
      setRoomFormData({
        id: null,
        room_number: "",
        doctor_name: "",
        specialty: "",
        status: "available",
      });
      loadRooms();
    } catch (error) {
      console.error("Erro:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openCreateRoomModal = () => {
    setRoomModalType("create");
    setRoomFormData({
      id: null,
      room_number: "",
      doctor_name: "",
      specialty: "",
      status: "available",
    });
    setShowRoomModal(true);
  };

  const openEditRoomModal = (room) => {
    setRoomModalType("edit");
    setRoomFormData({
      id: room.id,
      room_number: room.room_number,
      doctor_name: room.doctor_name,
      specialty: room.specialty,
      status: room.status,
    });
    setShowRoomModal(true);
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/analytics/stats?period=${selectedPeriod}`,
      );
      if (!response.ok) throw new Error("Erro ao carregar estatísticas");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttendant = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);
      // Simular criação de atendente
      const newAttendant = {
        id: attendants.length + 1,
        ...formData,
      };
      setAttendants([...attendants, newAttendant]);
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "attendant" });
      alert("Atendente criado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar atendente");
    } finally {
      setLoading(false);
    }
  };

  const deleteAttendant = async (id) => {
    if (confirm("Tem certeza que deseja deletar este atendente?")) {
      try {
        setAttendants(attendants.filter((a) => a.id !== id));
        alert("Atendente deletado com sucesso!");
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao deletar atendente");
      }
    }
  };

  const filteredAttendants = attendants.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const generateReport = () => {
    // Simular geração de relatório
    alert("Relatório gerado em PDF!");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white border-b border-[#ECEFF9] sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-poppins font-bold text-[#2E39C9]">
              Saúde Mais
            </h1>
            <p className="text-sm text-[#7B8198]">Painel Administrativo</p>
          </div>
          <button className="flex items-center gap-2 text-[#7B8198] hover:text-[#1E2559] font-inter">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[#ECEFF9] p-6 hidden md:block">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("attendants")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "attendants"
                  ? "bg-[#2E39C9] text-white"
                  : "text-[#7B8198] hover:bg-[#F0F2FF]"
              }`}
            >
              <Users size={20} />
              <span className="font-inter font-medium">Atendentes</span>
            </button>
            <button
              onClick={() => setActiveTab("rooms")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "rooms"
                  ? "bg-[#2E39C9] text-white"
                  : "text-[#7B8198] hover:bg-[#F0F2FF]"
              }`}
            >
              <Settings size={20} />
              <span className="font-inter font-medium">Salas</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "reports"
                  ? "bg-[#2E39C9] text-white"
                  : "text-[#7B8198] hover:bg-[#F0F2FF]"
              }`}
            >
              <BarChart3 size={20} />
              <span className="font-inter font-medium">Relatórios</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "attendants" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
                  Gestão de Atendentes
                </h2>
                <button
                  onClick={() => {
                    setModalType("create");
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      role: "attendant",
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] transition-colors"
                >
                  <Plus size={20} />
                  Novo Atendente
                </button>
              </div>

              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-3 text-[#7B8198]"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Buscar atendente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                />
              </div>

              <div className="grid gap-4">
                {filteredAttendants.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <p className="text-[#7B8198] font-inter">
                      Nenhum atendente encontrado
                    </p>
                  </div>
                ) : (
                  filteredAttendants.map((attendant) => (
                    <div
                      key={attendant.id}
                      className="bg-white rounded-2xl p-6 border border-[#ECEFF9] hover:border-[#2E39C9] transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-poppins font-semibold text-[#1E2559] mb-1">
                            {attendant.name}
                          </h3>
                          <p className="text-sm text-[#7B8198] font-inter mb-2">
                            {attendant.email}
                          </p>
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-xs font-inter font-semibold ${
                              attendant.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {attendant.role === "admin"
                              ? "Administrador"
                              : "Atendente"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setFormData(attendant);
                              setModalType("edit");
                              setShowModal(true);
                            }}
                            className="p-2 text-[#2E39C9] hover:bg-[#F0F2FF] rounded-lg transition-colors"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => deleteAttendant(attendant.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "rooms" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
                  Gerenciar Salas
                </h2>
                <button
                  onClick={openCreateRoomModal}
                  className="flex items-center gap-2 px-6 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] transition-colors"
                >
                  <Plus size={20} />
                  Nova Sala
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-2xl p-6 border border-[#ECEFF9] hover:border-[#2E39C9] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-poppins font-bold text-[#1E2559]">
                          Sala {room.room_number}
                        </h3>
                        <p className="text-[#7B8198] font-inter text-sm">
                          {room.specialty}
                        </p>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => openEditRoomModal(room)}
                          className="p-2 text-[#2E39C9] hover:bg-[#F0F2FF] rounded-lg transition-colors"
                          title="Editar sala"
                        >
                          <Edit2 size={16} />
                        </button>
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-inter font-semibold ${
                            room.status === "available"
                              ? "bg-green-100 text-green-700"
                              : room.status === "occupied"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {room.status === "available"
                            ? "Disponível"
                            : room.status === "occupied"
                              ? "Ocupada"
                              : "Manutenção"}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-[#ECEFF9] pt-4">
                      <p className="text-sm text-[#7B8198] font-inter mb-1">
                        Médico:
                      </p>
                      <p className="font-poppins font-semibold text-[#1E2559] mb-4">
                        {room.doctor_name}
                      </p>
                    </div>
                  </div>
                ))}

                {rooms.length === 0 && (
                  <div className="col-span-full bg-white rounded-2xl p-8 text-center">
                    <p className="text-[#7B8198] font-inter">
                      Nenhuma sala cadastrada
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-poppins font-bold text-[#1E2559]">
                  Relatórios
                </h2>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                >
                  <option value="day">Hoje</option>
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                </select>
              </div>

              {stats && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
                      <p className="text-[#7B8198] font-inter text-sm mb-2">
                        Total Atendido
                      </p>
                      <p className="text-4xl font-poppins font-bold text-[#2E39C9]">
                        {stats.totalAttended}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
                      <p className="text-[#7B8198] font-inter text-sm mb-2">
                        Em Espera
                      </p>
                      <p className="text-4xl font-poppins font-bold text-[#FF9500]">
                        {stats.waitingCount}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
                      <p className="text-[#7B8198] font-inter text-sm mb-2">
                        Pacientes Idosos
                      </p>
                      <p className="text-4xl font-poppins font-bold text-[#1E9E63]">
                        {stats.elderlyCount}
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
                      <p className="text-[#7B8198] font-inter text-sm mb-2">
                        Tempo Médio
                      </p>
                      <p className="text-4xl font-poppins font-bold text-[#6B7280]">
                        {stats.avgTimeMinutes} min
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-6 border border-[#ECEFF9]">
                    <h3 className="text-lg font-poppins font-semibold text-[#1E2559] mb-4">
                      Pacientes por Nível de Risco
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {stats.riskStats.map((risk, idx) => (
                        <div key={idx} className="p-4 bg-[#F8FAFF] rounded-lg">
                          <p className="text-sm text-[#7B8198] font-inter mb-1 capitalize">
                            {risk.risk_level === "high"
                              ? "Alto Risco"
                              : risk.risk_level === "medium_high"
                                ? "Risco Médio Alto"
                                : risk.risk_level === "medium_low"
                                  ? "Risco Médio Baixo"
                                  : "Baixo Risco"}
                          </p>
                          <p className="text-2xl font-poppins font-bold text-[#1E2559]">
                            {risk.total}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={generateReport}
                    className="flex items-center gap-2 px-6 py-3 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] transition-colors"
                  >
                    <FileText size={20} />
                    Gerar Relatório PDF
                  </button>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal para Atendentes */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-poppins font-bold text-[#1E2559] mb-6">
              {modalType === "create" ? "Novo Atendente" : "Editar Atendente"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                />
              </div>

              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                />
              </div>

              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Senha
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                />
              </div>

              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Função
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                >
                  <option value="attendant">Atendente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter font-semibold text-[#7B8198] hover:bg-[#F8FAFF] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateAttendant}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] disabled:opacity-50 transition-colors"
              >
                {modalType === "create" ? "Criar" : "Atualizar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para Gerenciar Salas */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-poppins font-bold text-[#1E2559] mb-6">
              {roomModalType === "create" ? "Nova Sala" : "Editar Sala"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Número da Sala *
                </label>
                <input
                  type="text"
                  value={roomFormData.room_number}
                  onChange={(e) =>
                    setRoomFormData({
                      ...roomFormData,
                      room_number: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                  placeholder="Ex: 101, A1, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Nome do Médico *
                </label>
                <input
                  type="text"
                  value={roomFormData.doctor_name}
                  onChange={(e) =>
                    setRoomFormData({
                      ...roomFormData,
                      doctor_name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                  placeholder="Dr(a). Nome Completo"
                />
              </div>

              <div>
                <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                  Especialidade *
                </label>
                <select
                  value={roomFormData.specialty}
                  onChange={(e) =>
                    setRoomFormData({
                      ...roomFormData,
                      specialty: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                >
                  <option value="">Selecione a especialidade</option>
                  <option value="Clínica Geral">Clínica Geral</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Pediatria">Pediatria</option>
                  <option value="Ortopedia">Ortopedia</option>
                  <option value="Neurologia">Neurologia</option>
                  <option value="Ginecologia">Ginecologia</option>
                  <option value="Dermatologia">Dermatologia</option>
                  <option value="Oftalmologia">Oftalmologia</option>
                  <option value="Psiquiatria">Psiquiatria</option>
                  <option value="Radiologia">Radiologia</option>
                  <option value="Urgência">Urgência</option>
                  <option value="Emergência">Emergência</option>
                </select>
              </div>

              {roomModalType === "edit" && (
                <div>
                  <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                    Status
                  </label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) =>
                      setRoomFormData({
                        ...roomFormData,
                        status: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter focus:outline-none focus:border-[#2E39C9]"
                  >
                    <option value="available">Disponível</option>
                    <option value="occupied">Ocupada</option>
                    <option value="maintenance">Manutenção</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowRoomModal(false)}
                className="flex-1 px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter font-semibold text-[#7B8198] hover:bg-[#F8FAFF] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={
                  roomModalType === "create"
                    ? handleCreateRoom
                    : handleUpdateRoom
                }
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] disabled:opacity-50 transition-colors"
              >
                {roomModalType === "create" ? "Criar" : "Atualizar"}
              </button>
            </div>
          </div>
        </div>
      )}

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
