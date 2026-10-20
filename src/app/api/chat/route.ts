import { NextRequest, NextResponse } from "next/server";
import { ChatMessage, ChatResponse } from "@/types/chat";
import { normalizeRole, validateChatMessage } from "@/lib/validation";
import { resolveAgentFromMessage } from "@/lib/agents/registry";
import { getSystemPromptForAgent } from "@/lib/agents/prompts";
import { routeChatCompletion } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message, role, history = [], forceProvider } = body;

    // 1. Validate user query
    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          answer: "",
          role: role || "student",
          model: "",
          error: validation.error,
        } as ChatResponse,
        { status: 400 }
      );
    }

    // 2. Normalize role into supported canonical RoleGroup
    const roleGroup = normalizeRole(role);

    // 3. Resolve the specialized agent among the 29 agents
    const agent = resolveAgentFromMessage(roleGroup, validation.cleanMessage);

    // 4. Construct messages payload
    const systemPrompt = getSystemPromptForAgent(agent);
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
    ];

    // Include recent history (sanitized, max 6 messages)
    if (Array.isArray(history)) {
      const recentHistory = history
        .slice(-6)
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string" &&
            m.content.trim().length > 0
        )
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content.slice(0, 1000),
        }));

      messages.push(...recentHistory);
    }

    // Add current user message
    messages.push({
      role: "user",
      content: validation.cleanMessage,
    });

    // 5. Execute routed completion via Groq or NVIDIA NIM
    const result = await routeChatCompletion({
      messages,
      agent,
      forceProvider,
      userQuery: validation.cleanMessage,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          answer:
            "I apologize, but our campus AI service is temporarily experiencing high load. Please try again or visit the administrative helpdesk in Block A.",
          role: roleGroup,
          model: result.model,
          selectedAgent: agent.name,
          provider: result.provider,
          error: result.error,
        } as ChatResponse,
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      answer: result.content,
      role: roleGroup,
      model: result.model,
      selectedAgent: agent.name,
      provider: result.provider,
      reasoning: result.reasoning,
    } as ChatResponse);
  } catch (error: any) {
    console.error("[API /api/chat] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        answer: "An unexpected error occurred while processing your request.",
        role: "unknown",
        model: "unknown",
        error: error?.message || "Internal server error",
      } as ChatResponse,
      { status: 500 }
    );
  }
}
