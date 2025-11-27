import { useState } from "react";

export function useRoomManagement(loadRooms) {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomModalType, setRoomModalType] = useState("create"); // 'create', 'edit'
  const [roomFormData, setRoomFormData] = useState({
    id: null,
    room_number: "",
    doctor_name: "",
    specialty: "",
    status: "available",
  });
  const [loading, setLoading] = useState(false);

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

  return {
    showRoomModal,
    setShowRoomModal,
    roomModalType,
    roomFormData,
    setRoomFormData,
    loading,
    handleCreateRoom,
    handleUpdateRoom,
    openCreateRoomModal,
    openEditRoomModal,
  };
}
