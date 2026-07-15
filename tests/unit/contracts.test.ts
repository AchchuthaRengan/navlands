import { describe, expect, it } from "vitest";

import {
  nodeMetadataSchema,
  pathGenerationOutputSchema,
  suggestionCardSchema,
} from "@/types/contracts";

describe("contracts", () => {
  it("requires suggestion cards to include timeline_months", () => {
    const parsed = suggestionCardSchema.parse({
      id: crypto.randomUUID(),
      title: "Test suggestion",
      summary: "Summary",
      rationale: "Rationale",
      source_label: "ai_suggested",
      confidence_label: "exploratory",
      timeline_months: 4,
      next_step: "Do the next thing.",
    });

    expect(parsed.timeline_months).toBe(4);
  });

  it("uses a discriminated union for node metadata", () => {
    expect(
      nodeMetadataSchema.parse({
        kind: "project",
        deliverable: "Build a public portfolio artifact",
        portfolio_worthy: true,
        source_label: "hybrid",
      }).kind,
    ).toBe("project");
  });

  it("validates the path generation contract", () => {
    const output = pathGenerationOutputSchema.parse({
      path_id: crypto.randomUUID(),
      title: "Path",
      summary: "Path summary",
      source_label: "ai_suggested",
      confidence_label: "exploratory",
      trust_note: "Trust note",
      nodes: [
        {
          id: crypto.randomUUID(),
          title: "Node",
          summary: "Summary",
          timeline_months: 1,
          source_label: "ai_suggested",
          metadata: {
            kind: "skill_building",
            skill_names: ["Writing"],
            source_label: "ai_suggested",
          },
        },
      ],
      edges: [],
      suggestion_cards: [],
      next_steps: ["Validate with a human source."],
      warnings: [],
    });

    expect(output.nodes).toHaveLength(1);
  });
});
