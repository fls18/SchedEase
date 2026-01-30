import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: "input is required" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `다음 텍스트에서 과목명, 분반, 학점, 수업 시간을 추출해서 JSON 형식으로 반환해줘.
입력 텍스트: "${input}"
수업 시간은 "요일 HH:mm~HH:mm" 형식이어야 해. (예: 월 10:30~12:00)
한 과목이 여러 시간대에 걸쳐 있을 수 있어.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            section: { type: Type.STRING },
            credits: { type: Type.NUMBER },
            timeSlots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: {
                    type: Type.STRING,
                    enum: ["월", "화", "수", "목", "금"],
                  },
                  startTime: { type: Type.STRING },
                  endTime: { type: Type.STRING },
                },
                required: ["day", "startTime", "endTime"],
              },
            },
          },
          required: ["name", "credits", "timeSlots"],
        },
      },
    });

    const text = response.text;
    if (!text) return res.status(200).json(null);

    res.status(200).json(JSON.parse(text));
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    res.status(500).json({ error: "Gemini parsing failed" });
  }
}
