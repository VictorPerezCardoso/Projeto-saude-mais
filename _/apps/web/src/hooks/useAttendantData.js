import { useState, useEffect } from "react";

export function useAttendantData() {
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/api/patients/list?status=waiting&limit=50",
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao carregar pacientes:", errorData);
        throw new Error("Erro ao carregar pacientes");
      }
      const data = await response.json();
      console.log("📋 Pacientes carregados:", data.data?.length || 0);
      setPatients(data.data || []);
    } catch (error) {
      console.error("❌ Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const response = await fetch("/api/rooms/list?status=available");
      if (!response.ok) throw new Error("Erro ao carregar salas");
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/analytics/stats?period=day");
      if (!response.ok) throw new Error("Erro ao carregar estatísticas");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const refreshAll = () => {
    loadPatients();
    loadRooms();
    loadStats();
  };

  useEffect(() => {
    refreshAll();

    // Auto-refresh a cada 10 segundos
    const refreshInterval = setInterval(() => {
      console.log("🔄 Auto-refresh: recarregando dados...");
      refreshAll();
    }, 10000); // 10 segundos

    return () => clearInterval(refreshInterval);
  }, []);

  return {
    patients,
    rooms,
    stats,
    loading,
    loadPatients,
    loadRooms,
    loadStats,
    refreshAll,
  };
}
