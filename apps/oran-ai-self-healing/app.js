const appState = {
  selectedNodeId: "DU-TPE-07",
  severityFilter: "all",
  agentRunning: false,
};

const metrics = [
  { label: "Network Health", value: "87%", note: "-6% in 20 min", tone: "warning" },
  { label: "Active Alarms", value: "14", note: "3 critical / 5 major", tone: "critical" },
  { label: "Avg Latency", value: "38ms", note: "+18 ms vs baseline", tone: "warning" },
  { label: "Self-Heal Success", value: "92%", note: "30-day dry-run score", tone: "normal" },
];

const kpiSeries = [
  22, 24, 23, 27, 30, 28, 31, 34, 37, 42, 46, 49, 54, 59, 62, 58, 55, 53,
];

const alarms = [
  {
    id: "FM-2048",
    severity: "critical",
    title: "DU packet loss above threshold",
    node: "DU-TPE-07",
    time: "09:42:18",
    probableCause: "transport congestion",
  },
  {
    id: "PM-7781",
    severity: "major",
    title: "Near-RT RIC control loop latency",
    node: "RIC-NEAR-01",
    time: "09:41:03",
    probableCause: "xApp policy queue delay",
  },
  {
    id: "CM-1190",
    severity: "major",
    title: "Recent handover policy changed",
    node: "xAPP-HO-02",
    time: "09:38:51",
    probableCause: "A3 offset update",
  },
  {
    id: "SM-4517",
    severity: "minor",
    title: "RU sync jitter warning",
    node: "RU-TPE-19",
    time: "09:35:22",
    probableCause: "clock drift",
  },
  {
    id: "AM-0931",
    severity: "critical",
    title: "URLLC slice SLA breach",
    node: "SLICE-URLLC-A",
    time: "09:33:08",
    probableCause: "latency budget exceeded",
  },
];

const nodes = [
  { id: "SMO-01", type: "SMO", x: 45, y: 46, status: "normal", cpu: "41%", latency: "8ms", alarms: 0 },
  { id: "RIC-NONRT-01", type: "Non-RT RIC", x: 245, y: 46, status: "normal", cpu: "52%", latency: "15ms", alarms: 1 },
  { id: "RIC-NEAR-01", type: "Near-RT RIC", x: 245, y: 208, status: "major", cpu: "73%", latency: "44ms", alarms: 3 },
  { id: "CU-TPE-03", type: "CU", x: 455, y: 128, status: "normal", cpu: "48%", latency: "19ms", alarms: 0 },
  { id: "DU-TPE-07", type: "DU", x: 455, y: 312, status: "critical", cpu: "81%", latency: "57ms", alarms: 5 },
  { id: "RU-TPE-19", type: "RU", x: 245, y: 386, status: "major", cpu: "62%", latency: "33ms", alarms: 2 },
  { id: "UE-GROUP-A", type: "UE Group", x: 45, y: 386, status: "normal", cpu: "n/a", latency: "61ms", alarms: 0 },
];

const links = [
  ["SMO-01", "RIC-NONRT-01"],
  ["RIC-NONRT-01", "RIC-NEAR-01"],
  ["RIC-NEAR-01", "CU-TPE-03"],
  ["CU-TPE-03", "DU-TPE-07"],
  ["DU-TPE-07", "RU-TPE-19"],
  ["RU-TPE-19", "UE-GROUP-A"],
];

const evidence = [
  { time: "09:33", title: "SLA breach detected", text: "URLLC slice latency exceeded 35 ms budget for 5 consecutive samples." },
  { time: "09:38", title: "Configuration delta found", text: "xAPP-HO-02 updated A3 offset from 2 dB to 3 dB." },
  { time: "09:41", title: "RIC loop degradation", text: "Near-RT RIC policy loop p95 latency increased to 44 ms." },
  { time: "09:42", title: "Transport symptom correlated", text: "DU-TPE-07 packet loss and PRB pressure rose in the same window." },
];

