import { NextRequest, NextResponse } from "next/server";
import { AgentName, LLMProvider, PlanResponse } from "@/types/chat";
import { normalizeRole, validateChatMessage } from "@/lib/validation";
import { AGENT_REGISTRY, resolveAgentFromMessage } from "@/lib/agents/registry";
import { INTENT_PLANNER_SYSTEM_PROMPT } from "@/lib/agents/prompts";
import { callGroqCompletion } from "@/lib/groq";
import { requiresDeepReasoning } from "@/lib/llm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { message, role } = body;

    // 1. Validate user query
    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          intent: "invalid_input",
          selectedAgent: "StudentAssistant",
          needsPrediction: false,
          needsRecommendation: false,
          needsKnowledgeBase: false,
          provider: "groq",
          error: validation.error,
        } as PlanResponse,
        { status: 400 }
      );
    }

    // 2. Normalize role
    const roleGroup = normalizeRole(role);

    // 3. Prepare deterministic heuristic fallback first
    const heuristicAgent = resolveAgentFromMessage(roleGroup, validation.cleanMessage);
    const heuristicNeedsDeep = requiresDeepReasoning(heuristicAgent, validation.cleanMessage);
    const fallbackResponse: PlanResponse = {
      success: true,
      intent: heuristicAgent.name.toLowerCase() + "_inquiry",
      selectedAgent: heuristicAgent.name,
      needsPrediction: !!heuristicAgent.requiresPrediction || validation.cleanMessage.toLowerCase().includes("predict"),
      needsRecommendation: !!heuristicAgent.requiresRecommendation || validation.cleanMessage.toLowerCase().includes("recommend"),
      needsKnowledgeBase: true,
      provider: heuristicNeedsDeep ? "nvidia" : "groq",
    };

    // 4. Fast Groq model intent detection call
    const groqPlanRes = await callGroqCompletion({
      messages: [
        { role: "system", content: INTENT_PLANNER_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Role: ${roleGroup}\nMessage: "${validation.cleanMessage}"`,
        },
      ],
      max_tokens: 150,
      temperature: 0.1,
    });

    if (groqPlanRes.success && groqPlanRes.content) {
      try {
        // Strip markdown code fences if model enclosed in ```json ... ```
        const cleanedJson = groqPlanRes.content
          .replace(/^```(json)?\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        const parsed = JSON.parse(cleanedJson);
        const agentNameCandidate = parsed.selectedAgent as AgentName;

        const resolvedAgent =
          AGENT_REGISTRY[agentNameCandidate] || heuristicAgent;

        const needsPrediction = !!parsed.needsPrediction;
        const needsRecommendation = !!parsed.needsRecommendation;
        const targetProvider: LLMProvider =
          needsPrediction || needsRecommendation ? "nvidia" : "groq";

        return NextResponse.json({
          success: true,
          intent: parsed.intent || fallbackResponse.intent,
          selectedAgent: resolvedAgent.name,
          needsPrediction,
          needsRecommendation,
          needsKnowledgeBase: parsed.needsKnowledgeBase ?? true,
          provider: targetProvider,
        } as PlanResponse);
      } catch {
        // Return deterministic fallback if JSON parsing failed
        return NextResponse.json(fallbackResponse);
      }
    }

    // Return deterministic fallback if Groq call was unsuccessful
    return NextResponse.json(fallbackResponse);
  } catch (error: any) {
    console.error("[API /api/plan] Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        intent: "error_fallback",
        selectedAgent: "StudentAssistant",
        needsPrediction: false,
        needsRecommendation: false,
        needsKnowledgeBase: false,
        provider: "groq",
        error: error?.message || "Internal server error",
      } as PlanResponse,
      { status: 500 }
    );
  }
}
