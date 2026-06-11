# 5G O-RAN AI Self-Healing Console Product Research Brief

更新日期：2026-06-11

## 1. 產品定位

這個專案的定位不是「把 ChatGPT 放進電信後台」，而是：

```text
AI-powered O-RAN operations console
```

它的核心價值是把 5G/O-RAN 維運資料、RAG 知識檢索、Agent tool calling、自癒流程與人工核准整合成可操作的前端控制台。

目標履歷定位：

```text
AI Application Frontend / LLM Tooling Frontend Engineer
```

使用者看到的不是單一聊天框，而是完整維運流程：

```text
告警與 KPI
  -> AI diagnosis
  -> RAG evidence
  -> Recovery Agent plan
  -> Human approval gate
  -> External notification / ticket creation
  -> Verification report
```

## 2. 使用者與場景

主要使用者：

- NOC operator：需要快速知道現在是否有重大告警，以及誰要處理。
- RAN engineer：需要根據 KPI、告警、拓樸與配置變更判斷 root cause。
- On-call engineer：需要收到精簡、可行動的 incident summary。
- SRE / platform engineer：需要看到 Agent 做了哪些 tool calls，以及是否有越權風險。

核心情境：

```text
URLLC slice 發生 SLA breach
DU packet loss 升高
Near-RT RIC latency 升高
xApp handover policy 最近被調整
```

系統需要協助使用者回答：

- 發生什麼事？
- 影響哪些 UE/gNB/RU/DU/CU/RIC？
- 有哪些證據支持這個推論？
- AI 建議採取什麼修復動作？
- 哪些動作可以自動執行，哪些需要人工核准？
- 是否需要通知 Gmail / Discord / OpenProject / GitHub Issue？

## 3. O-RAN 對應關係

O-RAN Software Community 文件將 Near-RT RIC、Non-RT RIC、SMO、OAM、Integration、AI/ML Framework 列為重要專案與整合範圍。這個 PoC 可以對應到下列產品模組：

| O-RAN / 維運概念 | 前端模組 | AI 應用 |
|---|---|---|
| SMO | Service / inventory overview | 產生跨系統維運摘要 |
| Non-RT RIC / rApp | Policy recommendation | 長週期策略建議與趨勢分析 |
| Near-RT RIC / xApp | Control-loop monitor | 即時 policy loop 異常分析 |
| OAM / FM | Alarm Center | 告警摘要、去重、分群 |
| PM / KPI | Dashboard / chart | KPI correlation、異常偵測 |
| RU / DU / CU / gNB / UE | React Flow topology | 影響範圍推論 |
| AI/ML Framework | Diagnosis / evaluation | root cause、confidence、verification |

## 4. AI / RAG / Agent 關聯

### RAG

RAG 負責把靜態知識與事件上下文接起來：

- O-RAN spec 摘要
- SOP / runbook
- alarm guide
- 過往 incident report
- xApp/rApp policy change record
- 公司內部部署規範

當告警發生時，RAG 不只是搜尋文字，而是回傳可引用的 evidence：

```json
{
  "source": "SOP-ORAN-17",
  "section": "Near-RT RIC latency escalation",
  "matched_reason": "DU packet loss and RIC loop latency rose in the same window",
  "recommended_check": "inspect recent xApp handover policy changes"
}
```

### Agent

Agent 負責把 diagnosis 轉成流程。第一版可以先是 dry-run，不直接改真實網路。

建議 tool contract：

| Tool | 用途 |
|---|---|
| `get_alarm_history` | 讀取 FM 告警 |
| `get_kpi_snapshot` | 讀取 PM/KPI 快照 |
| `get_topology_context` | 查 UE/gNB/RU/DU/CU/RIC 關聯 |
| `query_knowledge_base` | 查 SOP / runbook |
| `infer_root_cause` | 產生 root cause candidates |
| `create_recovery_plan` | 建立可審核修復計畫 |
| `request_human_approval` | 標記需要人工核准 |
| `send_discord_alert` | 發送 NOC channel 通知 |
| `send_gmail_alert` | 寄送 on-call email |
| `create_openproject_task` | 建立追蹤任務 |
| `verify_recovery_result` | 觀察修復後 KPI |

### NemoClaw

NemoClaw 可以放在 Agent runtime 層，作為受控執行環境：

```text
Frontend console
  -> API / Agent gateway
  -> NemoClaw sandbox
  -> controlled tools
  -> Gmail / Discord / OpenProject / KPI API / RAG index
```

