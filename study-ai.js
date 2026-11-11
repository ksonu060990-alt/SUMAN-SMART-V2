exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  if (!process.env.OPENAI_API_KEY) return { statusCode: 503, body: JSON.stringify({ error: "AI is not configured. Add OPENAI_API_KEY in Netlify environment variables." }) };
  try {
    const body = JSON.parse(event.body || "{}");
    const prompt = String(body.prompt || "").trim().slice(0, 6000);
    if (!prompt) return { statusCode: 400, body: JSON.stringify({ error: "Please enter a question." }) };
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: "You are SUMAN SMART, a clear, patient school study assistant for Classes 9, 10 and 11. Use simple Hinglish when helpful, and Urdu script when asked for Urdu. For Gujarati-to-Urdu requests, provide accurate Urdu-script meanings and note ambiguity. Teach step by step, give examples, and distinguish syllabus facts from suggestions. Never claim questions are guaranteed to appear in exams. Keep content safe and age-appropriate.",
        input: prompt,
        max_output_tokens: 1400
      })
    });
    const data = await response.json();
    if (!response.ok) return { statusCode: 502, body: JSON.stringify({ error: data.error?.message || "AI provider request failed." }) };
    const answer = (data.output || []).flatMap(x => x.content || []).filter(x => x.type === "output_text").map(x => x.text).join("\n");
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answer }) };
  } catch (_) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server error while generating the answer." }) };
  }
};
