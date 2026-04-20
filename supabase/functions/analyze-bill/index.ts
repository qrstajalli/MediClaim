// Analyze medical bill image using Lovable AI (Gemini vision) and return structured data + issues.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const dataUrl = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    const systemPrompt = `You are an expert Indian health insurance claim assistant.
You analyze a photo of a medical bill / hospital receipt and:
1. Extract structured data.
2. Detect missing or unclear fields that would cause a claim rejection.
3. Give a confidence/readability score (0-100) for the document quality.

Return ONLY through the provided tool. Be strict: if something is missing or unreadable, mark it.`;

    const tools = [
      {
        type: "function",
        function: {
          name: "extract_claim_data",
          description: "Return the structured medical bill data and detected issues.",
          parameters: {
            type: "object",
            properties: {
              hospital_name: { type: "string", description: "Hospital or clinic name. Empty string if not found." },
              patient_name: { type: "string" },
              bill_date: { type: "string", description: "Date in DD-MM-YYYY format if possible." },
              bill_number: { type: "string" },
              total_amount: { type: "string", description: "Total amount in INR, just the number." },
              diagnosis: { type: "string", description: "Diagnosis or treatment if visible." },
              doctor_name: { type: "string" },
              has_hospital_stamp: { type: "boolean" },
              readability_score: { type: "number", description: "0-100 quality score." },
              document_type: { type: "string", description: "e.g. 'Hospital Bill', 'Pharmacy Receipt', 'Lab Report', 'Discharge Summary', 'Unknown'." },
              issues: {
                type: "array",
                description: "List of problems that could cause claim rejection.",
                items: {
                  type: "object",
                  properties: {
                    severity: { type: "string", enum: ["error", "warning"] },
                    message: { type: "string" },
                  },
                  required: ["severity", "message"],
                },
              },
              claim_ready: { type: "boolean", description: "True only if there are no error-severity issues." },
            },
            required: [
              "hospital_name",
              "patient_name",
              "bill_date",
              "total_amount",
              "readability_score",
              "document_type",
              "issues",
              "claim_ready",
              "has_hospital_stamp",
            ],
            additionalProperties: false,
          },
        },
      },
    ];

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this medical bill for an Indian health insurance claim." },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "extract_claim_data" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResp.text();
      console.error("AI error", aiResp.status, errText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      console.error("No tool call returned", JSON.stringify(aiJson));
      throw new Error("AI did not return structured data");
    }

    const data = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-bill error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
