import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { message, history, context } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing API key" }),
        { status: 500 }
      );
    }

    let systemPrompt = `You are ClaimDost, an expert, highly empathetic Indian health insurance claim assistant.
You are chatting with a user on WhatsApp.

CRITICAL INSTRUCTIONS:
1. CODE-SWITCHING (HINGLISH): You must perfectly understand and respond to "Hinglish" (Hindi-English mix). If a user asks "Is bill ka claim kaise milega?", recognize this as a request for claim status or instructions. Always reply naturally in the matching language style (Hinglish/Hindi/English).
2. EMPATHY & BURDEN SHIFTING: The user is likely stressed about medical bills. Be extremely empathetic. Shift the burden away from them—tell them exactly what *you* have done or will do, reducing their cognitive load. (e.g., say "Don't worry, I've checked your bill and prepared everything for submission" instead of "Please submit this bill").
3. CONTEXT AWARENESS: Use the provided context to answer specific questions about their bill, instead of giving generic answers.
4. Keep replies concise, conversational, and WhatsApp-friendly (using bolding like *this* and emojis).`;

    if (context) {
      systemPrompt += `\n\n--- CURRENT DOCUMENT CONTEXT ---\nThe user has uploaded the following bill/document details for you to assist them with:\n${JSON.stringify(context, null, 2)}\nUse this exact data to answer any questions about amounts, hospitals, dates, and whether it's ready to submit.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: history,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.candidates) {
      return new Response(
        JSON.stringify({ error: "Gemini API error", details: data }),
        { status: 500 }
      );
    }

    const reply = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({ reply }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
});