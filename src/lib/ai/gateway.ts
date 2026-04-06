import { randomUUID } from "node:crypto";

import { getServerEnv } from "@/lib/env/server";
import {
  contentModerationInputSchema,
  contentModerationOutputSchema,
  pathGenerationInputSchema,
  pathGenerationOutputSchema,
  recommendationExplanationInputSchema,
  recommendationExplanationOutputSchema,
  resumeParseInputSchema,
  resumeParseOutputSchema,
  suggestionCardSchema,
  type ContentModerationInput,
  type ContentModerationOutput,
  type PathGenerationInput,
  type PathGenerationOutput,
  type RecommendationExplanationInput,
  type RecommendationExplanationOutput,
  type ResumeParseInput,
  type ResumeParseOutput,
  type SuggestionCard,
  type WhatIfSimulationInput,
  type WhatIfSimulationOutput,
  whatIfSimulationInputSchema,
  whatIfSimulationOutputSchema,
} from "@/types/contracts";
import {
  InMemoryAiUsageRepository,
  type AiOperationName,
  type AiProviderName,
  type AiUsageLogRecord,
  type AiUsageRepository,
  SupabaseAiUsageRepository,
} from "@/lib/ai/repository";
import {
  createAnonymousAiRateLimiter,
  RateLimitExceededError,
  type AnonymousAiRateLimiter,
} from "@/lib/server/rate-limit";

type OperationPayloadMap = {
  generatePath: {
    input: PathGenerationInput;
    output: PathGenerationOutput;
  };
  parseResume: {
    input: ResumeParseInput;
    output: ResumeParseOutput;
  };
  simulateWhatIf: {
    input: WhatIfSimulationInput;
    output: WhatIfSimulationOutput;
  };
  explainRecommendation: {
    input: RecommendationExplanationInput;
    output: RecommendationExplanationOutput;
  };
  moderateContent: {
    input: ContentModerationInput;
    output: ContentModerationOutput;
  };
};

type OperationContext = {
  userId?: string | null;
  anonymousKey?: string;
};

type OperationResult<T> = {
  output: T;
  provider: AiProviderName;
  providerMode: AiProviderName;
  usedFallback: boolean;
  usageLogId: string;
};

type ProviderInvocation<TInput, TOutput> = (input: TInput) => Promise<{
  output: TOutput;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}>;

type AiGatewayDependencies = {
  usageRepository?: AiUsageRepository;
  anonymousRateLimiter?: AnonymousAiRateLimiter;
  now?: () => Date;
};

function estimateTokens(value: unknown) {
  return Math.max(
    1,
    JSON.stringify(value)
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean).length,
  );
}

function buildSuggestionCard(title: string, summary: string): SuggestionCard {
  return suggestionCardSchema.parse({
    id: randomUUID(),
    title,
    summary,
    rationale: "Mock AI mode generated this card from the current prompt.",
    source_label: "ai_suggested",
    confidence_label: "exploratory",
    timeline_months: 3,
    tags: ["mock-mode", "m1-foundation"],
    next_step: "Validate this direction with a human-backed proof item.",
    proof_references: [],
  });
}

