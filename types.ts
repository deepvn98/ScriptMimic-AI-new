
export interface StyleDNA {
  id: string;
  name: string;
  createdAt: number;
  linguistic: {
    sentenceRhythm: string;
    rhetoricalDevices: string;
    emotionLevel: string;
    formality: string;
  };
  vocabulary: {
    abstractRatio: string;
    conflictWordsFrequency: string;
    lexicalQuirks: string[];
  };
  narrative: {
    hookType: string;
    climaxPlacement: string;
    endingStyle: string;
    pacingPattern: string;
  };
  editorial: {
    perspectiveType: string;
    conflictPriority: string;
    reasoningStyle: string;
  };
  safetyRules: {
    maxSimilarityScale: number;
    plagiarismGuardInstructions: string;
  };
}

export interface NormalizedTopic {
  topic: string;
  angle: string;
  key_points: string[];
}

export interface EditorialPlan {
  opening: string;
  structure: string[];
  tone: string;
  target_length: number;
  depth: 'low' | 'medium' | 'high';
}

export interface ScriptRequest {
  topic: string;
  dnaId: string;
  targetLength: number; // Word count target
}

export interface GeneratedScript {
  id: string;
  topic: string;
  content: string;
  dnaName: string;
  createdAt: number;
}

export interface AdminLicense {
  id: string;
  userName: string;
  licenseCode: string;
  createdAt: number;
}

export type View = 'analyze' | 'generate' | 'library' | 'admin';