重點是：外部副作用不應該由前端直接做，也不應該讓 LLM 任意呼叫 API。Agent 應該只能在 NemoClaw 裡呼叫被允許的工具，並且把每一步回傳給前端顯示。

## 5. React Flow 拓樸規劃

下一版建議使用 React Flow / XYFlow 取代目前手寫 CSS topology。

節點類型：

- `ueGroupNode`
- `gnbNode`
- `ruNode`
- `duNode`
- `cuNode`
- `nearRtRicNode`
- `nonRtRicNode`
- `smoNode`
- `agentNode`

每個 node 顯示：

```ts
type OranNodeData = {
  label: string;
  role: "UE" | "gNB" | "RU" | "DU" | "CU" | "Near-RT RIC" | "Non-RT RIC" | "SMO";
  status: "normal" | "warning" | "critical";
  kpis: {
    latencyMs?: number;
    packetLossPct?: number;
    prbUsagePct?: number;
    handoverFailurePct?: number;
  };
  activeAlarms: number;
  aiSummary?: string;
};
```

互動：

- 點擊 node 顯示 KPI、告警、AI summary。
- 點擊 edge 顯示介面狀態，例如 fronthaul / E2 / A1 / O1。
- Critical node 高亮，並顯示 Agent 建議動作。
- Topology 可用 filter 切換 UE / gNB / RIC / SMO 層級。

## 6. 外部通知與任務連動

這個專案可以展示 AI workflow 如何連到實際工作流：

```text
Critical alarm
  -> AI diagnosis
  -> Agent generates incident summary
  -> Human approval
  -> Discord notification
  -> Gmail on-call email
  -> OpenProject task
  -> Verification report
```

第一版不需要真的寄信或發 Discord，可以先做 mock tools：

```ts
sendDiscordAlert({ channel, severity, summary, evidenceLinks })
sendGmailAlert({ to, subject, body })
createOpenProjectTask({ projectId, subject, description, severity })
```

前端要顯示：

- tool name
- input summary
- status
- result
- risk level
- whether approval was required

## 7. MVP Backlog

### Phase 1：產品敘事與文件

- [x] 建立靜態 PoC
- [x] 補產品研究 brief
- [x] 補 GitHub Pages 入口
- [ ] 同步 HackMD note

### Phase 2：Next.js / TypeScript 化

- [ ] 建立 Next.js app
- [ ] 建立 mock API layer
- [ ] 建立 typed O-RAN data model
- [ ] 導入 Zustand / TanStack Query

### Phase 3：React Flow Topology

- [ ] 使用 React Flow 建 UE/gNB/RU/DU/CU/RIC/SMO 拓樸
- [x] 支援 node inspector
- [x] 支援 alarm impact path 高亮
- [ ] 支援 topology filter

### Phase 4：AI Workflow

- [x] Agent step trace component
- [ ] RAG evidence panel
- [ ] Recovery plan diff
- [x] Human approval gate
- [x] Mock Discord / Gmail / OpenProject tools
- [x] Incident report draft after approval

### Phase 5：NemoClaw Integration

- [ ] 定義 NemoClaw controlled tools
- [ ] 建立 local tool manifest
- [ ] Agent dry-run demo
- [ ] 工具執行紀錄回寫前端

## 8. 面試說法

簡短版：

```text
我把過去 5G 小型基地台 EMS / RIC 管理平台的經驗，延伸成一個 AI-powered O-RAN self-healing console。它不是單純 chat UI，而是把 KPI、告警、拓樸、RAG evidence、Agent tool calling 和 human approval gate 串成一個維運流程。
```

技術版：

```text
前端規劃使用 Next.js + TypeScript + React Flow + Zustand + TanStack Query。AI workflow 會由 RAG 提供 SOP/runbook evidence，Agent 透過受控 tools 取得 alarm/KPI/topology context，產生 recovery plan，並在需要外部副作用時進入 human approval gate。未來 NemoClaw 可作為 sandbox runtime，限制 Agent 只能呼叫允許的 Gmail、Discord、OpenProject 或 KPI 查詢工具。
```

## 9. 參考來源

- O-RAN Software Community documentation: https://docs.o-ran-sc.org/en/latest/
- O-RAN Software overview: https://www.o-ran.org/software
- React Flow documentation: https://reactflow.dev/learn
- GitHub Pages publishing source: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
