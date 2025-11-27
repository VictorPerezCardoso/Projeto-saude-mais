import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const patient_id = url.searchParams.get("patient_id");

    if (!patient_id) {
      return Response.json(
        { error: "patient_id é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se há uma consulta ativa ou recente para este paciente
    const consultations = await sql`
      SELECT 
        c.*,
        cr.room_number,
        cr.doctor_name
      FROM consultations c
      JOIN consultation_rooms cr ON c.room_id = cr.id
      WHERE c.patient_id = ${parseInt(patient_id)}
      AND c.finished_at IS NULL
      ORDER BY c.attended_at DESC
      LIMIT 1
    `;

    if (consultations.length === 0) {
      return Response.json({
        called: false,
        message: "Paciente ainda não foi chamado",
      });
    }

    const consultation = consultations[0];

    return Response.json({
      called: true,
      consultation_id: consultation.id,
      room_number: consultation.room_number,
      doctor_name: consultation.doctor_name,
      called_at: consultation.attended_at,
      message: `Paciente chamado para a sala ${consultation.room_number}`,
    });
  } catch (error) {
    console.error("Erro ao verificar status da consulta:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
