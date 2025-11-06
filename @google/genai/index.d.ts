// Type definitions for @google/genai
// These are simplified and may not cover all exports, but are sufficient for this project.

export class GoogleGenAI {
    constructor(options: { apiKey: string });
    models: {
        generateContent(request: GenerateContentParameters): Promise<GenerateContentResponse>;
    };
}

export interface GenerateContentParameters {
    model: string;
    contents: { parts: Part[] };
    config?: {
        responseMimeType?: string;
        responseSchema?: any;
        systemInstruction?: string;
    }
}

export interface Part {
    text?: string;
    inlineData?: {
        mimeType: string;
        data: string;
    };
}

export interface GenerateContentResponse {
    text: string;
    // Other properties might exist but text is the primary one used.
}

export enum Type {
    STRING = 'STRING',
    OBJECT = 'OBJECT',
}
