import sql from "@/app/api/utils/sql";

export async function PUT(request) {
  try {
    const { id, room_number, doctor_name, specialty, status } =
      await request.json();

    if (!id) {
      return Response.json(
        { error: "ID da sala é obrigatório" },
        { status: 400 },
      );
    }

    // Verificar se a sala existe
    const existingRoom = await sql`
      SELECT * FROM consultation_rooms WHERE id = ${id}
    `;

    if (existingRoom.length === 0) {
      return Response.json({ error: "Sala não encontrada" }, { status: 404 });
    }

    // Construir query de update dinamicamente
    const updateFields = [];
    const updateValues = [];
    let paramCount = 0;

    if (room_number !== undefined) {
      // Verificar se o novo número já existe em outra sala
      const duplicateRoom = await sql`
        SELECT id FROM consultation_rooms 
        WHERE room_number = ${room_number} AND id != ${id}
      `;

      if (duplicateRoom.length > 0) {
        return Response.json(
          { error: "Já existe outra sala com este número" },
          { status: 400 },
        );
      }

      updateFields.push(`room_number = $${++paramCount}`);
      updateValues.push(room_number);
    }

    if (doctor_name !== undefined) {
      updateFields.push(`doctor_name = $${++paramCount}`);
      updateValues.push(doctor_name);
    }

    if (specialty !== undefined) {
      updateFields.push(`specialty = $${++paramCount}`);
      updateValues.push(specialty);
    }

    if (status !== undefined) {
      updateFields.push(`status = $${++paramCount}`);
      updateValues.push(status);
    }

    if (updateFields.length === 0) {
      return Response.json(
        { error: "Nenhum campo para atualizar fornecido" },
        { status: 400 },
      );
    }

    // Adicionar ID ao final dos parâmetros
    updateValues.push(id);
    const whereClause = `id = $${++paramCount}`;

    const query = `
      UPDATE consultation_rooms 
      SET ${updateFields.join(", ")} 
      WHERE ${whereClause}
      RETURNING *
    `;

    const updatedRoom = await sql(query, updateValues);

    // Log da ação
    await sql`
      INSERT INTO system_logs (action, description, created_at)
      VALUES (
        'ROOM_UPDATED',
        ${"Sala " + (room_number || existingRoom[0].room_number) + " atualizada"},
        CURRENT_TIMESTAMP
      )
    `;

    return Response.json({
      success: true,
      room: updatedRoom[0],
      message: "Sala atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar sala:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
