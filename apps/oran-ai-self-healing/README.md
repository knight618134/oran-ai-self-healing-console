# 5G O-RAN AI Self-Healing Console

這是一個作品集型 PoC，定位為「懂 O-RAN 維運 workflow 的 AI Application Frontend」。

它不是單純聊天介面，而是把 5G/O-RAN 場景中的監控、告警、RAG 診斷與 Agent 自癒流程串成一個可展示的產品原型。

## Demo 內容

- Dashboard：網路健康度、告警數、延遲與自癒成功率
- Topology：SMO / Non-RT RIC / Near-RT RIC / CU / DU / RU / gNB / UE 節點拓樸、介面標籤、AI impact path
- Alarm Center：Fault Management queue 與嚴重度篩選
- AI Diagnosis：根據 KPI、告警與 SOP evidence 做 root cause analysis
- RAG Evidence：引用來源、匹配訊號、retrieval trace、index health
- Recovery Agent：展示 tool calling、step trace、human approval gate、Gmail / Discord / OpenProject mock tools
- Knowledge Base：RAG 檢索 SOP、runbook、alarm guide

## 如何打開

直接用瀏覽器打開：

```text
apps/oran-ai-self-healing/index.html
```

若要用本地 server：

```bash
cd apps/oran-ai-self-healing
python3 -m http.server 4173
```

然後打開：

```text
http://localhost:4173
```

## 求職定位文案

可放在履歷或作品集：

```text
建立 5G O-RAN AI 自癒管理平台 PoC，整合即時 KPI 監控、Fault Management、RAG 知識檢索與 Agent 修復流程，協助維運人員快速定位異常原因並產生可審核的自癒建議。前端重點包含資訊架構、互動式拓樸、AI diagnosis workflow、Agent step trace 與 human approval gate。
```

## 下一步

- 升級為 Next.js + TypeScript
- 使用 React Flow / XYFlow 重建目前的 UE / gNB / RU / DU / CU / RIC / SMO 拓樸資料模型
- 導入 WebSocket / SSE 模擬即時告警
- 增加 mock API layer，讓資料結構更接近真實 EMS / RIC 平台
- 串接本地 RAG prototype，支援 SOP markdown 檢索
- 加入 NemoClaw controlled tools，模擬 Gmail / Discord / OpenProject 通知與任務建立
- 加入 incident report export，讓 Agent 結果能沉澱成維運紀錄
- 增加 Cypress E2E 測試，展示維運流程測試能力
