import { z } from "zod";

export const sourceLabelSchema = z.enum([
  "ai_suggested",
  "human_backed",
  "hybrid",
]);

export const confidenceLabelSchema = z.enum([
  "high_confidence",
  "medium_confidence",
  "exploratory",
]);

export const moneyRangeSchema = z.object({
  currency: z.enum(["INR", "USD"]),
  min: z.number().nonnegative().nullable(),
  max: z.number().nonnegative().nullable(),
  period: z.enum(["hour", "month", "year"]),
});

export const proofReferenceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  source_type: z.string().min(1),
  summary: z.string().min(1).optional(),
});

const nodeMetadataBaseSchema = z.object({
  source_label: sourceLabelSchema.default("ai_suggested"),
});

const careerTargetMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("career_target"),
  fit_summary: z.string().min(1),
  salary_range: moneyRangeSchema.optional(),
  outlook: z.string().min(1).optional(),
});

const skillBuildingMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("skill_building"),
  skill_names: z.array(z.string().min(1)).min(1),
  practice_hours: z.number().int().nonnegative().optional(),
  artifact_goal: z.string().min(1).optional(),
});

const educationMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("education"),
  provider_name: z.string().min(1),
  program_name: z.string().min(1),
  cost_estimate: moneyRangeSchema.optional(),
});

const credentialMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("credential"),
  credential_name: z.string().min(1),
  issuer: z.string().min(1),
  exam_required: z.boolean().default(false),
});

const projectMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("project"),
  deliverable: z.string().min(1),
  portfolio_worthy: z.boolean().default(true),
});

const experienceMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("experience"),
  role_title: z.string().min(1),
  experience_type: z.enum([
    "internship",
    "apprenticeship",
    "volunteer",
    "freelance",
  ]),
});

const decisionMetadataSchema = nodeMetadataBaseSchema.extend({
  kind: z.literal("decision"),
  decision_prompt: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
});

export const nodeMetadataSchema = z.discriminatedUnion("kind", [
  careerTargetMetadataSchema,
  skillBuildingMetadataSchema,
  educationMetadataSchema,
  credentialMetadataSchema,
  projectMetadataSchema,
  experienceMetadataSchema,
  decisionMetadataSchema,
]);

export const pathNodeSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  summary: z.string().min(1),
  timeline_months: z.number().int().nonnegative().nullable(),
  source_label: sourceLabelSchema,
  metadata: nodeMetadataSchema,
});

export const pathEdgeSchema = z.object({
  id: z.string().uuid(),
  from_node_id: z.string().uuid(),
  to_node_id: z.string().uuid(),
  edge_kind: z.string().min(1).default("next"),
  rationale: z.string().min(1),
});

export const suggestionCardSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  summary: z.string().min(1),
  rationale: z.string().min(1),
  source_label: sourceLabelSchema,
  confidence_label: confidenceLabelSchema,
  timeline_months: z.number().int().nonnegative(),
  related_node_id: z.string().uuid().optional(),
  tags: z.array(z.string().min(1)).default([]),
  next_step: z.string().min(1),
  proof_references: z.array(proofReferenceSchema).default([]),
});

export const pathGenerationInputSchema = z.object({
  user_id: z.string().uuid().optional(),
  prompt: z.string().min(1),
  interests: z.array(z.string().min(1)).default([]),
  constraints: z.array(z.string().min(1)).default([]),
});

export const pathGenerationOutputSchema = z.object({
  path_id: z.string().uuid(),
  title: z.string().min(1),
  summary: z.string().min(1),
  source_label: sourceLabelSchema,
  confidence_label: confidenceLabelSchema,
  trust_note: z.string().min(1),
  nodes: z.array(pathNodeSchema).min(1),
  edges: z.array(pathEdgeSchema),
  suggestion_cards: z.array(suggestionCardSchema),
  next_steps: z.array(z.string().min(1)).min(1),
  warnings: z.array(z.string().min(1)).default([]),
});

