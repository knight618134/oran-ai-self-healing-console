# 5G O-RAN AI Self-Healing Console

A portfolio PoC for an AI application frontend in the 5G O-RAN operations domain.

This is not a generic chatbot demo. It connects telecom operations concepts with an LLM/RAG/Agent workflow: monitoring, alarm triage, root-cause analysis, recovery planning, and human approval.

## Demo Scope

- Dashboard: network health, active alarms, latency, self-heal success rate
- Topology: SMO / Non-RT RIC / Near-RT RIC / CU / DU / RU / gNB / UE node view with interface labels and AI impact path
- Alarm Center: fault management queue with severity filtering
- AI Diagnosis: KPI and alarm evidence summarized into root-cause analysis
- RAG Evidence: citation cards, matched signals, retrieval trace, and index health
- Recovery Agent: tool-calling step trace, human approval gate, and Gmail / Discord / OpenProject mock tools
- Knowledge Base: RAG-style SOP / runbook / alarm guide search

## Why This Is an AI Application

The AI layer is not just a label in the UI. The target workflow is:

```text
O-RAN alarms + KPI + topology + config changes
  -> RAG retrieves SOP / runbook evidence
  -> Agent creates a root-cause diagnosis and recovery plan
  -> Human approval gate controls risky actions
  -> NemoClaw can execute allowed tools in a sandbox
  -> Gmail / Discord / OpenProject notifications are recorded in the trace
```

This makes the project a practical AI application frontend: it turns LLM/RAG/Agent output into reviewable operations workflow.

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
- Replace the CSS topology with React Flow / XYFlow for UE, gNB, RU, DU, CU, Near-RT RIC, Non-RT RIC, and SMO nodes
- Add mock API and WebSocket / SSE event streaming
- Connect a local RAG prototype for SOP markdown search
- Add Agent tools for Gmail, Discord, OpenProject, KPI lookup, and incident report generation
- Export an incident report artifact from approved Agent runs
- Add Cypress E2E tests for the incident-to-recovery workflow
- Deploy with GitHub Pages

## Project Docs

- [Product Research Brief](docs/product-research-brief.md)
- [Architecture Notes](docs/architecture-notes.md)
- [HackMD Sync Guide](docs/hackmd-sync.md)
