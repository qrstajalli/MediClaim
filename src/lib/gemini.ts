export const callGeminiChat = async (message: string, history: any[], context: any, language: string = "en") => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY in .env");
  }

  let systemPrompt = `You are ClaimSetu, an expert, highly empathetic Indian health insurance claim assistant.
You are chatting with a user on WhatsApp.

CRITICAL INSTRUCTIONS:
1. LANGUAGE RULES: The user has selected the language code '${language}'. You MUST respond EXCLUSIVELY in this language. If the code is 'hi', reply in Hindi (Devanagari script). If 'ta', reply in Tamil. If 'ml', reply in Malayalam. If 'bn', reply in Bengali. If 'en', reply in English. HOWEVER, if the user is talking in Hinglish (a mix of Hindi and English, or Hindi written in English script), you MUST ALWAYS reply in Hinglish, regardless of the selected language code. It is strictly required to translate all your thoughts and responses into the appropriate target language.
2. EMPATHY & BURDEN SHIFTING: The user is likely stressed about medical bills. Be extremely empathetic. Shift the burden away from them—tell them exactly what *you* have done or will do, reducing their cognitive load. (e.g., say "Don't worry, main check kar leta hoon" instead of "Please submit this bill").
3. CONTEXT AWARENESS: Use the provided document context to answer specific questions about their bill, instead of giving generic answers. If they ask about their insurance or claim, read the context.
4. Keep replies concise, conversational, and WhatsApp-friendly (using bolding like *this* and emojis).`;

  if (context) {
    systemPrompt += `\n\n--- CURRENT DOCUMENT CONTEXT ---\nThe user has uploaded the following bill/document details for you to assist them with:\n${JSON.stringify(context, null, 2)}\nUse this exact data to answer any questions about amounts, hospitals, dates, and whether it's ready to submit.`;
  }

  // Format history for Gemini API (must start with 'user' and roles must strictly alternate)
  const formattedHistory: any[] = [];
  for (const msg of history) {
    if (formattedHistory.length === 0) {
      if (msg.role === "model") continue; // skip initial bot messages
      formattedHistory.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] });
    } else {
      const lastMsg = formattedHistory[formattedHistory.length - 1];
      if (lastMsg.role === msg.role) {
        lastMsg.parts[0].text += "\n\n" + msg.parts[0].text;
      } else {
        formattedHistory.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] });
      }
    }
  }

  // Fallback if formatting resulted in empty array (shouldn't happen since the new message is always user)
  if (formattedHistory.length === 0) {
    formattedHistory.push({ role: "user", parts: [{ text: message }] });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: formattedHistory,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok || !data.candidates) {
    throw new Error(data.error?.message || "Gemini API error");
  }

  return data.candidates[0].content.parts[0].text;
};

export const analyzeDocuments = async (documents: { mimeType: string; data: string }[], policyText?: string) => {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!GEMINI_API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");

  let systemPrompt = `You are an expert Indian health insurance claim assistant.
You analyze multiple documents (photos of medical bills, hospital receipts, policy PDFs) and:
1. Extract structured data.
2. Detect missing or unclear fields that would cause a claim rejection.
3. Give a confidence/readability score (0-100) for the document quality.
4. Detect any consumables or non-payable items (e.g. gloves, syringes, nebulization kits) and add them to deductions.`;

  if (policyText) {
    systemPrompt += `\n5. Analyze the extracted expenses against the following policy rules: "${policyText}". Check if any claim amounts exceed the allowed limits (like room rent limits) and provide a concise 'policy_analysis' explaining what is fully covered, partially covered, or rejected based on the rules.`;
  } else {
    systemPrompt += `\n5. If no specific policy text is provided, 'policy_analysis' can be omitted or just mention standard clauses if obvious.`;
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [
          {
            role: "user",
            parts: [
              { text: "Analyze these medical documents for an Indian health insurance claim. Cross-reference them to build a comprehensive claim summary." },
              ...documents.map(doc => ({
                inlineData: {
                  mimeType: doc.mimeType || "image/jpeg",
                  data: doc.data,
                },
              })),
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              hospital_name: { type: "string" },
              patient_name: { type: "string" },
              bill_date: { type: "string" },
              bill_number: { type: "string" },
              total_amount: { type: "string" },
              diagnosis: { type: "string" },
              doctor_name: { type: "string" },
              has_hospital_stamp: { type: "boolean" },
              readability_score: { type: "number" },
              document_type: { type: "string" },
              issues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    severity: { type: "string", enum: ["error", "warning"] },
                    message: { type: "string" },
                  },
                },
              },
              deductions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    item_name: { type: "string" },
                    amount: { type: "number" },
                    reason: { type: "string" },
                  },
                },
              },
              policy_analysis: { type: "string" },
              claim_ready: { type: "boolean" },
            },
            required: ["hospital_name", "patient_name", "bill_date", "total_amount", "readability_score", "document_type", "issues", "deductions", "claim_ready", "has_hospital_stamp"],
          },
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Gemini API error");

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No structured data returned");

  return JSON.parse(text);
};
