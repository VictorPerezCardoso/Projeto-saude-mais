import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "day"; // 'day', 'week', 'month'

    let dateFilter = "AND p.created_at >= NOW() - INTERVAL '1 day'";
    if (period === "week") {
      dateFilter = "AND p.created_at >= NOW() - INTERVAL '7 days'";
    } else if (period === "month") {
      dateFilter = "AND p.created_at >= NOW() - INTERVAL '30 days'";
    }

    // Total de pacientes atendidos
    const totalAttended = await sql(
      `SELECT COUNT(*) as total FROM consultations WHERE finished_at IS NOT NULL ${dateFilter.replace("p.created_at", "attended_at")}`,
    );

    // Pacientes por nível de risco
    const riskStats = await sql(
      `SELECT risk_level, COUNT(*) as total FROM patients WHERE 1=1 ${dateFilter} GROUP BY risk_level`,
    );

    // Pacientes idosos atendidos
    const elderlyStats = await sql(
      `SELECT COUNT(*) as total FROM patients WHERE is_elderly = true ${dateFilter}`,
    );

    // Tempo médio de atendimento
    const avgTime = await sql(
      `SELECT AVG(EXTRACT(EPOCH FROM (finished_at - attended_at))/60) as avg_minutes 
       FROM consultations WHERE finished_at IS NOT NULL ${dateFilter.replace("p.created_at", "attended_at")}`,
    );

    // Pacientes em espera
    const waitingPatients = await sql(
      `SELECT COUNT(*) as total FROM queues WHERE status = 'waiting'`,
    );

    return Response.json({
      period,
      totalAttended: totalAttended[0]?.total || 0,
      riskStats: riskStats.map((r) => ({
        risk_level: r.risk_level,
        total: r.total,
      })),
      elderlyCount: elderlyStats[0]?.total || 0,
      avgTimeMinutes: Math.round(avgTime[0]?.avg_minutes || 0),
      waitingCount: waitingPatients[0]?.total || 0,
    });
  } catch (error) {
    console.error("Erro ao obter estatísticas:", error);
    return Response.json(
      { error: "Erro ao obter estatísticas" },
      { status: 500 },
    );
  }
}
