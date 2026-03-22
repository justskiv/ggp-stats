import { html, Fragment } from "../../lib.js";
import { Card } from "../shared.js";

export function FunFactsTab({ data }) {
  const { funFacts, persons, quickStats } = data;

  return html`
    <${Fragment}>
      ${funFacts.map((f, i) => html`
        <div key=${i} style=${{ background: "var(--bg-card)", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, fontSize: 14, lineHeight: 1.5, marginBottom: 10 }}>
          <span style=${{ fontSize: 32, flexShrink: 0 }}>${f.i}</span>
          <span style=${{ color: "var(--text-light)" }}>${f.t}</span>
        </div>
      `)}

      <${Card} style=${{ marginTop: 16, marginBottom: 20 }}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Упомянутые персоны (${persons.length})</h3>
        <div style=${{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          ${persons.map((p, i) => html`
            <span key=${i} style=${{ background: "var(--bg-elevated)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "var(--text-light)" }}>${p}</span>
          `)}
        </div>
      <//>

      <${Card}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>В цифрах</h3>
        <div className="grid-4" style=${{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          ${quickStats.map(([val, label, sub], i) => html`
            <div key=${i} style=${{ background: "var(--bg-base)", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
              <div style=${{ fontSize: 24, fontWeight: 800, color: "var(--accent-light)" }}>${val}</div>
              <div style=${{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>${label}</div>
              <div style=${{ fontSize: 10, color: "var(--text-tertiary)" }}>${sub}</div>
            </div>
          `)}
        </div>
      <//>
    <//>`;
}
