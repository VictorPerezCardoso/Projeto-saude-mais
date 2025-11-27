export function RoomModal({
  show,
  onClose,
  modalType,
  formData,
  setFormData,
  onSubmit,
  loading,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <h3 className="text-xl font-poppins font-bold text-[#1E2559] mb-6">
          {modalType === "create" ? "Nova Sala" : "Editar Sala"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
              Número da Sala *
            </label>
            <input
              type="text"
              value={formData.room_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
              value={formData.doctor_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
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
              value={formData.specialty}
              onChange={(e) =>
                setFormData({
                  ...formData,
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

          {modalType === "edit" && (
            <div>
              <label className="block text-sm font-inter font-semibold text-[#1E2559] mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#ECEFF9] rounded-lg font-inter font-semibold text-[#7B8198] hover:bg-[#F8FAFF] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-[#2E39C9] text-white rounded-lg font-inter font-semibold hover:bg-[#1E2A99] disabled:opacity-50 transition-colors"
          >
            {modalType === "create" ? "Criar" : "Atualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
