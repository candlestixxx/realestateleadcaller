import { OpenAI } from "openai";
import { prisma } from "@/lib/prisma";

export type SentimentResult = {
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  intent: "HOT" | "NOT_INTERESTED" | "DNC" | "UNSUBSCRIBE" | "INFO_REQUEST" | "GENERAL";
  confidence: number;
};

export class SentimentAnalyzer {
  static async analyze(message: string, userId?: string): Promise<SentimentResult> {

    // 1. Try to initialize OpenAI with the tenant's API key
    let openAiKey = process.env.OPENAI_API_KEY;

    if (userId) {
        const settings = await prisma.integrationSettings.findFirst({
            where: { provider: 'openai_api_key', userId }
        });
        if (settings?.apiKey) openAiKey = settings.apiKey;
    }

    // 2. Execute true LLM structured output if key exists
    if (openAiKey) {
        try {
            const openai = new OpenAI({ apiKey: openAiKey });
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are an expert real estate lead parser. Analyze the user's message and determine the sentiment and intent. 'HOT' means they want to meet, talk, or buy/sell. 'DNC' means do not contact. 'UNSUBSCRIBE' means stop texting."
                    },
                    { role: "user", content: message },
                ],
                response_format: {
                    type: "json_schema",
                    json_schema: {
                        name: "sentiment_result",
                        schema: {
                            type: "object",
                            properties: {
                                sentiment: { type: "string", enum: ["POSITIVE", "NEGATIVE", "NEUTRAL"] },
                                intent: { type: "string", enum: ["HOT", "NOT_INTERESTED", "DNC", "UNSUBSCRIBE", "INFO_REQUEST", "GENERAL"] },
                                confidence: { type: "number", description: "Float between 0 and 1" }
                            },
                            required: ["sentiment", "intent", "confidence"],
                            additionalProperties: false
                        },
                        strict: true
                    }
                }
            });

            if (completion.choices[0].message.content) {
                return JSON.parse(completion.choices[0].message.content) as SentimentResult;
            }
        } catch (e) {
            console.error("[SentimentAnalyzer] OpenAI API failed, falling back to mock heuristics.", e);
        }
    }

    // 3. Graceful Mock Heuristics Fallback
    const text = message.toLowerCase();

    if (["stop", "unsubscribe", "cancel", "remove", "quit"].includes(text.trim())) {
      return {
        sentiment: "NEGATIVE",
        intent: "UNSUBSCRIBE",
        confidence: 1.0,
      };
    }

    if (text.includes("don't contact me") || text.includes("do not call") || text.includes("leave me alone")) {
        return {
            sentiment: "NEGATIVE",
            intent: "DNC",
            confidence: 0.95
        };
    }

    // 2. Check for Hot / Positive Intent
    if (
      text.includes("yes") ||
      text.includes("interested") ||
      text.includes("call me") ||
      text.includes("available") ||
      text.includes("how much") ||
      text.includes("view the house") ||
      text.includes("appointment")
    ) {
      return {
        sentiment: "POSITIVE",
        intent: "HOT",
        confidence: 0.85,
      };
    }

    // 3. Check for Not Interested
    if (
        text.includes("no thanks") ||
        text.includes("not looking") ||
        text.includes("already bought") ||
        text.includes("already have an agent")
      ) {
        return {
          sentiment: "NEGATIVE",
          intent: "NOT_INTERESTED",
          confidence: 0.80,
        };
      }

    // Fallback
    return {
      sentiment: "NEUTRAL",
      intent: "GENERAL",
      confidence: 0.5,
    };
  }
}
