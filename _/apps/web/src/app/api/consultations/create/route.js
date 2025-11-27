import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      patient_id,
      room_id,
      doctor_name,
      notes,
      exam_results,
      return_date,
    } = body;

    if (!patient_id || !room_id || !doctor_name) {
      return Response.json(
        { error: "patient_id, room_id e doctor_name são obrigatórios" },
        { status: 400 },
      );
    }

    const consultation = await sql`
      INSERT INTO consultations (patient_id, room_id, doctor_name, notes, exam_results, return_date, attended_at)
      VALUES (${patient_id}, ${room_id}, ${doctor_name}, ${notes || null}, ${exam_results || null}, ${return_date || null}, NOW())
      RETURNING *
    `;

    // Atualizar fila para em progresso
    await sql`
      UPDATE queues
      SET status = 'in_progress', called_at = NOW()
      WHERE patient_id = ${patient_id} AND status = 'waiting'
    `;

    // Atualizar sala como ocupada
    await sql`
      UPDATE consultation_rooms
      SET status = 'occupied', current_patient_id = ${patient_id}
      WHERE id = ${room_id}
    `;

    return Response.json(consultation[0], { status: 201 });
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    return Response.json({ error: "Erro ao criar consulta" }, { status: 500 });
  }
}