function createMockProvider() {
  const invoke =
    <TInput, TOutput>(
      buildOutput: (input: TInput) => TOutput,
    ): ProviderInvocation<TInput, TOutput> =>
    async (input) => {
      const startedAt = Date.now();
      const output = buildOutput(input);

      return {
        output,
        inputTokens: estimateTokens(input),
        outputTokens: estimateTokens(output),
        latencyMs: Date.now() - startedAt,
      };
    };

  return {
    name: "mock" as const,
    generatePath: invoke<PathGenerationInput, PathGenerationOutput>((input) =>
      pathGenerationOutputSchema.parse({
        path_id: randomUUID(),
        title: `Mock path for ${input.prompt.slice(0, 48)}`,
        summary:
          "This mock path demonstrates the M1 exploration contract with trust labels and structured nodes.",
        source_label: "ai_suggested",
        confidence_label: "exploratory",
        trust_note:
          "Mock mode is active. Treat this as a schema-valid fixture, not a final recommendation.",
        nodes: [
          {
            id: randomUUID(),
            title: "Clarify fit signals",
            summary:
              "Start by validating why this direction fits your interests.",
            timeline_months: 0,
            source_label: "ai_suggested",
            metadata: {
              kind: "decision",
              decision_prompt:
                "Which early signals would make this path feel real?",
              options: input.interests.length
                ? input.interests
                : ["Skill fit", "Role demand"],
              source_label: "ai_suggested",
            },
          },
          {
            id: randomUUID(),
            title: "Build a visible proof artifact",
            summary:
              "Create one portfolio-grade project that proves the interest.",
            timeline_months: 2,
            source_label: "hybrid",
            metadata: {
              kind: "project",
              deliverable:
                "A public artifact or demo tied to the chosen direction.",
              portfolio_worthy: true,
              source_label: "hybrid",
            },
          },
          {
            id: randomUUID(),
            title: "Test a first real-world opportunity",
            summary:
              "Translate the artifact into a real application, internship, or freelance test.",
            timeline_months: 4,
            source_label: "hybrid",
            metadata: {
              kind: "experience",
              role_title: "Entry-level test opportunity",
              experience_type: "internship",
              source_label: "hybrid",
            },
          },
        ],
        edges: [],
        suggestion_cards: [
          buildSuggestionCard(
            "Shadow a real practitioner",
            "Use one conversation to validate the day-to-day reality behind the path.",
          ),
          buildSuggestionCard(
            "Audit current market signals",
            "Check job descriptions, portfolios, and salary patterns before committing deeper.",
          ),
        ],
        next_steps: [
          "Choose one human-backed proof source to pair with this AI suggestion.",
          "Track one measurable signal before extending the path.",
        ],
        warnings: [
          "Mock mode cannot reflect real labor-market changes or local constraints.",
        ],
      }),
    ),
    parseResume: invoke<ResumeParseInput, ResumeParseOutput>((input) =>
      resumeParseOutputSchema.parse({
        source_label: "ai_suggested",
        candidate_summary:
          "Mock parser summary based on the provided resume text. Use this as a contract fixture only.",
        extracted_skills: Array.from(
          new Set(
            input.resume_text
              .split(/[^A-Za-z]+/)
              .map((word) => word.trim())
              .filter((word) => word.length > 4)
              .slice(0, 6),
          ),
        ),
        experience_highlights: [
          "Resume parsing is wired through the shared AI abstraction.",
        ],
        education_highlights: [
          "Education extraction remains schema-validated.",
        ],
        suggested_roles: ["Career Explorer", "Project Builder"],
        caution_flags: ["Resume parser is running in mock mode."],
      }),
    ),
    simulateWhatIf: invoke<WhatIfSimulationInput, WhatIfSimulationOutput>(
      (input) =>
        whatIfSimulationOutputSchema.parse({
          source_label: "ai_suggested",
          scenario: input.scenario_prompt,
          delta_summary:
            "Mock mode predicts a moderate path shift with visible upside and a few tradeoffs.",
          updated_timeline_months: 6,
          upside: [
            "Faster clarity on whether the path is worth deeper effort.",
          ],
          tradeoffs: [
            "Short-term uncertainty increases while you test the scenario.",
          ],
          recommended_next_step:
            "Run one low-cost experiment before committing the full path update.",
        }),
    ),
    explainRecommendation: invoke<
      RecommendationExplanationInput,
      RecommendationExplanationOutput
    >((input) =>
      recommendationExplanationOutputSchema.parse({
        source_label: "ai_suggested",
        explanation: `Mock mode explains why "${input.suggestion_title}" may be useful at this stage.`,
        supporting_points: [
          input.suggestion_summary,
          "It creates a small, testable step instead of a vague career leap.",
        ],
        caution_points: [
          "The explanation is fixture-based and should be validated.",
        ],
      }),
    ),
    moderateContent: invoke<ContentModerationInput, ContentModerationOutput>(
      (input) => {
        const lowered = input.content.toLowerCase();
        const blockedTerms = ["hate", "violence"];
        const shouldReview = blockedTerms.some((term) =>
          lowered.includes(term),
        );

        return contentModerationOutputSchema.parse({
          source_label: "ai_suggested",
          verdict: shouldReview ? "review" : "allow",
          reason: shouldReview
            ? "Mock moderation flagged potentially unsafe content."
            : "Mock moderation found no high-risk terms.",
          categories: shouldReview ? ["safety-review"] : [],
        });
      },
    ),
  };
}

function createFallbackOnlyProvider(name: AiProviderName) {
  return {
    name,
    async invoke() {
      throw new Error(
        `${name} provider is not enabled in the current M1 environment.`,
      );
    },
  };
}

function getActiveProviderName() {
  return getServerEnv().AI_PROVIDER_MODE;
}

function createUsageRepository() {
  try {
    return new SupabaseAiUsageRepository();
  } catch {
    return new InMemoryAiUsageRepository();
  }
}

