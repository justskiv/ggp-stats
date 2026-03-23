import { html, useEffect } from "../lib.js";
import { pluralize } from "../utils.js";
import { EpisodeCard } from "./EpisodeCard.js";

export function EpisodeList() {
  const episodes = (window.GGP_EPISODES._registry || []).slice().sort((a, b) => b.number - a.number);
  useEffect(() => { document.title = "GoGetPodcast"; }, []);

  return html`
    <div style=${{ minHeight: "100vh" }}>
      <div style=${{ background: "var(--gradient-header)", padding: "40px 24px 32px", borderBottom: "1px solid var(--border)", textAlign: "center" }}>
        <p style=${{ fontSize: 16, color: "var(--accent-light)", marginTop: 4 }}>Аналитика выпусков в цифрах и графиках</p>
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
      <div className="ep-grid" style=${{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 48px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
        ${episodes.map(ep => html`<${EpisodeCard} key=${ep.id} episode=${ep} />`)}
      </div>
    </div>`;
}