const baseAgentSteps = [
  { tool: "get_alarm_history", status: "done", text: "Fetched 14 alarms in the last 30 minutes for Factory-A slice." },
  { tool: "get_kpi_snapshot", status: "done", text: "Correlated DU packet loss, RIC latency, and handover failure rate." },
  { tool: "query_knowledge_base", status: "done", text: "Matched SOP: handover policy rollback during congestion window." },
  { tool: "create_recovery_plan", status: "running", text: "Preparing reversible dry-run action with approval gate." },
  { tool: "verify_recovery_result", status: "pending", text: "Waiting for simulated dry-run metrics." },
];

const kbItems = [
  {
    title: "SOP-ORAN-17: Near-RT RIC latency escalation",
    source: "Runbook section 4.2",
    text: "When policy loop latency and DU packet loss rise together, inspect xApp configuration changes before transport reroute.",
  },
  {
    title: "Alarm Guide: DU packet loss",
    source: "FM handbook page 31",
    text: "Packet loss above 2% with concurrent PRB pressure commonly maps to transport congestion or aggressive handover policy.",
  },
  {
    title: "Recovery Pattern: reversible policy rollback",
    source: "Self-healing playbook",
    text: "Use dry-run first, require human approval for policy changes, and verify with 10-minute post-action KPI window.",
  },
];

const viewTitles = {
  dashboard: "Network Health Dashboard",
  topology: "O-RAN Topology Monitor",
  alarms: "Fault Management Center",
  diagnosis: "AI Diagnosis Workspace",
  recovery: "Recovery Agent Console",
  knowledge: "RAG Knowledge Base",
};

function renderMetrics() {
  const grid = document.getElementById("metricGrid");
  grid.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <small>${metric.note}</small>
          <div class="status-pill ${metric.tone}">${metric.tone}</div>
        </article>
      `,
    )
    .join("");
}

function renderChart() {
  const chart = document.getElementById("kpiChart");
  const max = Math.max(...kpiSeries);
  chart.innerHTML = kpiSeries
    .map((value, index) => {
      const height = Math.max(18, (value / max) * 100);
      const klass = index > 8 ? "bar latency" : "bar";
      return `<div class="${klass}" style="height:${height}%" title="${value} ms"></div>`;
    })
    .join("");
}

function renderIncidents() {
  const critical = alarms.filter((alarm) => alarm.severity === "critical" || alarm.severity === "major");
  document.getElementById("incidentCount").textContent = `${critical.length} needs review`;
  document.getElementById("incidentList").innerHTML = critical
    .map(
      (alarm) => `
        <article class="incident">
          <span class="status-pill ${alarm.severity}">${alarm.severity}</span>
          <strong>${alarm.title}</strong>
          <span class="meta">${alarm.id} · ${alarm.node} · ${alarm.time}</span>
          <span class="meta">Probable cause: ${alarm.probableCause}</span>
        </article>
      `,
    )
    .join("");
}

function renderTopology() {
  const canvas = document.getElementById("topologyCanvas");
  const nodeById = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const linkMarkup = links
    .map(([fromId, toId]) => {
      const from = nodeById[fromId];
      const to = nodeById[toId];
      const x1 = from.x + 56;
      const y1 = from.y + 38;
      const x2 = to.x + 56;
      const y2 = to.y + 38;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      return `<div class="link" style="left:${x1}px;top:${y1}px;width:${length}px;transform:rotate(${angle}deg)"></div>`;
    })
    .join("");

  const nodeMarkup = nodes
    .map(
      (node) => `
        <button class="node ${node.status !== "normal" ? "problem" : ""}" style="left:${node.x}px;top:${node.y}px" data-node="${node.id}" type="button">
          <strong>${node.id}</strong>
          <small>${node.type}</small>
        </button>
      `,
    )
    .join("");

  canvas.innerHTML = linkMarkup + nodeMarkup;
  canvas.querySelectorAll(".node").forEach((nodeEl) => {
    nodeEl.addEventListener("click", () => {
      appState.selectedNodeId = nodeEl.dataset.node;
      renderNodeDetail();
    });
  });
  renderNodeDetail();
}

function renderNodeDetail() {
  const node = nodes.find((item) => item.id === appState.selectedNodeId);
  document.getElementById("selectedNodeLabel").textContent = node.id;
  document.getElementById("nodeDetail").innerHTML = `
    <div class="node-row"><span>Status</span><strong>${node.status}</strong></div>
    <div class="node-row"><span>Type</span><strong>${node.type}</strong></div>
    <div class="node-row"><span>CPU</span><strong>${node.cpu}</strong></div>
    <div class="node-row"><span>Latency</span><strong>${node.latency}</strong></div>
    <div class="node-row"><span>Active alarms</span><strong>${node.alarms}</strong></div>
  `;
}

function renderAlarms() {
  const filtered = alarms.filter((alarm) => appState.severityFilter === "all" || alarm.severity === appState.severityFilter);
  document.getElementById("alarmTable").innerHTML = `
    <div class="alarm-row header">
      <span>Severity</span><span>Alarm</span><span>Node</span><span>Time</span><span>ID</span>
    </div>
    ${filtered
      .map(
        (alarm) => `
          <div class="alarm-row">
            <span class="status-pill ${alarm.severity}">${alarm.severity}</span>
            <strong>${alarm.title}</strong>
            <span>${alarm.node}</span>
            <span>${alarm.time}</span>
            <span class="meta">${alarm.id}</span>
          </div>
        `,
      )
      .join("")}
  `;
}

function renderDiagnosis() {
  document.getElementById("diagnosisCard").innerHTML = `
    <span class="status-pill critical">High risk</span>
    <h3>Likely root cause: handover policy drift under DU congestion</h3>
    <p>
      AI correlated DU-TPE-07 packet loss, Near-RT RIC loop latency, and a recent xApp handover threshold change.
      The safest recovery path is a reversible policy dry run, followed by KPI verification before production apply.
    </p>
    <div class="confidence">
      <strong>Confidence 82%</strong>
      <div class="confidence-meter"><span></span></div>
    </div>
    <p><strong>Recommended action:</strong> prepare rollback candidate for A3 offset, hold execution behind human approval, and monitor p95 latency for 10 minutes.</p>
  `;

  document.getElementById("timeline").innerHTML = evidence
    .map(
      (item) => `
        <article class="timeline-item">
          <span class="meta">${item.time}</span>
          <strong>${item.title}</strong>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");
}

