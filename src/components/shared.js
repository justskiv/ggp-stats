import { html } from "../lib.js";

export const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return html`
    <div style=${{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", color: "var(--text-primary)", fontSize: 13 }}>
      <p style=${{ fontWeight: 600, marginBottom: 4 }}>${label}</p>
      ${payload.map((p, i) => html`
        <p key=${i} style=${{ color: p.color || p.fill, margin: "2px 0" }}>${p.name}: ${p.value}</p>
      `)}
    </div>`;
};

export const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.1) return null;
  const R = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  return html`
    <text x=${cx + r * Math.cos(-midAngle * R)} y=${cy + r * Math.sin(-midAngle * R)}
      fill="white" textAnchor="middle" dominantBaseline="central" fontSize=${13} fontWeight=${600}>
      ${(percent * 100).toFixed(1)}%
    </text>`;
};

export const Card = ({ children, style }) => html`
  <div style=${{ background: "var(--bg-card)", borderRadius: 12, padding: 20, ...style }}>
    ${children}
  </div>`;

export function LoadingScreen() {
  return html`
    <div style=${{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <div style=${{ width: 48, height: 48, border: "4px solid var(--border)", borderTop: "4px solid var(--accent)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <p style=${{ color: "var(--text-secondary)", fontSize: 14 }}>Загрузка данных выпуска...</p>
    </div>`;
}

export function ErrorScreen({ id }) {
  return html`
    <div style=${{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24 }}>
      <span style=${{ fontSize: 48 }}>😕</span>
      <h2 style=${{ fontSize: 20, fontWeight: 700 }}>Выпуск не найден</h2>
      <p style=${{ color: "var(--text-secondary)", fontSize: 14 }}>Не удалось загрузить данные для "${id}"</p>
      <a href="#/" style=${{ background: "var(--accent)", color: "#fff", padding: "10px 24px", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600, marginTop: 8 }}>← Вернуться к списку</a>
    </div>`;
}
