import {
  html, Fragment,
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "../../lib.js";
import { Tip, PieLabel, Card } from "../shared.js";

const METRIC_LABELS = { words: "По словам", time: "По времени", utt: "По репликам" };

export function OverviewTab({ data, metric, setMetric }) {
  const { speakers, barData, colors } = data;
  const speakerKeys = Object.keys(colors);
  const speakerColors = speakers.map(s => s.color);

  const pieChartData = {
    words: speakers.map(s => ({ name: s.name, value: s.words })),
    time: speakers.map(s => ({ name: s.name, value: s.time })),
    utt: speakers.map(s => ({ name: s.name, value: s.utt })),
  };

  return html`
    <${Fragment}>
      ${speakers.map(s => html`
        <div key=${s.name} style=${{ display: "flex", alignItems: "center", gap: 12, background: "var(--bg-card)", borderRadius: 12, padding: "14px 18px", marginBottom: 10, borderLeft: "4px solid " + s.color }}>
          <div style=${{ width: 44, height: 44, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0 }}>${s.name[0]}</div>
          <div style=${{ flex: 1 }}>
            <div style=${{ fontWeight: 600, fontSize: 15 }}>${s.full}</div>
            <div style=${{ fontSize: 12, color: "var(--text-secondary)" }}>${s.words} слов · ${s.utt} реплик · ${s.time} мин</div>
          </div>
          <div style=${{ textAlign: "right" }}>
            <div style=${{ fontSize: 22, fontWeight: 700, color: s.color }}>${s.pct}%</div>
            <div style=${{ fontSize: 10, color: "var(--text-tertiary)" }}>по словам</div>
          </div>
        </div>
      `)}

      <div className="grid-2" style=${{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
        <${Card}>
          <div style=${{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <h3 style=${{ fontSize: 15, fontWeight: 700 }}>Распределение эфира</h3>
            <div style=${{ display: "flex", gap: 4 }}>
              ${Object.entries(METRIC_LABELS).map(([k, v]) => html`
                <button key=${k} onClick=${() => setMetric(k)}
                  style=${{ padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11, cursor: "pointer", background: metric === k ? "var(--accent)" : "var(--bg-elevated)", color: metric === k ? "#fff" : "var(--text-secondary)" }}>
                  ${v}
                </button>
              `)}
            </div>
          </div>
          <${ResponsiveContainer} width="100%" height=${230}>
            <${PieChart}>
              <${Pie} data=${pieChartData[metric]} cx="50%" cy="50%" innerRadius=${55} outerRadius=${95} dataKey="value" labelLine=${false} label=${PieLabel} strokeWidth=${2} stroke="var(--bg-base)">
                ${pieChartData[metric].map((_, i) => html`<${Cell} key=${i} fill=${speakerColors[i]} />`)}
              <//>
              <${Tooltip} content=${Tip} />
            <//>
          <//>
          <div style=${{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
            ${speakers.map(s => html`
              <div key=${s.name} style=${{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                <div style=${{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                <span style=${{ color: "var(--text-secondary)" }}>${s.name}</span>
              </div>
            `)}
          </div>
        <//>

        <${Card}>
          <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Сравнение метрик</h3>
          <${ResponsiveContainer} width="100%" height=${270}>
            <${BarChart} data=${barData} margin=${{ left: -10 }}>
              <${CartesianGrid} strokeDasharray="3 3" stroke="var(--border)" />
              <${XAxis} dataKey="m" tick=${{ fill: "var(--text-secondary)", fontSize: 11 }} />
              <${YAxis} tick=${{ fill: "var(--text-secondary)", fontSize: 11 }} />
              <${Tooltip} content=${Tip} cursor=${{ fill: "rgba(255,255,255,0.06)" }} />
              ${speakers.map((s, i) => html`
                <${Bar} key=${s.name} dataKey=${speakerKeys[i]} name=${s.name} fill=${speakerColors[i]} radius=${[4,4,0,0]} />
              `)}
            <//>
          <//>
        <//>
      </div>
    <//>`;
}
