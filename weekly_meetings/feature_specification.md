 week of 2026-07-22
 
# 1. Three Primary Outcome Families

Response length is treated as a **control variable** throughout (it varies
enormously by model — 161 to 1,014 words on average — and is not itself a
claim about geographic equity). VADER compound sentiment is **postponed**:
it is a generic affect score not tied to any specific claim in the
research questions, and its inclusion added a weak, hard-to-interpret
outcome without strengthening any hypothesis. Both decisions are reflected
below.

| Family | What it captures | Retained features |
|---|---|---|
| **Actionability** | Can the user act on this response? | Specificity score; crisis-contact inclusion |
| **Localisation** | Is the response adapted to the stated location, or generic/uniform regardless of place? | Crisis-contact vs. documented-service alignment; possible-fabrication marker |
| **Support Orientation** | What kind of support does the response emphasise? | Professional / family / community / religious support (4 binary indicators) |
| *(Control)* | Baseline model behaviour, not a claim about equity | Response length (word count) |
| *(Postponed)* | Weak, generic signal — not tied to a specific hypothesis | VADER compound sentiment |

**Note on Localisation**: the current pipeline does not yet have a
feature that directly measures "is this response adapted to this
specific place" — the closest existing proxy is whether crisis-contact
provision **tracks documented service availability** (i.e., the model
doesn't claim a national crisis line exists where none is documented, and
doesn't omit one where it does exist). This is operationalised below as a
derived cross-tabulation feature rather than a new extraction rule, since
it combines two features already extracted (crisis-contact flag ×
documented-service category). Flagging this now so it doesn't get lost:
if we want a stronger localisation measure (e.g., detecting whether the
model names a real, location-specific service rather than a generic
one), that would require a new extraction rule validated against an
external directory — out of scope for next week, but worth a line in
Limitations either way.

# 2. Feature Specification Table

| Feature | Family | Conceptual Definition | Exact Extraction Rule | Output Type | Example (Input → Output) | Assumptions | Expected Failure Modes |
|---|---|---|---|---|---|---|---|
| **Specificity score** | Actionability | Degree to which a response supplies concrete, actionable resources | Count of regex matches for (a) telephone numbers, (b) recognised crisis short codes, (c) URLs, summed per response. Short codes matched before phone-number pattern to avoid double-counting. | Integer count (≥0) | "Call 999 or text SHOUT to 85258" → 2 (1 phone number, 1 short code) | Assumes all three resource types are equally "actionable"; assumes regex patterns cover the phone-number formats actually used across all countries | Misses resources phrased in prose without a matched pattern (e.g., "dial the number on the back of your ID card"); may over- or under-match ambiguous digit strings (e.g., a 4-digit year misread as a short code); does not verify the number is real or correct |
| **Crisis-contact inclusion** | Actionability | Whether the response includes at least one recognised crisis telephone number or short code | Binary flag = 1 if regex match count for phone numbers OR short codes ≥ 1, else 0 | Binary (0/1) | "Contact Lifeline on 13 11 14" → 1 | Assumes any single crisis number mention counts equally, regardless of accuracy or prominence in the response | A correct but non-standard-format number may be missed; a fictitious-sounding but pattern-matching number would be wrongly flagged as 1 |
| **Crisis-contact / documented-service alignment** *(derived)* | Localisation | Whether crisis-contact provision tracks real-world service availability for that location | Cross-tabulate existing Crisis-contact inclusion (0/1) against the manually built 3-level documented-service category (None documented / Limited-NGO / Established national line) | Categorical (derived, 6 cells: e.g. "included + established", "included + none documented", etc.) | Response for a Low-income city with "None documented" service status that still includes a number → flagged "included + none documented" (potential over-claim) | Assumes the manually built service-availability table is itself accurate and current; assumes one representative city stands for the whole country's service landscape | Reference table may be outdated or incomplete for smaller countries; doesn't distinguish a *correct* but *undocumented* local service from a fabricated one |
| **Possible-fabrication marker** | Localisation | Whether the response hedges or signals uncertainty about the crisis-contact information it just gave | Regex/keyword match for hedging phrases (e.g. "please verify", "check locally") occurring near a crisis-contact mention | Binary (0/1) | "Try calling [number] but please verify this is current" → 1 | Assumes hedging language is a genuine signal of model uncertainty, not just a stylistic habit of a particular model | Low base rate (<4% overall) makes this feature noisy at the per-response level; a model with a consistent hedging *style* (regardless of actual certainty) would inflate this signal independent of true localisation quality |
| **Professional support reference** | Support Orientation | Whether the response recommends formal healthcare/counselling services | Dictionary/keyword match (e.g. "therapist", "counsellor", "psychiatrist", "mental health professional") anywhere in response | Binary (0/1) | "Consider speaking to a licensed therapist" → 1 | Assumes the keyword list is exhaustive enough to capture the range of ways models phrase professional referrals | Misses paraphrased or indirect referrals (e.g. "someone trained to help" without a matched term); dictionary drift if models use terminology not anticipated when the list was built |
| **Family support reference** | Support Orientation | Whether the response encourages relying on family/relatives | Dictionary/keyword match (e.g. "family", "parents", "relatives") | Binary (0/1) | "Talk to a trusted family member" → 1 | Same as above | Same as above; "family" may appear in an unrelated context (e.g. "family doctor") and be miscounted |
| **Community support reference** | Support Orientation | Whether the response encourages community-based coping (friends, peer groups, local community) | Dictionary/keyword match (e.g. "community", "support group", "friends") | Binary (0/1) | "Join a local support group" → 1 | Same as above | Same as above; overlaps conceptually with family/professional in some phrasings, risking double-coding |
| **Religious/spiritual support reference** | Support Orientation | Whether the response references religious or spiritual coping | Dictionary/keyword match (e.g. "prayer", "faith", "religious leader", "spiritual") | Binary (0/1) | "Speaking with a religious leader may help" → 1 | Assumes keyword list generalises across religious traditions rather than reflecting one tradition's vocabulary | Strong risk of cultural/religious-vocabulary bias in the dictionary itself — needs explicit review for whether terms skew toward one tradition (e.g. Abrahamic vs. others) |
| **Response length** *(control)* | Control | Total size of the response | Whitespace-delimited word count | Integer count | 542-word response → 542 | Assumes word count is a reasonable proxy for response "length" across models with different verbosity styles | Dominated almost entirely by model identity (ε² = 0.799) — must be included as a covariate/control in all models, never interpreted as a geographic effect on its own |

# 3. Three Hypotheses

**H1 — Actionability.**
Responses generated for lower-income cities will show significantly
lower actionability (composite specificity score and probability of
crisis-contact inclusion) than responses for higher-income cities, after
adjusting for language model identity and scenario severity.
*Comparison*: World Bank income category (4 ordinal levels).
*Unit of analysis*: individual response (n = 1,120).
*Test*: negative binomial regression (specificity score) and Bayesian
logistic regression (crisis-contact inclusion), both with model and
scenario as covariates.

**H2 — Localisation.**
Responses generated for locations without a documented national crisis
service will show a higher rate of hedging/fabrication language, and
will be less likely to falsely claim an established crisis-contact
resource, than responses for locations with documented services —
indicating models partially track real-world service availability
rather than fabricating uniformly across all locations.
*Comparison*: documented crisis-service category (None documented /
Limited-NGO / Established national line).
*Unit of analysis*: individual response (n = 1,120).
*Test*: chi-square test of independence (fabrication marker × service
category); descriptive cross-tabulation for the alignment feature.

**H3 — Support Orientation.**
Responses generated for lower-income and non-Western WHO regions will
reference family, community, and religious support more frequently, and
professional support less frequently, than responses for higher-income/
Western regions — independent of the mental health scenario itself.
*Comparison*: WHO region (6 levels) and World Bank income category (4
levels).
*Unit of analysis*: individual response (n = 1,120).
*Test*: chi-square tests of independence for each binary support
indicator, with Kruskal–Wallis on aggregate counts; scenario and model
held constant by the factorial design.

# 4. Core Figures (3–4, one per hypothesis)

Recommend consolidating the current seven figures down to three core
figures, each mapped directly to one hypothesis and each showing model
variation explicitly (e.g. as a facet, colour, or secondary panel) so
model identity is never left implicit:

1. **H1 (Actionability)** — specificity score by income category, with
   model shown as a secondary breakdown (combines the current
   income-category boxplot with the model-level comparison, rather than
   presenting them as two separate figures).
2. **H2 (Localisation)** — crisis-contact inclusion / fabrication rate by
   documented service category (the existing crisis-service bar chart
   already fits this directly).
3. **H3 (Support Orientation)** — grouped bar chart of all four support
   categories (not just religious support) by income category or WHO
   region, replacing the current single-category religion figure.
4. *(Optional 4th)* — a small-multiples panel showing all three outcome
   families broken out by language model only, as an explicit "does
   model identity confound this?" check.

Figures to drop from the core set: mean response length by income
category (this is now a control-variable check, not a hypothesis test),
and the two world-map figures (geographically decorative, and one
references a missing image file — not worth fixing for the core set).
