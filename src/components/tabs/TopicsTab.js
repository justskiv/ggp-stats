import {
  html, Fragment,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "../../lib.js";
import { Tip, Card } from "../shared.js";

export function TopicsTab({ data }) {
  const { topics, meta } = data;
  const topByDuration = topics.slice().sort((a, b) => b.d - a.d).slice(0, 8)
    .map(t => ({ ...t, topic: t.t, duration: t.d }));

  return html`
    <${Fragment}>
      <${Card} style=${{ marginBottom: 20 }}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Таймлайн тем подкаста</h3>
        ${topics.map((tp, i) => html`
          <div key=${i} style=${{ display: "flex", alignItems: "center", marginBottom: 6, gap: 8 }}>
            <div style=${{ width: 50, textAlign: "right", fontSize: 11, color: "var(--text-tertiary)", flexShrink: 0 }}>
              ${Math.floor(tp.s / 60)}:${String(tp.s % 60).padStart(2, "0")}
            </div>
            <div style=${{ flex: 1, position: "relative", height: 28 }}>
              <div style=${{ position: "absolute", left: (tp.s / meta.durationMinutes) * 100 + "%", width: (tp.d / meta.durationMinutes) * 100 + "%", height: "100%", background: tp.c, borderRadius: 6, display: "flex", alignItems: "center", paddingLeft: 8, fontSize: 11, fontWeight: 500, color: "#fff", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}
                title=${tp.t + " (" + tp.d + " мин)"}>
                ${tp.t}
              </div>
            </div>
            <div style=${{ width: 40, fontSize: 11, color: "var(--text-tertiary)", flexShrink: 0 }}>${tp.d} м</div>
          </div>
        `)}
      <//>

      <${Card}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Топ тем по длительности</h3>
        <${ResponsiveContainer} width="100%" height=${340}>
          <${BarChart} data=${topByDuration} layout="vertical" margin=${{ left: 10, right: 20 }}>
            <${CartesianGrid} strokeDasharray="3 3" stroke="var(--border)" horizontal=${false} />
            <${XAxis} type="number" tick=${{ fill: "var(--text-secondary)", fontSize: 11 }} unit=" мин" />
            <${YAxis} type="category" dataKey="topic" width=${220} tick=${{ fill: "var(--text-secondary)", fontSize: 11 }} />
            <${Tooltip} content=${Tip} />
            <${Bar} dataKey="duration" name="Длительность" fill="var(--accent)" radius=${[0, 6, 6, 0]} />
          <//>
        <//>
      <//>
    <//>`;
}
