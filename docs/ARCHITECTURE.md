# Architecture

Preserve AuraMenu as a static product frontend and AuraDigital as the existing Cloudflare API/shared identity source. Aura Control remains the operations system; no replacement customer database is introduced.

Assisted onboarding is a bounded data pipeline: editable transcript/text → deterministic extraction or CSV parsing → proposed changes → explicit review → revision-checked application → existing editor → existing template preview → local draft. No code, SQL, payment, or publishing commands are exposed. Missing facts remain missing. Unsupported natural language is reported instead of inferred.

Shared cloud drafts belong to existing organizations, use existing customer sessions and current membership permissions, and stay separate from published menu requests. A feature gate and applied migration are needed before use. Cross-domain SSO remains a deployment/integration task requiring centralized standards-based redirects; cookies must not be shared across unrelated domains.

Existing manual payment remains authoritative. A future provider must verify signatures, stable event IDs, order ownership, configured amount/currency and entitlement in one idempotent server operation. Provider setup is a blocker, not a successful test payment.
