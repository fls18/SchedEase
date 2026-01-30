import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
