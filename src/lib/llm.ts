import { AgentDescriptor, ChatMessage, LLMProvider } from "@/types/chat";
import { callGroqCompletion } from "./groq";
import { callNvidiaCompletion } from "./nvidia";

export interface RoutedChatOptions {
  messages: ChatMessage[];
  agent: AgentDescriptor;
  forceProvider?: LLMProvider;
  userQuery: string;
}

export interface RoutedChatResult {
  success: boolean;
  content: string;
  provider: LLMProvider;
  model: string;
  reasoning?: string;
  error?: string;
}

/**
 * Checks if a message indicates intent for forecasting, prediction, or recommendation.
 */
export function requiresDeepReasoning(agent: AgentDescriptor, query: string): boolean {
  if (agent.requiresPrediction || agent.requiresRecommendation) {
    return true;
  }

  const q = query.toLowerCase();
  const deepKeywords = [
    "predict",
    "forecast",
    "probability",
    "chances of",
    "recommend",
    "suggestion for improvement",
    "learning path",
    "study strategy",
    "deep analysis",
    "explain in detail with reasoning",
  ];

  return deepKeywords.some((kw) => q.includes(kw));
}

/**
 * Routes chat requests to Groq (for fast answers) or NVIDIA NIM (for prediction / recommendations),
 * with automatic fallback between providers if one encounters an error or timeout.
 */
export async function routeChatCompletion(
  options: RoutedChatOptions
): Promise<RoutedChatResult> {
  const needsDeep = requiresDeepReasoning(options.agent, options.userQuery);

  // Preferred provider
  const preferredProvider: LLMProvider =
    options.forceProvider || (needsDeep ? "nvidia" : "groq");

  if (preferredProvider === "nvidia") {
    // Try NVIDIA NIM first
    const nvidiaRes = await callNvidiaCompletion({
      messages: options.messages,
    });

    if (nvidiaRes.success) {
      return {
        success: true,
        content: nvidiaRes.content,
        provider: "nvidia",
        model: nvidiaRes.model,
        reasoning: nvidiaRes.reasoning,
      };
    }

    // Failover to Groq
    console.warn(`[LLM Router] NVIDIA NIM failed (${nvidiaRes.error}). Failing over to Groq.`);
    const groqFallback = await callGroqCompletion({
      messages: options.messages,
    });

    if (groqFallback.success) {
      return {
        success: true,
        content: groqFallback.content,
        provider: "groq",
        model: groqFallback.model,
        reasoning: "Answered via Groq (NVIDIA failover)",
      };
    }

    return {
      success: false,
      content: "",
      provider: "nvidia",
      model: nvidiaRes.model || "unknown",
      error: nvidiaRes.error || groqFallback.error || "Failed to generate response.",
    };
  } else {
    // Try Groq first (fast response)
    const groqRes = await callGroqCompletion({
      messages: options.messages,
    });

    if (groqRes.success) {
      return {
        success: true,
        content: groqRes.content,
        provider: "groq",
        model: groqRes.model,
        reasoning: groqRes.reasoning,
      };
    }

    // Failover to NVIDIA NIM if Groq encounters rate limit or server issue
    console.warn(`[LLM Router] Groq failed (${groqRes.error}). Failing over to NVIDIA NIM.`);
    const nvidiaFallback = await callNvidiaCompletion({
      messages: options.messages,
    });

    if (nvidiaFallback.success) {
      return {
        success: true,
        content: nvidiaFallback.content,
        provider: "nvidia",
        model: nvidiaFallback.model,
        reasoning: "Answered via NVIDIA NIM (Groq failover)",
      };
    }

    return {
      success: false,
      content: "",
      provider: "groq",
      model: groqRes.model || "unknown",
      error: groqRes.error || nvidiaFallback.error || "Failed to generate response.",
    };
  }
}
