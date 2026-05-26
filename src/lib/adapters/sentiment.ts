export type SentimentResult = {
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  intent: "HOT" | "NOT_INTERESTED" | "DNC" | "UNSUBSCRIBE" | "INFO_REQUEST" | "GENERAL";
  confidence: number;
};

/**
 * Mock LLM Adapter for analyzing inbound message sentiment and intent.
 * In a production app, this would wrap an OpenAI/Anthropic call.
 */
export class SentimentAnalyzer {
  static async analyze(message: string): Promise<SentimentResult> {
    const text = message.toLowerCase();

    // 1. Check for strict opt-outs
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
