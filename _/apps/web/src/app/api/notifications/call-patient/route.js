import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const { patient_id, room_number, message } = await request.json();

    console.log("🔔 [CALL-PATIENT] Iniciando chamada:", {
      patient_id,
      room_number,
    });

    if (!patient_id || !room_number) {
      return Response.json(
        { error: "patient_id e room_number são obrigatórios" },
        { status: 400 },
      );
    }

    // Buscar dados do paciente
    const patient = await sql`
      SELECT * FROM patients WHERE id = ${patient_id}
    `;

    if (patient.length === 0) {
      console.error("❌ [CALL-PATIENT] Paciente não encontrado:", patient_id);
      return Response.json(
        { error: "Paciente não encontrado" },
        { status: 404 },
      );
    }

    // Buscar dados da sala
    const room = await sql`
      SELECT * FROM consultation_rooms WHERE room_number = ${room_number}
    `;

    if (room.length === 0) {
      console.error("❌ [CALL-PATIENT] Sala não encontrada:", room_number);
      return Response.json({ error: "Sala não encontrada" }, { status: 404 });
    }

    const patientData = patient[0];
    const roomData = room[0];

    console.log("✅ [CALL-PATIENT] Dados encontrados:", {
      patient: patientData.full_name,
      protocol: patientData.protocol_number,
      room: roomData.room_number,
      doctor: roomData.doctor_name,
    });

    // Verificar se o paciente já foi chamado
    if (patientData.called_at) {
      console.log(
        "⚠️ [CALL-PATIENT] Paciente já foi chamado anteriormente:",
        patientData.called_at,
      );
    }

    // Marcar paciente como chamado no banco de dados
    const updateResult = await sql`
      UPDATE patients 
      SET 
        called_at = CURRENT_TIMESTAMP,
        called_to_room_number = ${room_number},
        called_to_doctor_name = ${roomData.doctor_name},
        notification_acknowledged = FALSE
      WHERE id = ${patient_id}
      RETURNING called_at, called_to_room_number, called_to_doctor_name
    `;

    console.log(
      "✅ [CALL-PATIENT] Paciente atualizado no banco:",
      updateResult[0],
    );

    // Log da notificação no sistema
    await sql`
      INSERT INTO system_logs (action, description, created_at)
      VALUES (
        'PATIENT_CALLED',
        ${"Paciente " + patientData.full_name + " (protocolo: " + patientData.protocol_number + ") foi chamado para a sala " + room_number + " - Dr(a). " + roomData.doctor_name},
        CURRENT_TIMESTAMP
      )
    `;

    // Payload da notificação
    const notificationPayload = {
      type: "PATIENT_CALL",
      patient: {
        id: patientData.id,
        name: patientData.full_name,
        protocol: patientData.protocol_number,
        risk_level: patientData.risk_level,
      },
      room_number,
      doctor_name: roomData.doctor_name,
      specialty: roomData.specialty,
      message:
        message ||
        `${patientData.full_name}, você foi chamado para a sala ${room_number} - Dr(a). ${roomData.doctor_name}`,
      timestamp: new Date().toISOString(),
      called_at: updateResult[0].called_at,
    };

    console.log(
      "🔔 [CALL-PATIENT] Notificação criada com sucesso:",
      notificationPayload,
    );

    return Response.json({
      success: true,
      message: "Paciente chamado com sucesso",
      notification: notificationPayload,
      patient_updated: updateResult[0],
    });
  } catch (error) {
    console.error("❌ [CALL-PATIENT] Erro ao chamar paciente:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 },
    );
  }
}
