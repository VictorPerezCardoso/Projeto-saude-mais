import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    // Buscar todos os pacientes que foram chamados (ordenados por hora da chamada)
    const calledPatients = await sql`
      SELECT 
        p.full_name,
        p.protocol_number,
        p.called_to_room_number,
        p.called_to_doctor_name,
        p.called_at,
        p.risk_level
      FROM patients p
      WHERE p.called_at IS NOT NULL
      ORDER BY p.called_at DESC
    `;

    return Response.json({
      success: true,
      patients: calledPatients,
      count: calledPatients.length,
    });
  } catch (error) {
    console.error("Erro ao buscar pacientes chamados:", error);
    return Response.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
