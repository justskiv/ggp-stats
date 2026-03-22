import {
  html, Fragment,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Tooltip, Legend, ResponsiveContainer,
} from "../../lib.js";
import { Tip, Card } from "../shared.js";

export function SpeakersTab({ data }) {
  const { speakers, radarData, keyInsight, colors } = data;
  const speakerKeys = Object.keys(colors);
  const speakerColors = speakers.map(s => s.color);
  const totalUtt = speakers.reduce((s, x) => s + x.utt, 0);

  return html`
    <${Fragment}>
      <${Card} style=${{ marginBottom: 20 }}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Радар активности (нормализованный)</h3>
        <${ResponsiveContainer} width="100%" height=${320}>
          <${RadarChart} data=${radarData}>
            <${PolarGrid} stroke="var(--border)" />
            <${PolarAngleAxis} dataKey="m" tick=${{ fill: "var(--text-secondary)", fontSize: 12 }} />
            <${PolarRadiusAxis} angle=${90} domain=${[0, 100]} tick=${{ fill: "var(--text-muted)", fontSize: 10 }} />
            ${speakers.map((s, i) => html`
              <${Radar} key=${s.name} name=${s.name} dataKey=${speakerKeys[i]} stroke=${speakerColors[i]} fill=${speakerColors[i]} fillOpacity=${0.15} strokeWidth=${2} />
            `)}
            <${Legend} wrapperStyle=${{ fontSize: 12, color: "var(--text-secondary)" }} />
            <${Tooltip} content=${Tip} />
          <//>
        <//>
      <//>

      <div className="grid-3" style=${{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        ${speakers.map(s => html`
          <div key=${s.name} style=${{ background: "var(--bg-card)", borderRadius: 12, padding: 20, borderTop: "3px solid " + s.color }}>
            <div style=${{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style=${{ width: 48, height: 48, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>${s.name[0]}</div>
              <div>
                <div style=${{ fontWeight: 700, fontSize: 16 }}>${s.full}</div>
                <div style=${{ fontSize: 11, color: "var(--text-tertiary)" }}>${s.role}</div>
              </div>
            </div>
            ${[
              ["Слов", s.words.toLocaleString(), s.pct + "%"],
              ["Реплик", s.utt, ((s.utt / totalUtt) * 100).toFixed(1) + "%"],
              ["Время", s.time + " мин", s.timePct + "%"],
              ["Ср. длина", s.avgW + " слов"],
              ["Макс. реплика", s.maxW + " слов"],
            ].map(([label, val, extra], i) => html`
              <div key=${i} style=${{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none", fontSize: 13 }}>
                <span style=${{ color: "var(--text-secondary)" }}>${label}</span>
                <span style=${{ fontWeight: 600 }}>
                  ${val}${extra ? html`<span style=${{ color: s.color, fontSize: 11, marginLeft: 4 }}>${extra}</span>` : null}
                </span>
              </div>
            `)}
          </div>
        `)}
      </div>

      <${Card} style=${{ marginTop: 20, borderLeft: "4px solid " + keyInsight.color }}>
        <h4 style=${{ margin: "0 0 8px", fontSize: 14, color: keyInsight.color }}>📊 Ключевой инсайт</h4>
        <p style=${{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
          ${keyInsight.parts.map(([bold, text], i) =>
            bold
              ? html`<strong key=${i} style=${{ color: "var(--text-bright)" }}>${text}</strong>`
              : text
          )}
        </p>
      <//>
    <//>`;
}
