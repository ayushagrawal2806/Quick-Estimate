import { GoogleGenAI, Type } from "@google/genai";

export interface ExtractedRow {
  sizeFt: number;
  pcs: number;
  rate: number;
}
//
export const extractEstimateData = async (
  base64Image: string,
): Promise<ExtractedRow[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `You are an OCR expert for a billing sheet. 
  The sheet has fixed rows based on "Size in Feet" (e.g., 6, 6.5, 8, 10, and 12) and their corresponding "Size in Meter" values.
  
  EXTRACT ONLY:
  - The "PCS" (Quantity) for each row.
  - The "RATE" for each row.
  
  Look for the handwritten numbers in the blank columns next to the sizes.
  If a row has no handwritten number, return 0.
  Do NOT guess numbers that aren't there.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image.split(",")[1] || base64Image,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            extractedRows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sizeFt: {
                    type: Type.NUMBER,
                    description:
                      "The size in feet this row belongs to (e.g. 6, 6.5, 8, 10, or 12)",
                  },
                  pcs: {
                    type: Type.NUMBER,
                    description: "Handwritten PCS count",
                  },
                  rate: { type: Type.NUMBER, description: "Handwritten Rate" },
                },
                required: ["sizeFt", "pcs", "rate"],
              },
            },
          },
        },
      },
    });

    const data = JSON.parse(response.text);
    return data.extractedRows || [];
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};
