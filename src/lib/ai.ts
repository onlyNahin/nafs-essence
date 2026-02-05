
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Generates a luxury product description based on name and category.
   */
  async generateProductDescription(name: string, category: string): Promise<string> {
    const ai = getAI();
    const prompt = `You are a world-class luxury perfume copywriter for "Nafs Essence". 
    Write a short, evocative, and sophisticated description for a perfume oil.
    Name: ${name}
    Category: ${category}
    Tone: Deep, traditional, elegant, and mysterious.
    Length: 2-3 sentences max. Do not use emojis.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      return response.text || "A mysterious blend crafted for the soul.";
    } catch (error) {
      console.error("AI Description Error:", error);
      return "An exquisite essence of unmatched quality.";
    }
  },

  /**
   * Acts as the Scent Alchemist to recommend products to users.
   */
  async getScentRecommendation(userPrompt: string, availableProducts: Product[]): Promise<string> {
    const ai = getAI();
    const inventoryInfo = availableProducts.map(p => `- ${p.name}: ${p.description} (Category: ${p.category})`).join('\n');
    
    const contents = `You are the "Scent Alchemist" for Nafs Essence, a luxury perfume oil boutique.
    
    Our Current Inventory:
    ${inventoryInfo}
    
    User Request: "${userPrompt}"
    
    Your Task: Recommend 1 or 2 specific oils from our inventory that match the user's request. 
    Explain why in a poetic, high-end manner. If nothing matches, suggest our signature Midnight Oud.
    Keep the response concise (under 80 words).`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: contents,
      });
      return response.text || "I recommend our signature Midnight Oud for a timeless experience.";
    } catch (error) {
      console.error("AI Recommendation Error:", error);
      return "I recommend exploring our Oud collection for a truly profound experience.";
    }
  }
};
