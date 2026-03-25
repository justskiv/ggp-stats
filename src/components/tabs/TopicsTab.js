import {
  html, Fragment, useCallback,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "../../lib.js";
import { Tip, Card } from "../shared.js";
import { usePlayer } from "../PlayerProvider.js";

const SkipIcon = html`<svg width=${14} height=${14} viewBox="0 0 24 24" fill="currentColor"><polygon points="4,4 16,12 4,20" /><rect x=${18} y=${4} width=${3} height=${16} rx=${1} /></svg>`;

function fmtTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(Math.floor(sec % 60)).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function TopicsTab({ data }) {
  const { topics, meta } = data;
  const { seek, audio, episodeId, play } = usePlayer();
  const topByDuration = topics.slice().sort((a, b) => b.d - a.d).slice(0, 8)
    .map(t => ({ ...t, topic: t.t, duration: t.d }));

  const onTopicClick = useCallback((topic) => {
    if (!episodeId || episodeId !== meta.id) {
      play(data);
      if (audio.readyState >= 1) {
        seek(topic.s);
      } else {
        audio.addEventListener(
          "loadedmetadata", () => seek(topic.s), { once: true },
        );
      }
    } else {
      seek(topic.s);
      if (audio && audio.paused) audio.play();
    }
  }, [seek, audio, episodeId, meta.id, play, data]);

  return html`
    <${Fragment}>
      <${Card} style=${{ marginBottom: 20 }}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Темы выпуска</h3>
        <div className="tl-list">
          ${topics.map((tp, i) => html`
            <div key=${i} className="tl-row" onClick=${() => onTopicClick(tp)}>
              <span className="tl-icon">${SkipIcon}</span>
              <span className="tl-time">${fmtTime(tp.s)}</span>
              <span className="tl-name">${tp.t}</span>
            </div>
          `)}
        </div>
      <//>

      <${Card}>
        <h3 style=${{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Топ тем по длительности</h3>
        <${ResponsiveContainer} width="100%" height=${340}>
          <${BarChart} data=${topByDuration} layout="vertical" margin=${{ left: 10, right: 20 }}>
            <${CartesianGrid} strokeDasharray="3 3" stroke="var(--border)" horizontal=${false} />
            <${XAxis} type="number" tick=${{ fill: "var(--text-secondary)", fontSize: 11 }} unit=" мин" />
            <${YAxis} type="category" dataKey="topic" width=${220} tick=${{ fill: "var(--text-secondary)", fontSize: 11 }} />
            <${Tooltip} content=${Tip} cursor=${{ fill: "rgba(255,255,255,0.06)" }} />
            <${Bar} dataKey="duration" name="Длительность" fill="var(--accent)" radius=${[0, 6, 6, 0]} />
          <//>
        <//>
      <//>
    <//>`;
}