function renderAgentSteps() {
  const steps = appState.agentRunning
    ? baseAgentSteps.map((step, index) => (index < 4 ? { ...step, status: "done" } : { ...step, status: "running" }))
    : baseAgentSteps;
  document.getElementById("agentStatus").textContent = appState.agentRunning ? "Running dry-run" : "Ready";
  document.getElementById("agentSteps").innerHTML = steps
    .map(
      (step) => `
        <article class="step">
          <span class="status-pill ${step.status}">${step.status}</span>
          <div>
            <strong>${step.tool}</strong>
            <span class="meta">${step.text}</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderKnowledge() {
  document.getElementById("kbResults").innerHTML = kbItems
    .map(
      (item) => `
        <article class="kb-item">
          <strong>${item.title}</strong>
          <span class="meta">${item.source}</span>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");
}

function activateView(viewId) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  document.querySelectorAll(".nav-tabs button").forEach((button) => button.classList.toggle("active", button.dataset.view === viewId));
  document.getElementById("viewTitle").textContent = viewTitles[viewId];
}

function wireInteractions() {
  document.getElementById("navTabs").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-view]");
    if (!button) return;
    activateView(button.dataset.view);
  });

  document.getElementById("severityFilter").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    appState.severityFilter = button.dataset.filter;
    document.querySelectorAll("#severityFilter button").forEach((item) => item.classList.toggle("active", item === button));
    renderAlarms();
  });

  document.getElementById("simulateBtn").addEventListener("click", () => {
    kpiSeries.push(48 + Math.round(Math.random() * 18));
    kpiSeries.shift();
    renderChart();
  });

  document.getElementById("runAgentBtn").addEventListener("click", () => {
    appState.agentRunning = true;
    activateView("recovery");
    renderAgentSteps();
  });

  document.getElementById("kbSearchBtn").addEventListener("click", renderKnowledge);
}

function init() {
  renderMetrics();
  renderChart();
  renderIncidents();
  renderTopology();
  renderAlarms();
  renderDiagnosis();
  renderAgentSteps();
  renderKnowledge();
  wireInteractions();
}

init();
