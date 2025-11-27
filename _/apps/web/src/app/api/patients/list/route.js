import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status"); // 'waiting', 'in_progress', 'completed'
    const risk_level = url.searchParams.get("risk_level");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    let queryParts = [];
    let params = [];
    let paramIndex = 1;

    // Query base com subquery para pegar apenas o último status de cada paciente
    let query = `
      SELECT p.* 
      FROM patients p
      LEFT JOIN LATERAL (
        SELECT status, created_at
        FROM queues
        WHERE patient_id = p.id
        ORDER BY created_at DESC
        LIMIT 1
      ) q ON true
      WHERE 1=1
    `;

    if (status) {
      if (status === "waiting") {
        query += ` AND (q.status = $${paramIndex} OR q.status IS NULL)`;
        params.push("waiting");
        paramIndex++;
      } else if (status === "in_progress") {
        query += ` AND q.status = $${paramIndex}`;
        params.push("in_progress");
        paramIndex++;
      } else if (status === "completed") {
        query += ` AND q.status = $${paramIndex}`;
        params.push("completed");
        paramIndex++;
      }
    }

    if (risk_level) {
      query += ` AND p.risk_level = $${paramIndex}`;
      params.push(risk_level);
      paramIndex++;
    }

    query += ` ORDER BY p.is_elderly DESC, 
      CASE 
        WHEN p.risk_level = 'high' THEN 1
        WHEN p.risk_level = 'medium_high' THEN 2
        WHEN p.risk_level = 'medium_low' THEN 3
        ELSE 4
      END ASC,
      p.created_at ASC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;

    params.push(limit, offset);

    console.log("Query patients/list:", query);
    console.log("Params:", params);

    const patients = await sql(query, params);
    console.log("Pacientes encontrados:", patients.length);

    // Contar total de pacientes com a mesma lógica
    let countQuery = `
      SELECT COUNT(*) as total 
      FROM patients p
      LEFT JOIN LATERAL (
        SELECT status, created_at
        FROM queues
        WHERE patient_id = p.id
        ORDER BY created_at DESC
        LIMIT 1
      ) q ON true
      WHERE 1=1
    `;
    let countParams = [];
    let countParamIndex = 1;

    if (status) {
      if (status === "waiting") {
        countQuery += ` AND (q.status = $${countParamIndex} OR q.status IS NULL)`;
        countParams.push("waiting");
        countParamIndex++;
      } else if (status === "in_progress") {
        countQuery += ` AND q.status = $${countParamIndex}`;
        countParams.push("in_progress");
        countParamIndex++;
      } else if (status === "completed") {
        countQuery += ` AND q.status = $${countParamIndex}`;
        countParams.push("completed");
        countParamIndex++;
      }
    }

    if (risk_level) {
      countQuery += ` AND p.risk_level = $${countParamIndex}`;
      countParams.push(risk_level);
    }

    const countResult = await sql(countQuery, countParams);

    return Response.json({
      data: patients,
      total: parseInt(countResult[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error("Erro ao listar pacientes:", error);
    return Response.json(
      { error: "Erro ao listar pacientes", details: error.message },
      { status: 500 },
    );
  }
}
