import { html, useState, useEffect } from "../lib.js";
import { DASH_TABS } from "../constants.js";
import { OverviewTab } from "./tabs/OverviewTab.js";
import { SpeakersTab } from "./tabs/SpeakersTab.js";
import { TopicsTab } from "./tabs/TopicsTab.js";
import { ResourcesTab } from "./tabs/ResourcesTab.js";
import { FunFactsTab } from "./tabs/FunFactsTab.js";

const TAB_COMPONENTS = {
  overview: OverviewTab,
  speakers: SpeakersTab,
  topics: TopicsTab,
  resources: ResourcesTab,
  fun: FunFactsTab,
};

export function Dashboard({ data, routeTab }) {
  const validTabs = DASH_TABS.map(t => t.id);
  const tab = routeTab && validTabs.includes(routeTab) ? routeTab : "overview";
  const setTab = (t) => { window.location.hash = "#/" + data.meta.id + (t === "overview" ? "" : "/" + t); };
  const [metric, setMetric] = useState("words");

  useEffect(() => { document.title = data.meta.title + " — Dashboard"; }, [data]);

  const TabComponent = TAB_COMPONENTS[tab];
  const tabProps = tab === "overview" ? { data, metric, setMetric } : { data };

  return html`
    <div style=${{ minHeight: "100vh" }}>
      <div style=${{ background: "var(--gradient-header)", padding: "32px 24px 24px", borderBottom: "1px solid var(--border)" }}>
        <div style=${{ maxWidth: 1100, margin: "0 auto" }}>
          <a href="#/" style=${{ color: "var(--accent-light)", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>← Все выпуски</a>
          <div style=${{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style=${{ fontSize: 32 }}>🎙️</span>
            <div>
              <h1 style=${{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>${data.meta.title}</h1>
              <p style=${{ fontSize: 14, color: "var(--accent-light)", marginTop: 4 }}>${data.meta.subtitle}</p>
            </div>
          </div>
          <div className="stats-row" style=${{ display: "flex", gap: 16, marginTop: 20, flexWrap: "wrap" }}>
            ${data.headerStats.map(([icon, val, label]) => html`
              <div key=${label} style=${{ background: "var(--bg-card)", borderRadius: 12, padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, minWidth: 150 }}>
                <span style=${{ fontSize: 26 }}>${icon}</span>
                <div>
                  <div style=${{ fontSize: 22, fontWeight: 700 }}>${val}</div>
                  <div style=${{ fontSize: 12, color: "var(--text-secondary)" }}>${label}</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>

      <div style=${{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style=${{ display: "flex", gap: 4, padding: "16px 0 0", borderBottom: "1px solid var(--bg-card)", overflowX: "auto" }}>
          ${DASH_TABS.map(t => html`
            <button key=${t.id} onClick=${() => setTab(t.id)}
              style=${{ padding: "10px 20px", borderRadius: "8px 8px 0 0", border: "none", cursor: "pointer", fontSize: 14, fontWeight: tab === t.id ? 700 : 500, whiteSpace: "nowrap", background: tab === t.id ? "var(--bg-card)" : "transparent", color: tab === t.id ? "var(--text-bright)" : "var(--text-tertiary)", borderBottom: tab === t.id ? "2px solid var(--accent)" : "2px solid transparent" }}>
              ${t.label}
            </button>
          `)}
        </div>

        <div style=${{ padding: "24px 0 48px" }}>
          ${TabComponent && html`<${TabComponent} ...${tabProps} />`}
        </div>
      </div>

      <div style=${{ textAlign: "center", padding: "20px 24px 32px", color: "var(--text-muted)", fontSize: 12 }}>
        ${data.meta.title} Dashboard
      </div>
    </div>`;
}
