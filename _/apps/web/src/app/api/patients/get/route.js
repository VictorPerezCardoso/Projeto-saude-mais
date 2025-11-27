import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  try {
    const url = new URL(request.url);
    const protocol_number = url.searchParams.get("protocol_number");
    const patient_id = url.searchParams.get("id");

    if (!protocol_number && !patient_id) {
      return Response.json(
        { error: "Protocol number ou ID é obrigatório" },
        { status: 400 },
      );
    }

    let patient;
    if (protocol_number) {
      patient = await sql`
        SELECT * FROM patients
        WHERE protocol_number = ${protocol_number}
      `;
    } else {
      patient = await sql`
        SELECT * FROM patients
        WHERE id = ${parseInt(patient_id)}
      `;
    }

    if (patient.length === 0) {
      return Response.json(
        { error: "Paciente não encontrado" },
        { status: 404 },
      );
    }

    return Response.json(patient[0]);
  } catch (error) {
    console.error("Erro ao obter paciente:", error);
    return Response.json({ error: "Erro ao obter paciente" }, { status: 500 });
  }
}
