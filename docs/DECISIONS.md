# Decisions — 2026-11-11

- Preserve the static frontend and existing Worker/D1 backend; no VPS or new SaaS subscription.
- Ship deterministic, documented commands as the credential-free assistant fallback. Label it accurately; no fabricated model inference.
- Apply assistance only after review and only if the editor is unchanged since review. Deletion/replacement is explicit. Financial actions never enter the assistant action schema.
- Start new customer drafts without demo products/prices/ingredients. Gallery templates remain available as separate examples.
- Reuse current shared customer sessions, organization identifiers and authorization guards for private cloud drafts. Do not add a separate identity store.
- Keep production feature flags, billing and deploy state unchanged. Local commits use isolated feature branches.
