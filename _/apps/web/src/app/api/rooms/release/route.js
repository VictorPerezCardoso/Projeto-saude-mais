import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { room_id } = await request.json();

    if (!room_id) {
      return Response.json(
        { error: "ID da sala é obrigatório" },
        { status: 400 },
      );
    }

    console.log("🚪 [RELEASE-ROOM] Liberando sala:", room_id);

    // Verificar se a sala existe
    const room = await sql`
      SELECT * FROM consultation_rooms WHERE id = ${room_id}
    `;

    if (room.length === 0) {
      return Response.json({ error: "Sala não encontrada" }, { status: 404 });
    }

    const roomData = room[0];

    // Liberar a sala
    const updatedRoom = await sql`
      UPDATE consultation_rooms 
      SET 
        current_patient_id = NULL,
        status = 'available'
      WHERE id = ${room_id}
      RETURNING *
    `;

    // Log da ação
    await sql`
      INSERT INTO system_logs (action, description, created_at)
      VALUES (
        'ROOM_RELEASED',
        ${"Sala " + roomData.room_number + " - Dr(a). " + roomData.doctor_name + " foi liberada"},
        CURRENT_TIMESTAMP
      )
    `;

    console.log(
      "✅ [RELEASE-ROOM] Sala liberada com sucesso:",
      roomData.room_number,
    );

    return Response.json({
      success: true,
      message: "Sala liberada com sucesso",
      room: updatedRoom[0],
    });
  } catch (error) {
    console.error("❌ [RELEASE-ROOM] Erro ao liberar sala:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 },
    );
  }
}
