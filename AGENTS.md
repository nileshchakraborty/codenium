# Codex Project Guide

This file is the Codex-facing equivalent of `.agent/` and is intended to guide project management, role behavior, and reusable skills for this repository.

## Project Profile

- Project: `Codenium`
- Goal: premium algorithm and data-structure visualization platform with AI tutoring and 250+ LeetCode problems.
- Architecture: Hexagonal (Ports and Adapters).
- Frontend: React 19, Vite 7, TypeScript 5.7, TailwindCSS 3.4, Framer Motion, Monaco.
- Backend: Node.js 24, Express 4.18, TypeScript.
- AI Integrations: OpenAI SDK, Ollama.
- Deploy targets: Vercel serverless plus Docker-friendly hosting (Railway/Render).

## Repository Map

- `frontend/`: React SPA and UI layer.
- `api/`: serverless API handlers.
- `src/domain/`: core entities and ports.
- `src/application/`: use-cases and business logic.
- `src/adapters/`: driven/driving adapters (AI, execution, persistence).
- `data/`: JSON problem/solution store.
- `scripts/`: data and maintenance utilities.

## Agent Profiles

### Architect

- Own system boundaries and long-term maintainability.
- Enforce hexagonal boundaries by keeping domain and use-cases in `src/domain` and `src/application`.
- Keep external dependencies and integrations in `src/adapters` and `api/`.
- Review scaling, security, and dependency choices before major changes.

### Backend Engineer

- Own API behavior, integrations, and execution infrastructure.
- Implement adapters for AI, persistence, and code execution.
- Keep error handling and logs explicit; prioritize low-latency paths.
- Maintain scripts and data integrity checks around `data/` and `scripts/`.

### Frontend Engineer

- Own responsive, accessible, high-quality UI implementation.
- Keep UI logic in hooks/viewmodels; keep components focused on rendering.
- Maintain visualization, editor integrations, and search performance.
- Preserve design consistency across themes and motion.

### Planner and Reviewer

- Run structured reviews before and after substantial changes across architecture, code quality/DRY, tests/edge cases, and performance.
- Report issues with concrete file references, options, risks, and recommendation.

## Agent Skills

### Skill: Setup Development Environment

1. Copy `.env.example` to `.env` and fill required secrets.
2. Run `make install`.
3. Run `make dev` (or `./start.sh`).
4. Verify backend health at `http://localhost:3001/api/health`.

### Skill: Run Tests and Validation

1. Run `make test` (or `python3 validate_all.py`) for solution validation.
2. Run `cd frontend && npm run build` for frontend verification.
3. Run `cd api && npx tsc` for backend type checks.
4. Run `node scripts/validate-all-data.js` for data audit.

### Skill: Feature Delivery Guardrails

1. Confirm the correct role profile for the task first.
2. Keep architecture boundaries intact while implementing.
3. Add or update tests for changed behavior.
4. Run relevant validation commands before completion.
5. Summarize what changed, why, and any residual risks.

## Execution Notes for Codex

- Prefer small, verifiable edits over broad rewrites.
- Avoid introducing cross-layer coupling that breaks the hexagonal model.
- For review requests, prioritize findings (bugs, risks, regressions, missing tests).
- If uncertain about scope, default to the smallest safe implementation that satisfies the request.