export const resumeParseInputSchema = z.object({
  user_id: z.string().uuid().optional(),
  resume_text: z.string().min(1),
  source_filename: z.string().min(1).optional(),
});

export const resumeParseOutputSchema = z.object({
  source_label: sourceLabelSchema,
  candidate_summary: z.string().min(1),
  extracted_skills: z.array(z.string().min(1)).default([]),
  experience_highlights: z.array(z.string().min(1)).default([]),
  education_highlights: z.array(z.string().min(1)).default([]),
  suggested_roles: z.array(z.string().min(1)).default([]),
  caution_flags: z.array(z.string().min(1)).default([]),
});

export const whatIfSimulationInputSchema = z.object({
  user_id: z.string().uuid().optional(),
  path_summary: z.string().min(1),
  scenario_prompt: z.string().min(1),
});

export const whatIfSimulationOutputSchema = z.object({
  source_label: sourceLabelSchema,
  scenario: z.string().min(1),
  delta_summary: z.string().min(1),
  updated_timeline_months: z.number().int().nonnegative(),
  upside: z.array(z.string().min(1)).default([]),
  tradeoffs: z.array(z.string().min(1)).default([]),
  recommended_next_step: z.string().min(1),
});

export const recommendationExplanationInputSchema = z.object({
  user_id: z.string().uuid().optional(),
  suggestion_title: z.string().min(1),
  suggestion_summary: z.string().min(1),
});

export const recommendationExplanationOutputSchema = z.object({
  source_label: sourceLabelSchema,
  explanation: z.string().min(1),
  supporting_points: z.array(z.string().min(1)).min(1),
  caution_points: z.array(z.string().min(1)).default([]),
});

export const contentModerationInputSchema = z.object({
  user_id: z.string().uuid().optional(),
  content: z.string().min(1),
});

export const contentModerationOutputSchema = z.object({
  source_label: sourceLabelSchema,
  verdict: z.enum(["allow", "review", "block"]),
  reason: z.string().min(1),
  categories: z.array(z.string().min(1)).default([]),
});

export const emailSchema = z.string().trim().email();
export const passwordSchema = z.string().min(8).max(128);

export const loginInputSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupInputSchema = loginInputSchema.extend({});

export const profileUpsertSchema = z.object({
  user_id: z.string().uuid(),
  email: emailSchema.optional().nullable(),
  display_name: z.string().trim().min(1).max(120).optional().nullable(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  headline: z.string().trim().max(160).optional().nullable(),
  persona: z.string().trim().max(80).optional().nullable(),
  preferences: z.record(z.string(), z.unknown()).default({}),
});

export type SourceLabel = z.infer<typeof sourceLabelSchema>;
export type NodeMetadata = z.infer<typeof nodeMetadataSchema>;
export type PathNode = z.infer<typeof pathNodeSchema>;
export type PathEdge = z.infer<typeof pathEdgeSchema>;
export type SuggestionCard = z.infer<typeof suggestionCardSchema>;
export type PathGenerationInput = z.infer<typeof pathGenerationInputSchema>;
export type PathGenerationOutput = z.infer<typeof pathGenerationOutputSchema>;
export type ResumeParseInput = z.infer<typeof resumeParseInputSchema>;
export type ResumeParseOutput = z.infer<typeof resumeParseOutputSchema>;
export type WhatIfSimulationInput = z.infer<typeof whatIfSimulationInputSchema>;
export type WhatIfSimulationOutput = z.infer<
  typeof whatIfSimulationOutputSchema
>;
export type RecommendationExplanationInput = z.infer<
  typeof recommendationExplanationInputSchema
>;
export type RecommendationExplanationOutput = z.infer<
  typeof recommendationExplanationOutputSchema
>;
export type ContentModerationInput = z.infer<
  typeof contentModerationInputSchema
>;
export type ContentModerationOutput = z.infer<
  typeof contentModerationOutputSchema
>;
export type LoginInput = z.infer<typeof loginInputSchema>;
export type SignupInput = z.infer<typeof signupInputSchema>;
export type ProfileUpsertInput = z.infer<typeof profileUpsertSchema>;
