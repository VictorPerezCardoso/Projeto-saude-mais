import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { room_number, doctor_name, specialty } = await request.json();

    if (!room_number || !doctor_name || !specialty) {
      return Response.json(
        {
          error:
            "Número da sala, nome do médico e especialidade são obrigatórios",
        },
        { status: 400 },
      );
    }

    // Verificar se a sala já existe
    const existingRoom = await sql`
      SELECT id FROM consultation_rooms WHERE room_number = ${room_number}
    `;

    if (existingRoom.length > 0) {
      return Response.json(
        { error: "Já existe uma sala com este número" },
        { status: 400 },
      );
    }

    // Criar nova sala
    const newRoom = await sql`
      INSERT INTO consultation_rooms (room_number, doctor_name, specialty, status)
      VALUES (${room_number}, ${doctor_name}, ${specialty}, 'available')
      RETURNING *
    `;

    // Log da ação
    await sql`
      INSERT INTO system_logs (action, description, created_at)
      VALUES (
        'ROOM_CREATED',
        ${"Sala " + room_number + " criada com médico " + doctor_name + " (" + specialty + ")"},
        CURRENT_TIMESTAMP
      )
    `;

    return Response.json({
      success: true,
      room: newRoom[0],
      message: "Sala criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar sala:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
