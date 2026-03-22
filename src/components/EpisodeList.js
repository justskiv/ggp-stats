import { html, useEffect } from "../lib.js";
import { pluralize } from "../utils.js";
import { EpisodeCard } from "./EpisodeCard.js";

export function EpisodeList() {
  const episodes = (window.GGP_EPISODES._registry || []).slice().sort((a, b) => b.number - a.number);
  useEffect(() => { document.title = "GoGetPodcast — Dashboard"; }, []);

  return html`
    <div style=${{ minHeight: "100vh" }}>
      <div style=${{ background: "var(--gradient-header)", padding: "40px 24px 32px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <span style=${{ fontSize: 48 }}>🎙️</span>
        <div style=${{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <h1 style=${{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>GoGetPodcast</h1>
          <a href="https://feeds.feedburner.com/gogetpodcast" target="_blank" rel="noopener noreferrer" title="RSS"
            style=${{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: 5, background: "rgba(164,171,191,0.12)", color: "var(--text-tertiary)", textDecoration: "none", position: "relative", top: 3 }}>
            <svg width=${12} height=${12} viewBox="0 0 24 24" fill="currentColor">
              <circle cx=${6.18} cy=${17.82} r=${2.18} />
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
            </svg>
          </a>
        </div>
        <p style=${{ fontSize: 16, color: "var(--accent-light)", marginTop: 8 }}>Интерактивная статистика по выпускам подкаста</p>
        <div style=${{ display: "flex", justifyContent: "center", gap: 48, marginTop: 24 }}>
          <div style=${{ textAlign: "center" }}>
            <div style=${{ fontSize: 36, fontWeight: 800 }}>${episodes.length}</div>
            <div style=${{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>${pluralize(episodes.length, "выпуск", "выпуска", "выпусков")}</div>
          </div>
          <div style=${{ textAlign: "center" }}>
            <div style=${{ fontSize: 36, fontWeight: 800 }}>${episodes.reduce((s, e) => s + e.totalWords, 0).toLocaleString()}</div>
            <div style=${{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>слов проанализировано</div>
          </div>
        </div>
      </div>
      <div style=${{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 0" }}>
        <h2 style=${{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Выпуски</h2>
      </div>
      <div className="ep-grid" style=${{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        ${episodes.map(ep => html`<${EpisodeCard} key=${ep.id} episode=${ep} />`)}
      </div>
      <div style=${{ textAlign: "center", padding: "20px 24px 32px", color: "var(--text-muted)", fontSize: 12 }}>GoGetPodcast Analytics</div>
    </div>`;
}
