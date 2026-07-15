import type { SuggestionCard } from "@/types/contracts";

type ExplorationOverviewProps = {
  userEmail: string;
  providerMode: string;
};

const starterSuggestions: SuggestionCard[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Start with a small signal, not a life decision",
    summary:
      "Frame your first prompt around a direction you want to test, not a permanent identity.",
    rationale:
      "The exploration engine works best when it can generate falsifiable next steps instead of vague motivation.",
    source_label: "hybrid",
    confidence_label: "medium_confidence",
    timeline_months: 1,
    tags: ["entry-point", "prompting"],
    next_step:
      "Write one sentence about a role, problem, or domain you want to pressure-test.",
    proof_references: [],
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Keep one proof-oriented constraint visible",
    summary:
      "Tie the first generated path to a portfolio artifact, experience target, or mentor conversation.",
    rationale:
      "Wayframe is designed to generate moves that can be validated in the real world, not just admired on screen.",
    source_label: "human_backed",
    confidence_label: "high_confidence",
    timeline_months: 2,
    tags: ["proof", "artifact"],
    next_step:
      "Choose the proof format you trust most before generating your first path.",
    proof_references: [],
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    title: "Use what-if mode to compare tradeoffs early",
    summary:
      "Treat time, money, and energy as first-class constraints before you commit to a path shape.",
    rationale:
      "The what-if lane in M2 will stay mock-backed, but it should still feel structured and decision-oriented.",
    source_label: "ai_suggested",
    confidence_label: "exploratory",
    timeline_months: 3,
    tags: ["constraints", "simulation"],
    next_step:
      "Prepare one scenario you want to compare once your first path is generated.",
    proof_references: [],
  },
];

const trustToneMap = {
  ai_suggested: "border-terracotta/20 bg-terracotta/10 text-terracotta",
  human_backed: "border-sage/20 bg-sage/10 text-sage",
  hybrid: "border-ink/10 bg-ink/5 text-charcoal",
} as const;

const confidenceToneMap = {
  high_confidence: "High confidence",
  medium_confidence: "Medium confidence",
  exploratory: "Exploratory",
} as const;

function SuggestionCardPreview({ card }: { card: SuggestionCard }) {
  return (
    <article className="glass-panel flex h-full flex-col gap-4 p-5">
      <div className="flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${trustToneMap[card.source_label]}`}
        >
          {card.source_label.replace("_", " ")}
        </span>
        <span className="rounded-full border border-sand/70 bg-cream/75 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-mist">
          {confidenceToneMap[card.confidence_label]}
        </span>
      </div>
      <div className="space-y-2">
        <p className="font-heading text-2xl text-ink">{card.title}</p>
        <p className="text-sm leading-6 text-charcoal">{card.summary}</p>
      </div>
      <dl className="grid gap-3 rounded-glass border border-sand/70 bg-cream/70 p-4 text-sm text-charcoal">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-mist">Timeline</dt>
          <dd className="font-mono text-terracotta">
            {card.timeline_months} month{card.timeline_months === 1 ? "" : "s"}
          </dd>
        </div>
        <div className="flex items-start justify-between gap-3">
          <dt className="text-mist">Next step</dt>
          <dd className="max-w-[18rem] text-right">{card.next_step}</dd>
        </div>
      </dl>
      <p className="mt-auto rounded-glass border border-ink/10 bg-parchment/70 px-4 py-3 text-sm leading-6 text-charcoal">
        {card.rationale}
      </p>
    </article>
  );
}

