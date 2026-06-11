# 5G O-RAN AI Self-Healing Console

A portfolio PoC for an AI application frontend in the 5G O-RAN operations domain.

This is not a generic chatbot demo. It connects telecom operations concepts with an LLM/RAG/Agent workflow: monitoring, alarm triage, root-cause analysis, recovery planning, and human approval.

## Demo Scope

- Dashboard: network health, active alarms, latency, self-heal success rate
- Topology: SMO / Non-RT RIC / Near-RT RIC / CU / DU / RU node view
- Alarm Center: fault management queue with severity filtering
- AI Diagnosis: KPI and alarm evidence summarized into root-cause analysis
- Recovery Agent: tool-calling step trace and human approval gate
- Knowledge Base: RAG-style SOP / runbook / alarm guide search

## Local Demo

Open the static app directly:

```text
apps/oran-ai-self-healing/index.html
```

Or run a local server:

```bash
cd apps/oran-ai-self-healing
python3 -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Portfolio Positioning

```text
Built a 5G O-RAN AI self-healing operations console PoC that combines KPI monitoring, Fault Management, RAG-based knowledge retrieval, and an Agent recovery workflow. The product flow helps operators identify probable root causes and generate auditable recovery recommendations with a human approval gate.
```

## Next Steps

- Migrate to Next.js + TypeScript
- Add mock API and WebSocket / SSE event streaming
- Connect a local RAG prototype for SOP markdown search
- Add Cypress E2E tests for the incident-to-recovery workflow
- Deploy with GitHub Pages
