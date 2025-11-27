import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { consultation_id, patient_id, room_id } = body;

    if (!consultation_id || !patient_id || !room_id) {
      return Response.json(
        { error: "consultation_id, patient_id e room_id são obrigatórios" },
        { status: 400 },
      );
    }

    // Finalizar consulta
    const consultation = await sql`
      UPDATE consultations
      SET finished_at = NOW()
      WHERE id = ${consultation_id}
      RETURNING *
    `;

    // Atualizar fila para concluída
    await sql`
      UPDATE queues
      SET status = 'completed', completed_at = NOW()
      WHERE patient_id = ${patient_id}
    `;

    // Liberar sala
    await sql`
      UPDATE consultation_rooms
      SET status = 'available', current_patient_id = NULL
      WHERE id = ${room_id}
    `;

    return Response.json(consultation[0]);
  } catch (error) {
    console.error("Erro ao finalizar consulta:", error);
    return Response.json(
      { error: "Erro ao finalizar consulta" },
      { status: 500 },
    );
  }
}
