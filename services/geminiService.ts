import { GoogleGenAI, Type } from "@google/genai";
import { StyleDNA, NormalizedTopic, EditorialPlan } from "../types";

/**
 * Generates a stable ID for a Style DNA profile based on its name and source content.
 */
const generateStableId = (name: string, transcripts: string[]): string => {
  const source = name + transcripts.join('|');
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = ((hash << 5) - hash) + source.charCodeAt(i);
    hash = hash & hash;
  }
  return `dna-${Math.abs(hash).toString(36)}`;
};

/**
 * Analyzes provided transcripts to extract linguistic, vocabulary, narrative, and editorial style patterns.
 */
export const analyzeTranscripts = async (transcripts: string[], profileName: string): Promise<StyleDNA> => {
  // Always initialize GoogleGenAI with the environment-provided API key right before use.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const normalizedTranscripts = transcripts.map(t => t.trim()).filter(t => t.length > 0);
  const combinedTranscripts = normalizedTranscripts.join("\n\n--- NEXT TRANSCRIPT ---\n\n");

  // Use gemini-3-pro-preview for forensic analysis as it is a complex task.
  // We utilize thinkingBudget to enhance the forensic analysis depth.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Transcripts to analyze:\n${combinedTranscripts}`,
    config: {
      systemInstruction: "ACT AS A FORENSIC SCRIPT ANALYST. Perform a 7-step 'Style DNA' extraction on the provided YouTube transcripts.",
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          linguistic: {
            type: Type.OBJECT,
            properties: {
              sentenceRhythm: { type: Type.STRING },
              rhetoricalDevices: { type: Type.STRING },
              emotionLevel: { type: Type.STRING },
              formality: { type: Type.STRING }
            },
            required: ["sentenceRhythm", "rhetoricalDevices", "emotionLevel", "formality"]
          },
          vocabulary: {
            type: Type.OBJECT,
            properties: {
              abstractRatio: { type: Type.STRING },
              conflictWordsFrequency: { type: Type.STRING },
              lexicalQuirks: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["abstractRatio", "conflictWordsFrequency", "lexicalQuirks"]
          },
          narrative: {
            type: Type.OBJECT,
            properties: {
              hookType: { type: Type.STRING },
              climaxPlacement: { type: Type.STRING },
              endingStyle: { type: Type.STRING },
              pacingPattern: { type: Type.STRING }
            },
            required: ["hookType", "climaxPlacement", "endingStyle", "pacingPattern"]
          },
          editorial: {
            type: Type.OBJECT,
            properties: {
              perspectiveType: { type: Type.STRING },
              conflictPriority: { type: Type.STRING },
              reasoningStyle: { type: Type.STRING }
            },
            required: ["perspectiveType", "conflictPriority", "reasoningStyle"]
          },
          safetyRules: {
            type: Type.OBJECT,
            properties: {
              maxSimilarityScale: { type: Type.NUMBER },
              plagiarismGuardInstructions: { type: Type.STRING }
            },
            required: ["maxSimilarityScale", "plagiarismGuardInstructions"]
          }
        },
        required: ["linguistic", "vocabulary", "narrative", "editorial", "safetyRules"]
      }
    }
  });

  // Access the .text property directly and trim to ensure clean JSON parsing.
  const jsonStr = response.text?.trim() || "{}";
  const analysis = JSON.parse(jsonStr);
  return {
    ...analysis,
    id: generateStableId(profileName, normalizedTranscripts),
    name: profileName,
    createdAt: Date.now()
  };
};

/**
 * Normalizes a raw topic string into a structured Topic, Angle, and Key Points object.
 */
const normalizeTopic = async (rawInput: string): Promise<NormalizedTopic> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Raw input: "${rawInput}"`,
    config: {
      systemInstruction: "Transform this scriptwriting request into a structured scriptwriting object containing topic, angle, and key points.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          angle: { type: Type.STRING },
          key_points: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["topic", "angle", "key_points"]
      }
    }
  });
  const jsonStr = response.text?.trim() || "{}";
  return JSON.parse(jsonStr);
};

/**
 * Generates an editorial plan based on the normalized topic and the style DNA.
 */
const generateEditorialPlan = async (topic: NormalizedTopic, dna: StyleDNA, targetLength: number): Promise<EditorialPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const depth = targetLength > 3000 ? 'high' : targetLength > 1000 ? 'medium' : 'low';
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Topic: ${topic.topic}. Target: ${targetLength} words.`,
    config: {
      systemInstruction: `Create a detailed editorial plan for a script. Style requirements from DNA: ${dna.narrative.hookType}.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          opening: { type: Type.STRING },
          structure: { type: Type.ARRAY, items: { type: Type.STRING } },
          tone: { type: Type.STRING },
          target_length: { type: Type.NUMBER }
        },
        required: ["opening", "structure", "tone", "target_length"]
      }
    }
  });
  const jsonStr = response.text?.trim() || "{}";
  return { ...JSON.parse(jsonStr), depth };
};

/**
 * Executes the full scriptwriting pipeline: normalization, planning, and drafting.
 */
export const executeFullPipeline = async (topicInput: string, dna: StyleDNA, targetLength: number, onStep: (step: string) => void): Promise<string> => {
  onStep("Normalizing Topic...");
  const normalized = await normalizeTopic(topicInput);
  onStep("Crafting Editorial Plan...");
  const plan = await generateEditorialPlan(normalized, dna, targetLength);
  onStep("Drafting Full Script...");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Use gemini-3-pro-preview for high-quality script generation.
  // Thinking budget is set to 32768 to allow for deep reasoning during long-form content generation.
  const draftResponse = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Plan: ${JSON.stringify(plan)}. Topic: ${JSON.stringify(normalized)}`,
    config: { 
      systemInstruction: `WRITE A FULL SCRIPT using the provided Style DNA: ${JSON.stringify(dna)}. Adhere strictly to the editorial plan and stylistic nuances.`,
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });
  return draftResponse.text || "Failed to generate script content.";
};