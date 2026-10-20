import { ChatMessage } from "@/types/chat";

const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const DEFAULT_NVIDIA_MODEL = "moonshotai/kimi-k3";
const FALLBACK_NVIDIA_MODEL = "meta/llama-3.2-11b-vision-instruct";
const REQUEST_TIMEOUT_MS = 20000;

export interface NvidiaCompletionOptions {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface NvidiaCompletionResult {
  success: boolean;
  content: string;
  model: string;
  reasoning?: string;
  error?: string;
  status?: number;
}

export async function callNvidiaCompletion(
  options: NvidiaCompletionOptions,
  allowFallbackModel: boolean = true
): Promise<NvidiaCompletionResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      content: "",
      model: "",
      error: "NVIDIA API key is not configured on the server. Please check NVIDIA_API_KEY.",
      status: 500,
    };
  }

  const rawBaseUrl = process.env.NVIDIA_BASE_URL || DEFAULT_NVIDIA_BASE_URL;
  const baseUrl = rawBaseUrl.trim().replace(/\/+$/, "");
  const endpoint = `${baseUrl}/chat/completions`;

  const primaryModel = options.model || process.env.NVIDIA_MODEL || DEFAULT_NVIDIA_MODEL;
  const maxTokens = Number(process.env.NVIDIA_MAX_TOKENS) || options.max_tokens || 4096;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const payload: Record<string, any> = {
      model: primaryModel,
      messages: options.messages,
      max_tokens: Math.min(maxTokens, 16384),
      temperature: options.temperature ?? 0.6,
    };

    if (process.env.NVIDIA_REASONING_EFFORT) {
      payload.reasoning_effort = process.env.NVIDIA_REASONING_EFFORT;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // If model is discontinued (HTTP 410) or not found (HTTP 404), attempt active fallback model
    if ((response.status === 410 || response.status === 404) && allowFallbackModel && primaryModel !== FALLBACK_NVIDIA_MODEL) {
      console.warn(`[NVIDIA NIM] Model ${primaryModel} returned HTTP ${response.status}. Retrying with active fallback: ${FALLBACK_NVIDIA_MODEL}`);
      return callNvidiaCompletion(
        { ...options, model: FALLBACK_NVIDIA_MODEL },
        false
      );
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      let parsedMessage = "";
      try {
        const parsed = JSON.parse(errText);
        parsedMessage = parsed.detail || parsed.title || parsed.error?.message || errText;
      } catch {
        parsedMessage = errText;
      }

      if (response.status === 401) {
        return {
          success: false,
          content: "",
          model: primaryModel,
          error: "Authentication failed with NVIDIA NIM. Please verify NVIDIA_API_KEY.",
          status: 401,
        };
      }

      if (response.status === 429) {
        return {
          success: false,
          content: "",
          model: primaryModel,
          error: "NVIDIA NIM rate limit reached. Please retry in a few moments.",
          status: 429,
        };
      }

      return {
        success: false,
        content: "",
        model: primaryModel,
        error: `NVIDIA NIM returned HTTP ${response.status}: ${parsedMessage.slice(0, 200)}`,
        status: response.status,
      };
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";

    return {
      success: true,
      content: content.trim(),
      model: data?.model || primaryModel,
      reasoning: "Generated via NVIDIA NIM deep reasoning engine",
      status: 200,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === "AbortError") {
      return {
        success: false,
        content: "",
        model: primaryModel,
        error: `NVIDIA NIM request timed out after ${REQUEST_TIMEOUT_MS / 1000} seconds.`,
        status: 504,
      };
    }

    return {
      success: false,
      content: "",
      model: primaryModel,
      error: `Network failure connecting to NVIDIA NIM: ${error?.message || "Unknown error"}`,
      status: 503,
    };
  }
}
