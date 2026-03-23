import { html } from "../lib.js";
import { usePlayer } from "./PlayerProvider.js";

export function EpisodeCard({ episode }) {
  const ep = episode;
  const player = usePlayer();
  const isPlaying = player.episodeId === ep.id && player.playing;

  return html`
    <a href=${"#/" + ep.id} className="ep-card" style=${{ background: "var(--bg-card)", borderRadius: 12, padding: 24, textDecoration: "none", color: "inherit", display: "block", borderLeft: "4px solid " + (ep.speakerColors[0] || "var(--accent)"), cursor: "pointer" }}>
      <div style=${{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <span style=${{ background: "var(--accent)", color: "#fff", borderRadius: 6, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>#${ep.number}</span>
        ${isPlaying
          ? html`<div className="eq">
              <div className="eq-bar" style=${{ animation: "eq1 0.6s ease-in-out infinite" }} />
              <div className="eq-bar" style=${{ animation: "eq2 0.5s ease-in-out infinite" }} />
              <div className="eq-bar" style=${{ animation: "eq3 0.7s ease-in-out infinite" }} />
            </div>`
          : html`<span style=${{ fontSize: 12, color: "var(--text-tertiary)" }}>${ep.date}</span>`
        }
      </div>
      <h3 style=${{ fontSize: 16, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>${ep.title}</h3>
      ${ep.description && html`<p style=${{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 12 }}>${ep.description}</p>`}
      <div style=${{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        ${ep.speakerNames.map((name, i) => html`
          <span key=${i} style=${{ background: ep.speakerColors[i] || "var(--text-muted)", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, color: "#fff" }}>${name}</span>
        `)}
      </div>
      <div style=${{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-tertiary)", borderTop: "1px solid var(--border)", paddingTop: 12 }}>
        <span>⏱ ${ep.duration}</span>
        <span>💬 ${ep.totalWords.toLocaleString()} слов</span>
        <span>📚 ${ep.totalResources} ресурсов</span>
      </div>
      ${ep.tags && html`
        <div style=${{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          ${ep.tags.map((tag, i) => html`
            <span key=${i} style=${{ background: "var(--bg-elevated)", borderRadius: 12, padding: "2px 10px", fontSize: 11, color: "var(--text-secondary)" }}>${tag}</span>
          `)}
        </div>
      `}
    </a>`;
}
