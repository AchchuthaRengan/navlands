import { createAdminSupabaseClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/db/supabase";

export type AiProviderName = "mock" | "openai" | "anthropic";
export type AiOperationName =
  | "generatePath"
  | "parseResume"
  | "simulateWhatIf"
  | "explainRecommendation"
  | "moderateContent";

export type AiUsageLogRecord = {
  userId?: string | null;
  operation: AiOperationName;
  provider: AiProviderName;
  providerMode: AiProviderName;
  status: "success" | "fallback" | "error";
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
  cacheHit?: boolean;
  requestPayload?: Json;
  responsePayload?: Json;
  errorMessage?: string | null;
};

export interface AiUsageRepository {
  getDailyBudget(
    provider: AiProviderName,
    budgetDate: string,
  ): Promise<Database["public"]["Tables"]["ai_daily_budget"]["Row"] | null>;
  recordCall(record: AiUsageLogRecord): Promise<string>;
}

export class InMemoryAiUsageRepository implements AiUsageRepository {
  private readonly budgets = new Map<
    string,
    Database["public"]["Tables"]["ai_daily_budget"]["Row"]
  >();

  async getDailyBudget(provider: AiProviderName, budgetDate: string) {
    return this.budgets.get(`${provider}:${budgetDate}`) ?? null;
  }

  async recordCall(record: AiUsageLogRecord) {
    const budgetDate = new Date().toISOString().slice(0, 10);
    const key = `${record.provider}:${budgetDate}`;
    const current = this.budgets.get(key);

    this.budgets.set(key, {
      id: crypto.randomUUID(),
      budget_date: budgetDate,
      provider: record.provider,
      request_count: (current?.request_count ?? 0) + 1,
      input_tokens: (current?.input_tokens ?? 0) + record.inputTokens,
      output_tokens: (current?.output_tokens ?? 0) + record.outputTokens,
      total_tokens: (current?.total_tokens ?? 0) + record.totalTokens,
      soft_limit_tokens: current?.soft_limit_tokens ?? null,
      hard_limit_tokens: current?.hard_limit_tokens ?? null,
      created_at: current?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    return crypto.randomUUID();
  }
}

export class SupabaseAiUsageRepository implements AiUsageRepository {
  async getDailyBudget(provider: AiProviderName, budgetDate: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("ai_daily_budget")
      .select("*")
      .eq("provider", provider)
      .eq("budget_date", budgetDate)
      .maybeSingle();

    if (error) {
      throw new Error(`Could not read ai_daily_budget: ${error.message}`);
    }

    return data;
  }

  async recordCall(record: AiUsageLogRecord) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.rpc("record_ai_call", {
      p_user_id: record.userId ?? null,
      p_operation: record.operation,
      p_provider: record.provider,
      p_provider_mode: record.providerMode,
      p_status: record.status,
      p_input_tokens: record.inputTokens,
      p_output_tokens: record.outputTokens,
      p_total_tokens: record.totalTokens,
      p_latency_ms: record.latencyMs,
      p_cache_hit: record.cacheHit ?? false,
      p_request_payload: record.requestPayload ?? {},
      p_response_payload: record.responsePayload ?? {},
      p_error_message: record.errorMessage ?? null,
    });

    if (error) {
      throw new Error(`Could not record ai_call_log entry: ${error.message}`);
    }

    return data;
  }
}