function ExplorationCanvasPreview() {
  return (
    <section className="glass-panel relative overflow-hidden p-6 md:p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,102,72,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(109,143,112,0.16),transparent_32%)]" />
      <div className="relative space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-mist">
              Exploration canvas
            </p>
            <h2 className="font-heading text-3xl text-ink">
              The shell is ready for real path data.
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-charcoal">
              Phase 1 replaces the placeholder with the visual surface M2 will
              build on. Path generation and persistence land in the next phase,
              but the canvas, lanes, and trust-first empty states are now in
              place.
            </p>
          </div>
          <div className="rounded-glass border border-terracotta/25 bg-cream/75 px-4 py-3 text-sm text-charcoal">
            <p className="font-medium text-terracotta">AI mode</p>
            <p className="mt-1 font-mono text-sm text-ink">mock</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.85fr]">
          <div className="rounded-glass border border-sand/70 bg-cream/70 p-4 md:p-5">
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  eyebrow: "1. Enter",
                  title: "Prompt the direction",
                  body: "Describe a role, problem, or field you want to test.",
                },
                {
                  eyebrow: "2. Generate",
                  title: "Shape the path",
                  body: "Wayframe will return structured nodes and proof-oriented next steps.",
                },
                {
                  eyebrow: "3. Compare",
                  title: "Run what-if",
                  body: "Adjust constraints before turning the path into commitment.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="rounded-glass border border-sand/70 bg-parchment/80 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-mist">
                    {item.eyebrow}
                  </p>
                  <p className="mt-3 font-heading text-2xl text-ink">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-charcoal">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-glass border border-sand/70 bg-parchment/75 p-4">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-mist">
                Path lanes
              </p>
              <div className="space-y-3">
                {[
                  {
                    lane: "Signal",
                    copy: "Collect the first clue worth testing.",
                  },
                  {
                    lane: "Build",
                    copy: "Translate interest into a visible artifact.",
                  },
                  {
                    lane: "Prove",
                    copy: "Aim for a real-world conversation, output, or opportunity.",
                  },
                ].map((lane) => (
                  <div
                    key={lane.lane}
                    className="rounded-glass border border-sand/60 bg-cream/75 px-4 py-4"
                  >
                    <p className="font-heading text-xl text-ink">{lane.lane}</p>
                    <p className="mt-1 text-sm leading-6 text-charcoal">
                      {lane.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ExplorationOverview({
  userEmail,
  providerMode,
}: ExplorationOverviewProps) {
  return (
    <div className="flex flex-col gap-6 pb-10">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="glass-panel space-y-5 p-6 md:p-8">
          <div className="space-y-3">
            <p className="font-accent text-3xl text-terracotta">
              Exploration begins here
            </p>
            <h1 className="font-heading text-5xl leading-none text-ink md:text-6xl">
              Replace the placeholder with a decision-ready shell.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-charcoal">
              M2 starts by turning the signed-in route into a visual-first
              exploration workspace. Path generation, onboarding, and what-if
              flows attach to this shell in the next phases.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-glass border border-sand/70 bg-cream/75 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-mist">
                Signed in
              </p>
              <p className="mt-3 text-sm leading-6 text-charcoal">
                {userEmail}
              </p>
            </div>
            <div className="rounded-glass border border-sand/70 bg-cream/75 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-mist">
                Provider mode
              </p>
              <p className="mt-3 font-mono text-sm text-terracotta">
                {providerMode}
              </p>
            </div>
            <div className="rounded-glass border border-sand/70 bg-cream/75 p-4">
              <p className="text-sm uppercase tracking-[0.24em] text-mist">
                Trust stance
              </p>
              <p className="mt-3 text-sm leading-6 text-charcoal">
                Every AI-derived surface stays labeled and schema-validated.
              </p>
            </div>
          </div>
        </div>

        <aside className="glass-panel space-y-4 p-6">
          <p className="text-sm uppercase tracking-[0.28em] text-mist">
            M2 entry checklist
          </p>
          <div className="space-y-4">
            {[
              "Lightweight exploration onboarding",
              "Prompt-first path generation action",
              "Visual path view with trust labels",
              "Suggestion cards and what-if lane",
            ].map((item, index) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-glass border border-sand/70 bg-cream/75 px-4 py-4"
              >
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-sm font-medium text-cream">
                  {index + 1}
                </span>
                <p className="text-sm leading-6 text-charcoal">{item}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <ExplorationCanvasPreview />

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-mist">
                Suggestion shelf
              </p>
              <h2 className="mt-2 font-heading text-3xl text-ink">
                Contract-aligned guidance cards
              </h2>
            </div>
            <p className="font-accent text-2xl text-terracotta">
              Still trust-labeled, even in empty state
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {starterSuggestions.map((card) => (
              <SuggestionCardPreview key={card.id} card={card} />
            ))}
          </div>
        </div>

        <aside className="glass-panel space-y-4 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-mist">
              What-if lane
            </p>
            <h2 className="mt-2 font-heading text-3xl text-ink">
              Compare before you commit
            </h2>
          </div>
          <p className="text-sm leading-7 text-charcoal">
            The next M2 phase will let you adjust time, cost, energy, or role
            assumptions and inspect the tradeoffs in the same visual surface.
          </p>
          <div className="rounded-glass border border-sage/20 bg-sage/10 px-4 py-4 text-sm leading-6 text-charcoal">
            <p className="font-medium text-sage">Suggested first scenario</p>
            <p className="mt-2">
              “What changes if I need a path that produces a visible artifact in
              6 weeks instead of 3 months?”
            </p>
          </div>
          <div className="rounded-glass border border-ink/10 bg-parchment/70 px-4 py-4 text-sm leading-6 text-charcoal">
            This shell is intentionally action-biased: every future AI surface
            should end in a testable move, not a motivational paragraph.
          </div>
        </aside>
      </section>
    </div>
  );
}
