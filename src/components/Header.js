import { html } from "../lib.js";
import { usePlayer } from "./PlayerProvider.js";
import { HeaderPlayer } from "./HeaderPlayer.js";

const RSS_URL = "https://feeds.feedburner.com/gogetpodcast";

export function Header() {
  const player = usePlayer();
  const hasPlayer = player.episodeId !== null;

  return html`
    <header className="gh">
      <a className="gh-logo" href="#/">
        <span className="gh-logo-icon">🎙️</span>
        <span className="gh-logo-text">${hasPlayer ? "GGP" : "GoGetPodcast"}</span>
      </a>

      ${hasPlayer && html`<div className="gh-divider" />`}

      ${hasPlayer
        ? html`<${HeaderPlayer} />`
        : html`<div style=${{ flex: 1 }} />`}

      ${hasPlayer && html`<div className="gh-divider" />`}

      <nav className="gh-nav">
        <a href="#">О нас</a>
      </nav>

      <a className="gh-rss" href=${RSS_URL} target="_blank"
         rel="noopener noreferrer" title="RSS">
        <svg width=${14} height=${14} viewBox="0 0 24 24" fill="currentColor">
          <circle cx=${6.18} cy=${17.82} r=${2.18} />
          <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
        </svg>
      </a>
    </header>`;
}
