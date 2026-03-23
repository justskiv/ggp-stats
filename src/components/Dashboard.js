import { html, useState, useEffect } from "../lib.js";
import { DASH_TABS } from "../constants.js";
import { formatDate } from "../utils.js";
import { usePlayer } from "./PlayerProvider.js";
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

const STAT_ICONS = [
  { color: "#6366f1", svg: html`<svg width=${22} height=${22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${2} strokeLinecap="round"><circle cx=${12} cy=${12} r=${10} /><polyline points="12 6 12 12 16 14" /></svg>` },
  { color: "#10b981", svg: html`<svg width=${22} height=${22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${2} strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>` },
  { color: "#f59e0b", svg: html`<svg width=${22} height=${22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${2} strokeLinecap="round"><path d="M17 6.1H3" /><path d="M21 12.1H3" /><path d="M15.1 18H3" /></svg>` },
  { color: "#ec4899", svg: html`<svg width=${22} height=${22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${2} strokeLinecap="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>` },
];

export function Dashboard({ data, routeTab }) {
  const validTabs = DASH_TABS.map(t => t.id);
  const tab = routeTab && validTabs.includes(routeTab) ? routeTab : "overview";
  const setTab = (t) => { window.location.hash = "#/" + data.meta.id + (t === "overview" ? "" : "/" + t); };
  const [metric, setMetric] = useState("words");
  const player = usePlayer();

  const isThisEpisode = player.episodeId === data.meta.id;
  const isThisPlaying = isThisEpisode && player.playing;

  const onPlayClick = () => {
    if (isThisEpisode) { player.togglePlay(); }
    else { player.play(data); }
  };

  const ctaLabel = isThisPlaying ? "Пауза"
    : isThisEpisode ? "Продолжить"
    : "Слушать выпуск";

  const ctaIcon = isThisPlaying
    ? html`<svg viewBox="0 0 24 24"><rect x=${6} y=${4} width=${4} height=${16} rx=${1} /><rect x=${14} y=${4} width=${4} height=${16} rx=${1} /></svg>`
    : html`<svg viewBox="0 0 24 24"><polygon points="8,4 20,12 8,20" /></svg>`;

  useEffect(() => { document.title = data.meta.title; }, [data]);

  const TabComponent = TAB_COMPONENTS[tab];
  const tabProps = tab === "overview" ? { data, metric, setMetric } : { data };

  return html`
    <div style=${{ minHeight: "100vh" }}>
      <div className="ep-hero-wrap">
      <div className="ep-hero">
        <div className="ep-meta">
          <div className="ep-badge">Выпуск #${data.meta.number}</div>
          <div className="ep-date">${formatDate(data.meta.date)}</div>
        </div>

        <h1 className="ep-title">${data.meta.subtitle}</h1>
        ${data.meta.description && html`
          <p className="ep-desc">${data.meta.description}</p>
        `}

        <div className="ep-actions">
          <button className="btn-play-main"
                  disabled=${!data.meta.audioUrl}
                  onClick=${onPlayClick}>
            ${ctaIcon} ${ctaLabel}
          </button>
        </div>

        <div className="ep-stats">
          ${STAT_ICONS.map(({ svg, color }, i) => {
            if (!data.headerStats[i]) return null;
            const [, val, label] = data.headerStats[i];
            return html`
              <div key=${label} className="ep-stat-card" style=${{ "--st-color": color }}>
                <div className="ep-stat-icon">${svg}</div>
                <div className="ep-stat-val">${val}</div>
                <div className="ep-stat-lbl">${label}</div>
              </div>`;
          })}
        </div>
      </div>
      </div>

      <div className="ep-tabs-wrapper">
        <div className="ep-tabs">
          ${DASH_TABS.map(t => html`
            <div key=${t.id}
                 className=${`ep-tab${tab === t.id ? " active" : ""}`}
                 onClick=${() => setTab(t.id)}>
              ${t.label}
            </div>
          `)}
        </div>
      </div>

      <div style=${{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 48px" }}>
        ${TabComponent && html`<${TabComponent} ...${tabProps} />`}
      </div>
    </div>`;
}
