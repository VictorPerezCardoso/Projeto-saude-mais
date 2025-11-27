import { PatientQueueHeader } from "./PatientQueueHeader";
import { PatientCard } from "./PatientCard";
import { NoRoomsWarning } from "./NoRoomsWarning";

export function PatientQueueView({
  patients,
  searchTerm,
  setSearchTerm,
  onCallPatient,
  onDeletePatient,
  callingPatientId,
  calledPatients,
  rooms,
}) {
  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.protocol_number.includes(searchTerm),
  );

  return (
    <div className="space-y-6">
      <PatientQueueHeader
        patientCount={filteredPatients.length}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="grid gap-4">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <p className="text-[#7B8198] font-inter">
              Nenhum paciente em espera
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              patient={patient}
              onCall={onCallPatient}
              onDelete={onDeletePatient}
              isCallingPatientId={callingPatientId === patient.id}
              isCalledPatient={calledPatients.has(patient.id)}
              roomsAvailable={rooms.length > 0}
            />
          ))
        )}

        {rooms.length === 0 && <NoRoomsWarning />}
      </div>
    </div>
  );
}
