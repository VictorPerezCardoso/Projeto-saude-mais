import sql from "@/app/api/utils/sql";

export async function DELETE(request) {
  try {
    const { patient_id } = await request.json();

    if (!patient_id) {
      return Response.json(
        { error: "ID do paciente é obrigatório" },
        { status: 400 },
      );
    }

    console.log("🗑️ [DELETE-PATIENT] Excluindo paciente:", patient_id);

    // Verificar se o paciente existe
    const patient = await sql`
      SELECT * FROM patients WHERE id = ${patient_id}
    `;

    if (patient.length === 0) {
      return Response.json(
        { error: "Paciente não encontrado" },
        { status: 404 },
      );
    }

    const patientData = patient[0];

    // Excluir consultas relacionadas
    await sql`
      DELETE FROM consultations WHERE patient_id = ${patient_id}
    `;

    // Excluir da fila
    await sql`
      DELETE FROM queues WHERE patient_id = ${patient_id}
    `;

    // Limpar referência nas salas
    await sql`
      UPDATE consultation_rooms 
      SET current_patient_id = NULL, status = 'available'
      WHERE current_patient_id = ${patient_id}
    `;

    // Excluir o paciente
    await sql`
      DELETE FROM patients WHERE id = ${patient_id}
    `;

    // Log da ação
    await sql`
      INSERT INTO system_logs (action, description, created_at)
      VALUES (
        'PATIENT_DELETED',
        ${"Paciente " + patientData.full_name + " (protocolo: " + patientData.protocol_number + ") foi excluído do sistema"},
        CURRENT_TIMESTAMP
      )
    `;

    console.log(
      "✅ [DELETE-PATIENT] Paciente excluído com sucesso:",
      patientData.full_name,
    );

    return Response.json({
      success: true,
      message: "Paciente excluído com sucesso",
      patient: patientData,
    });
  } catch (error) {
    console.error("❌ [DELETE-PATIENT] Erro ao excluir paciente:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 },
    );
  }
}
