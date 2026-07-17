import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Fallback recommendations if API key is not configured or fails
const FALLBACK_SUGGESTIONS = [
  {
    title: "Abuja Stew Tomato Combo",
    desc: "Get 3kg of Abdullahi Farms' fresh vine-ripened red tomatoes and 1kg Habanero Peppers (Ata Rodo) together for the perfect traditional stew.",
    discount: "Save ₦400"
  },
  {
    title: "Sweet Corn & Dairy Porridge",
    desc: "Combine yellow maize ears with Mama Sheila's raw cow milk for a highly nutritious, organic local breakfast.",
    discount: "Save 15%"
  },
  {
    title: "Organic Leafy Spinach Dinner",
    desc: "Stir-fry fresh Efo Shoko spinach leaves with onions and red bell peppers from local Abuja farmers.",
    discount: "100% Organic"
  }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role') || 'customer';

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Graceful fallback to maintain zero setup out-of-the-box local demoing
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }

  try {
    const ai = new GoogleGenerativeAI(apiKey);
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use the recommended gemini-2.5-flash model

    const prompt = `
      You are an AI assistant for "AgriLink", a direct farm-to-table delivery web application in Nigeria.
      Generate exactly 3 custom seasonal recipe suggestions / product combos for a consumer named Amina Bello who lives in Abuja, Nigeria and loves fresh farm-to-table produce.
      
      Return a JSON array where each object has:
      - "title": A short catchy combo title (e.g. "Abuja Stew Tomato Combo", "Sweet Corn & Dairy Porridge")
      - "desc": A 1-2 sentence description explaining the ingredients (referencing Tomatoes, Maize, Pepper, Plantain, Spinach, Milk, Millet) and how they connect
      - "discount": A promotional tag (e.g. "Save ₦500", "100% Organic", "Best Seller")
      
      Return ONLY the raw JSON array string. Do NOT include markdown code blocks like \`\`\`json or \`\`\`. Do not write any preamble.
    `;

    const result = await model.generateContent({ contents: [{ parts: [{ text: prompt }] }] });
    const responseText = result.response.text().trim();
    
    // Clean up potential markdown formatting from LLM output
    const cleanJsonText = responseText
      .replace(/^```json/i, '')
      .replace(/^```/, '')
      .replace(/```$/, '')
      .trim();

    const suggestions = JSON.parse(cleanJsonText);
    
    if (Array.isArray(suggestions)) {
      return NextResponse.json({ suggestions });
    } else {
      throw new Error("Gemini response is not a valid array");
    }
  } catch (error) {
    console.error("Error generating Gemini AI suggestions:", error);
    // Fallback on error
    return NextResponse.json({ suggestions: FALLBACK_SUGGESTIONS });
  }
}
