import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let query = "SELECT * FROM consultation_rooms WHERE 1=1";
    const params = [];

    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }

    query += " ORDER BY room_number ASC";

    const rooms = await sql(query, params);
    return Response.json(rooms);
  } catch (error) {
    console.error("Erro ao listar salas:", error);
    return Response.json({ error: "Erro ao listar salas" }, { status: 500 });
  }
}
