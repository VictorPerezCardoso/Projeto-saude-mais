"use client";

import { useState } from "react";
import { useAttendantData } from "@/hooks/useAttendantData";
import { usePatientCall } from "@/hooks/usePatientCall";
import { useRoomManagement } from "@/hooks/useRoomManagement";
import { AttendantHeader } from "@/components/Attendant/AttendantHeader";
import { AttendantSidebar } from "@/components/Attendant/AttendantSidebar";
import { PatientQueueView } from "@/components/Attendant/PatientQueue/PatientQueueView";
import { RoomsView } from "@/components/Attendant/Rooms/RoomsView";
import { RoomModal } from "@/components/Attendant/Rooms/RoomModal";
import { StatsView } from "@/components/Attendant/Stats/StatsView";

export default function AttendantPage() {
  const [activeTab, setActiveTab] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");

  const { patients, rooms, stats, loadPatients, loadRooms } =
    useAttendantData();
  const { calledPatients, callingPatientId, callPatient } = usePatientCall();
  const {
    showRoomModal,
    setShowRoomModal,
    roomModalType,
    roomFormData,
    setRoomFormData,
    loading: roomLoading,
    handleCreateRoom,
    handleUpdateRoom,
    openCreateRoomModal,
    openEditRoomModal,
  } = useRoomManagement(loadRooms);

  const handleCallPatient = (patient) => {
    callPatient(patient, rooms, loadPatients, loadRooms);
  };

  const handleDeletePatient = async (patient) => {
    if (
      !confirm(
        `Tem certeza que deseja excluir o paciente ${patient.full_name}?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/patients/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.id }),
      });

      if (response.ok) {
        alert(`✅ Paciente ${patient.full_name} excluído com sucesso!`);
        await loadPatients();
        await loadRooms();
      } else {
        const error = await response.json();
        alert(`❌ Erro ao excluir paciente: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      alert("❌ Erro ao excluir paciente");
    }
  };

  const handleReleaseRoom = async (room) => {
    if (
      !confirm(`Tem certeza que deseja liberar a Sala ${room.room_number}?`)
    ) {
      return;
    }

    try {
      const response = await fetch("/api/rooms/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: room.id }),
      });

      if (response.ok) {
        alert(`✅ Sala ${room.room_number} liberada com sucesso!`);
        await loadRooms();
      } else {
        const error = await response.json();
        alert(`❌ Erro ao liberar sala: ${error.error}`);
      }
    } catch (error) {
      console.error("Erro ao liberar sala:", error);
      alert("❌ Erro ao liberar sala");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AttendantHeader />

      <div className="flex">
        <AttendantSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-6">
          {activeTab === "queue" && (
            <PatientQueueView
              patients={patients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onCallPatient={handleCallPatient}
              onDeletePatient={handleDeletePatient}
              callingPatientId={callingPatientId}
              calledPatients={calledPatients}
              rooms={rooms}
            />
          )}

          {activeTab === "rooms" && (
            <RoomsView
              rooms={rooms}
              onCreateRoom={openCreateRoomModal}
              onEditRoom={openEditRoomModal}
              onReleaseRoom={handleReleaseRoom}
            />
          )}

          {activeTab === "stats" && <StatsView stats={stats} />}
        </main>
      </div>

      <RoomModal
        show={showRoomModal}
        onClose={() => setShowRoomModal(false)}
        modalType={roomModalType}
        formData={roomFormData}
        setFormData={setRoomFormData}
        onSubmit={
          roomModalType === "create" ? handleCreateRoom : handleUpdateRoom
        }
        loading={roomLoading}
      />

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
