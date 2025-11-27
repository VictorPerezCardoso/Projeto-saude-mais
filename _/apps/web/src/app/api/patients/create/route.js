import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { full_name, age, phone, symptoms, risk_level } = body;

    console.log("🔵 Criando novo paciente:", {
      full_name,
      age,
      phone,
      risk_level,
    });

    if (!full_name || !age || !phone || !risk_level) {
      return Response.json(
        { error: "Nome, idade, telefone e nível de risco são obrigatórios" },
        { status: 400 },
      );
    }

    // Gerar número de protocolo: ANO + MÊS + NÚMERO SEQUENCIAL + IDENTIFICADOR DE RISCO
    const now = new Date();
    const yearMonth =
      now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0");

    // Obter o último ID para gerar sequencial
    const lastPatient =
      await sql`SELECT id FROM patients ORDER BY id DESC LIMIT 1`;
    const nextId = lastPatient.length > 0 ? lastPatient[0].id + 1 : 1;
    const sequential = String(nextId).padStart(4, "0");

    // Identifier de risco (H=high, MH=medium_high, ML=medium_low, L=low)
    const riskIdentifier =
      {
        high: "H",
        medium_high: "MH",
        medium_low: "ML",
        low: "L",
      }[risk_level] || "L";

    const protocol_number = `${yearMonth}${sequential}${riskIdentifier}`;
    const is_elderly = age >= 60;

    console.log("🔵 Protocolo gerado:", protocol_number);

    const patient = await sql`
      INSERT INTO patients (full_name, age, phone, symptoms, risk_level, protocol_number, is_elderly)
      VALUES (${full_name}, ${age}, ${phone}, ${symptoms || null}, ${risk_level}, ${protocol_number}, ${is_elderly})
      RETURNING *
    `;

    console.log("✅ Paciente criado:", patient[0].id);

    // Criar entrada na fila
    const queueEntry = await sql`
      INSERT INTO queues (patient_id, status)
      VALUES (${patient[0].id}, 'waiting')
      RETURNING *
    `;

    console.log("✅ Entrada na fila criada:", queueEntry[0]);

    return Response.json(patient[0], { status: 201 });
  } catch (error) {
    console.error("❌ Erro ao criar paciente:", error);
    return Response.json(
      { error: "Erro ao criar paciente", details: error.message },
      { status: 500 },
    );
  }
}
