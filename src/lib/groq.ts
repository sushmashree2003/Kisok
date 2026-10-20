import { ChatMessage } from "@/types/chat";

const DEFAULT_GROQ_BASE_URL = "https://api.groq.com";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";
const REQUEST_TIMEOUT_MS = 15000;

export interface GroqCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface GroqCompletionResult {
  success: boolean;
  content: string;
  model: string;
  reasoning?: string;
  error?: string;
  status?: number;
}

export async function callGroqCompletion(
  options: GroqCompletionOptions
): Promise<GroqCompletionResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      content: "",
      model: "",
      error: "Groq API key is not configured on the server. Please check GROQ_API_KEY.",
      status: 500,
    };
  }

  const rawBaseUrl = process.env.GROQ_BASE_URL || DEFAULT_GROQ_BASE_URL;
  const baseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
  const endpoint = baseUrl.endsWith("/openai/v1")
    ? `${baseUrl}/chat/completions`
    : `${baseUrl}/openai/v1/chat/completions`;

  const model = options.model || process.env.GROQ_MODEL || DEFAULT_GROQ_MODEL;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: options.messages,
        max_tokens: options.max_tokens ?? 1024,
        temperature: options.temperature ?? 0.6,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      let parsedMessage = "";
      try {
        const parsed = JSON.parse(errText);
        parsedMessage = parsed.error?.message || parsed.detail || errText;
      } catch {
        parsedMessage = errText;
      }

      if (response.status === 401) {
        return {
          success: false,
          content: "",
          model,
          error: "Authentication failed with Groq. Please verify GROQ_API_KEY.",
          status: 401,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          content: "",
          model,
          error: "Groq API rate limit reached. Please retry in a few moments.",
          status: 429,
        };
      }

      return {
        success: false,
        content: "",
        model,
        error: `Groq API returned HTTP ${response.status}: ${parsedMessage.slice(0, 200)}`,
        status: response.status,
      };
    }

    const data = await response.json();
    const choice = data?.choices?.[0];
    const message = choice?.message;
    const content = message?.content || "";
    const reasoning = data?.usage?.completion_tokens_details?.reasoning_tokens
      ? `Completed with ${data.usage.completion_tokens_details.reasoning_tokens} reasoning tokens`
      : undefined;

    return {
      success: true,
      content: content.trim(),
      model: data?.model || model,
      reasoning,
      status: 200,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === "AbortError") {
      return {
        success: false,
        content: "",
        model,
        error: `Groq request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
        status: 504,
      };
    }

    return {
      success: false,
      content: "",
      model,
      error: `Network failure connecting to Groq: ${error?.message || "Unknown error"}`,
      status: 503,
    };
  }
}
