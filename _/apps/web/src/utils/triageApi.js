export const analyzeSymptoms = async (symptoms, age) => {
  const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `Você é um triador médico inteligente em um hospital. Baseado nos sintomas do paciente, faça UMA ÚNICA pergunta para melhor avaliar a urgência. A pergunta deve ser breve e direta.
          
          Responda APENAS em JSON com este formato:
          {"question": "uma pergunta aqui", "risk_level": "low|medium_low|medium_high|high"}
          
          Seja conciso!`,
        },
        {
          role: "user",
          content: `Sintomas: ${symptoms}\nIdade: ${age}\nIdoso (60+): ${age >= 60 ? "Sim" : "Não"}`,
        },
      ],
      json_schema: {
        name: "symptom_analysis",
        schema: {
          type: "object",
          properties: {
            question: {
              type: "string",
            },
            risk_level: {
              type: "string",
              enum: ["low", "medium_low", "medium_high", "high"],
            },
          },
          required: ["question", "risk_level"],
          additionalProperties: false,
        },
      },
    }),
  });

  if (!response.ok) throw new Error("Erro ao analisar sintomas");
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

export const getNextQuestion = async (
  symptoms,
  age,
  questionsAsked,
  allAnswers,
) => {
  const questionsContext = questionsAsked
    .map((q, i) => `P${i + 1}: ${q} | R${i + 1}: ${allAnswers[i] || ""}`)
    .join("\n");

  const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: `Você é um triador médico inteligente em um hospital. O paciente já respondeu algumas perguntas. Baseado nas respostas anteriores e na conversa, faça UMA ÚNICA pergunta adicional para melhor avaliar a urgência. A pergunta deve ser breve e direta. Se você já tem informações suficientes, indique um nível de risco final.
          
          Responda APENAS em JSON com este formato:
          {"question": "próxima pergunta ou null se tem informações suficientes", "risk_level": "low|medium_low|medium_high|high"}
          
          Seja conciso!`,
        },
        {
          role: "user",
          content: `Sintomas: ${symptoms}\nIdade: ${age}\nIdoso (60+): ${age >= 60 ? "Sim" : "Não"}\n\nRespostas anteriores:\n${questionsContext}`,
        },
      ],
      json_schema: {
        name: "next_question",
        schema: {
          type: "object",
          properties: {
            question: {
              type: ["string", "null"],
            },
            risk_level: {
              type: "string",
              enum: ["low", "medium_low", "medium_high", "high"],
            },
          },
          required: ["question", "risk_level"],
          additionalProperties: false,
        },
      },
    }),
  });

  if (!response.ok) throw new Error("Erro ao obter próxima pergunta");
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

export const createPatient = async (
  fullName,
  age,
  phone,
  symptoms,
  riskLevel,
) => {
  const response = await fetch("/api/patients/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name: fullName,
      age: parseInt(age),
      phone,
      symptoms,
      risk_level: riskLevel,
    }),
  });

  if (!response.ok) throw new Error("Erro ao criar paciente");
  return await response.json();
};
