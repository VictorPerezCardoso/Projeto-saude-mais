import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const protocol = url.searchParams.get("protocol");
    const patientId = url.searchParams.get("patient_id");

    console.log("🔍 [CHECK-CALL-STATUS] Verificando status:", {
      protocol,
      patientId,
    });

    if (!protocol && !patientId) {
      return Response.json(
        { error: "Número do protocolo ou ID do paciente é obrigatório" },
        { status: 400 },
      );
    }

    let patient;

    if (protocol) {
      const result = await sql`
        SELECT id, full_name, protocol_number, called_at, called_to_room_number, 
               called_to_doctor_name, notification_acknowledged
        FROM patients 
        WHERE protocol_number = ${protocol}
      `;
      patient = result[0];
      console.log("🔍 [CHECK-CALL-STATUS] Busca por protocolo:", {
        protocol,
        found: !!patient,
      });
    } else {
      const result = await sql`
        SELECT id, full_name, protocol_number, called_at, called_to_room_number, 
               called_to_doctor_name, notification_acknowledged
        FROM patients 
        WHERE id = ${patientId}
      `;
      patient = result[0];
      console.log("🔍 [CHECK-CALL-STATUS] Busca por ID:", {
        patientId,
        found: !!patient,
      });
    }

    if (!patient) {
      console.error("❌ [CHECK-CALL-STATUS] Paciente não encontrado");
      return Response.json(
        { error: "Paciente não encontrado" },
        { status: 404 },
      );
    }

    const isCalled = !!patient.called_at;

    const response = {
      patient_id: patient.id,
      full_name: patient.full_name,
      protocol_number: patient.protocol_number,
      is_called: isCalled,
      called_at: patient.called_at,
      room_number: patient.called_to_room_number,
      doctor_name: patient.called_to_doctor_name,
      notification_acknowledged: patient.notification_acknowledged,
    };

    console.log("✅ [CHECK-CALL-STATUS] Status verificado:", {
      patient: patient.full_name,
      protocol: patient.protocol_number,
      is_called: isCalled,
      called_at: patient.called_at,
      room: patient.called_to_room_number,
    });

    return Response.json(response);
  } catch (error) {
    console.error("❌ [CHECK-CALL-STATUS] Erro ao verificar status:", error);
    return Response.json(
      { error: "Erro interno do servidor", details: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { patient_id, protocol } = await request.json();

    if (!patient_id && !protocol) {
      return Response.json(
        { error: "ID do paciente ou protocolo é obrigatório" },
        { status: 400 },
      );
    }

    // Marcar notificação como recebida/reconhecida
    let result;

    if (patient_id) {
      result = await sql`
        UPDATE patients 
        SET notification_acknowledged = TRUE 
        WHERE id = ${patient_id}
        RETURNING id, full_name, protocol_number
      `;
    } else {
      result = await sql`
        UPDATE patients 
        SET notification_acknowledged = TRUE 
        WHERE protocol_number = ${protocol}
        RETURNING id, full_name, protocol_number
      `;
    }

    if (result.length === 0) {
      return Response.json(
        { error: "Paciente não encontrado" },
        { status: 404 },
      );
    }

    return Response.json({
      success: true,
      message: "Notificação reconhecida com sucesso",
      patient: result[0],
    });
  } catch (error) {
    console.error("Erro ao reconhecer notificação:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