export function createAiGateway(dependencies: AiGatewayDependencies = {}) {
  const usageRepository =
    dependencies.usageRepository ?? createUsageRepository();
  const anonymousRateLimiter =
    dependencies.anonymousRateLimiter ?? createAnonymousAiRateLimiter();
  const now = dependencies.now ?? (() => new Date());

  const mockProvider = createMockProvider();
  const fallbackProviders = {
    mock: mockProvider,
    openai: createFallbackOnlyProvider("openai"),
    anthropic: createFallbackOnlyProvider("anthropic"),
  };

  async function executeOperation<TName extends keyof OperationPayloadMap>(
    name: TName,
    input: OperationPayloadMap[TName]["input"],
    context: OperationContext = {},
  ): Promise<OperationResult<OperationPayloadMap[TName]["output"]>> {
    if (!context.userId && context.anonymousKey) {
      const decision = await anonymousRateLimiter.limit(context.anonymousKey);
      if (!decision.success) {
        throw new RateLimitExceededError(decision);
      }
    }

    const providerMode = getActiveProviderName();
    const provider = fallbackProviders[providerMode];
    const budgetDate = now().toISOString().slice(0, 10);

    const existingBudget = await usageRepository.getDailyBudget(
      provider.name,
      budgetDate,
    );
    if (
      existingBudget?.hard_limit_tokens !== null &&
      existingBudget?.hard_limit_tokens !== undefined &&
      existingBudget.total_tokens >= existingBudget.hard_limit_tokens
    ) {
      throw new Error(
        `Daily AI budget exhausted for provider ${provider.name}.`,
      );
    }

    const operationMap: Record<
      keyof OperationPayloadMap,
      ProviderInvocation<any, any>
    > = {
      generatePath: mockProvider.generatePath,
      parseResume: mockProvider.parseResume,
      simulateWhatIf: mockProvider.simulateWhatIf,
      explainRecommendation: mockProvider.explainRecommendation,
      moderateContent: mockProvider.moderateContent,
    };

    let usedFallback = false;
    let status: AiUsageLogRecord["status"] = "success";
    let errorMessage: string | null = null;
    let resolvedProvider: AiProviderName = provider.name;
    let invocationResult:
      | {
          output: OperationPayloadMap[TName]["output"];
          inputTokens: number;
          outputTokens: number;
          latencyMs: number;
        }
      | undefined;

    try {
      if (provider.name === "mock") {
        invocationResult = await operationMap[name](input);
      } else {
        await fallbackProviders[provider.name].invoke();
      }
    } catch (error) {
      usedFallback = true;
      status = "fallback";
      errorMessage =
        error instanceof Error ? error.message : "Unknown AI provider failure.";
      invocationResult = await operationMap[name](input);
      resolvedProvider = "mock";
    }

    if (!invocationResult) {
      throw new Error(`AI operation ${name} did not return an output.`);
    }

    const usageLogId = await usageRepository.recordCall({
      userId: context.userId ?? null,
      operation: name as AiOperationName,
      provider: resolvedProvider,
      providerMode,
      status,
      inputTokens: invocationResult.inputTokens,
      outputTokens: invocationResult.outputTokens,
      totalTokens: invocationResult.inputTokens + invocationResult.outputTokens,
      latencyMs: invocationResult.latencyMs,
      requestPayload: input as never,
      responsePayload: invocationResult.output as never,
      errorMessage,
    });

    return {
      output: invocationResult.output,
      provider: resolvedProvider,
      providerMode,
      usedFallback,
      usageLogId,
    };
  }

  return {
    async generatePath(
      input: PathGenerationInput,
      context: OperationContext = {},
    ) {
      return executeOperation(
        "generatePath",
        pathGenerationInputSchema.parse(input),
        context,
      );
    },
    async parseResume(input: ResumeParseInput, context: OperationContext = {}) {
      return executeOperation(
        "parseResume",
        resumeParseInputSchema.parse(input),
        context,
      );
    },
    async simulateWhatIf(
      input: WhatIfSimulationInput,
      context: OperationContext = {},
    ) {
      return executeOperation(
        "simulateWhatIf",
        whatIfSimulationInputSchema.parse(input),
        context,
      );
    },
    async explainRecommendation(
      input: RecommendationExplanationInput,
      context: OperationContext = {},
    ) {
      return executeOperation(
        "explainRecommendation",
        recommendationExplanationInputSchema.parse(input),
        context,
      );
    },
    async moderateContent(
      input: ContentModerationInput,
      context: OperationContext = {},
    ) {
      return executeOperation(
        "moderateContent",
        contentModerationInputSchema.parse(input),
        context,
      );
    },
  };
}
