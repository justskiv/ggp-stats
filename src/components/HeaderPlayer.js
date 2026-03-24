import { html, useRef, useEffect, useCallback, useState } from "../lib.js";
import { usePlayer } from "./PlayerProvider.js";
import { ChapterPanel } from "./ChapterPanel.js";
import { formatTime } from "../utils.js";

const PlayIcon = html`<svg width=${14} height=${14} viewBox="0 0 24 24" fill="white"><polygon points="8,4 20,12 8,20" /></svg>`;
const PauseIcon = html`<svg width=${14} height=${14} viewBox="0 0 24 24" fill="white"><rect x=${5} y=${4} width=${4} height=${16} rx=${1} /><rect x=${15} y=${4} width=${4} height=${16} rx=${1} /></svg>`;

const SkipBackIcon = html`<svg width=${22} height=${22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${1.8} strokeLinecap="round" strokeLinejoin="round">
  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
  <path d="M3 3v5h5" />
  <text x=${12} y=${15.5} textAnchor="middle" stroke="none" fill="currentColor" fontSize=${8} fontWeight=${700} fontFamily="-apple-system,sans-serif">15</text>
</svg>`;

const SkipFwdIcon = html`<svg width=${22} height=${22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${1.8} strokeLinecap="round" strokeLinejoin="round">
  <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
  <path d="M21 3v5h-5" />
  <text x=${12} y=${15.5} textAnchor="middle" stroke="none" fill="currentColor" fontSize=${7.5} fontWeight=${700} fontFamily="-apple-system,sans-serif">30</text>
</svg>`;

const ChaptersIcon = html`<svg width=${18} height=${18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${2} strokeLinecap="round">
  <circle cx=${5} cy=${6} r=${1.5} fill="currentColor" stroke="none" />
  <circle cx=${5} cy=${12} r=${1.5} fill="currentColor" stroke="none" />
  <circle cx=${5} cy=${18} r=${1.5} fill="currentColor" stroke="none" />
  <line x1=${10} y1=${6} x2=${20} y2=${6} />
  <line x1=${10} y1=${12} x2=${20} y2=${12} />
  <line x1=${10} y1=${18} x2=${20} y2=${18} />
</svg>`;

const CloseIcon = html`<svg width=${18} height=${18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${2} strokeLinecap="round">
  <line x1=${18} y1=${6} x2=${6} y2=${18} />
  <line x1=${6} y1=${6} x2=${18} y2=${18} />
</svg>`;

export function HeaderPlayer() {
  const {
    playing, duration, playbackRate, currentChapter,
    episodeMeta, topics, audio, currentTimeRef,
    togglePlay, seek, setSpeed, close,
  } = usePlayer();

  const [chaptersOpen, setChaptersOpen] = useState(false);
  const popoverWrapRef = useRef(null);

  const fillRef = useRef(null);
  const thumbRef = useRef(null);
  const timeRef = useRef(null);
  const trackRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!audio) return;
    const onTimeUpdate = () => {
      const t = audio.currentTime;
      const dur = audio.duration || 0;
      const pct = dur > 0 ? (t / dur) * 100 : 0;
      if (fillRef.current) fillRef.current.style.width = pct + "%";
      if (thumbRef.current) thumbRef.current.style.left = pct + "%";
      if (timeRef.current) timeRef.current.textContent = formatTime(t);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    onTimeUpdate();
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [audio]);

  const onTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(pct * (duration || 0));
  };

  const onTrackMove = useCallback((e) => {
    if (!trackRef.current || !tooltipRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const sec = pct * duration;
    const topic = topics.findLast(tp => tp.s <= sec);
    const timeEl = tooltipRef.current.querySelector(".hp-tooltip-time");
    const topicEl = tooltipRef.current.querySelector(".hp-tooltip-topic");
    if (timeEl) timeEl.textContent = formatTime(sec);
    if (topicEl) topicEl.textContent = topic ? topic.t : "";
    tooltipRef.current.style.left = (pct * 100) + "%";
    tooltipRef.current.style.opacity = "1";
  }, [duration, topics]);

  const onTrackLeave = useCallback(() => {
    if (tooltipRef.current) tooltipRef.current.style.opacity = "0";
  }, []);

  const skipBack = () => seek(currentTimeRef.current - 15);
  const skipFwd = () => seek(currentTimeRef.current + 30);

  return html`
    <div className="hp">
      <div className="hp-play" onClick=${togglePlay}>
        ${playing ? PauseIcon : PlayIcon}
      </div>

      <div className="hp-skip" onClick=${skipBack} title="Назад 15 сек">
        ${SkipBackIcon}
      </div>

      <div className="hp-skip" onClick=${skipFwd} title="Вперёд 30 сек">
        ${SkipFwdIcon}
      </div>

      <div className="hp-center">
        ${currentChapter && html`
          <div className="hp-chapter">
            <span className="hp-chapter-pin">📍</span>
            <span className="hp-chapter-num">#${episodeMeta?.number}</span>
            <span className="hp-chapter-sep">·</span>
            ${currentChapter.t}
          </div>
        `}

        <div className="hp-track-wrap" ref=${trackRef}
             onClick=${onTrackClick}
             onMouseMove=${onTrackMove}
             onMouseLeave=${onTrackLeave}>
          <div className="hp-track">
            <div className="hp-fill" ref=${fillRef} />
            ${duration > 0 && topics.map((topic, i) => {
              const pct = (topic.s / duration) * 100;
              if (pct <= 0) return null;
              return html`<div key=${i} className="hp-marker" style=${{ left: pct + "%" }} />`;
            })}
            <div className="hp-thumb" ref=${thumbRef} />
          </div>
          <div className="hp-tooltip" ref=${tooltipRef}>
            <span className="hp-tooltip-time">0:00</span>
            <span className="hp-tooltip-topic" />
          </div>
        </div>
      </div>

      <div className="hp-time" ref=${timeRef}>0:00</div>

      <div className="hp-speed-wrap">
        <div className="hp-speed">${playbackRate}x</div>
        <div className="hp-speed-menu">
          ${[1, 1.25, 1.5, 1.75, 2].map(r => html`
            <div key=${r}
                 className=${`hp-speed-opt${r === playbackRate ? " active" : ""}`}
                 onClick=${() => setSpeed(r)}>
              ${r}x
            </div>
          `)}
        </div>
      </div>

      <div className="hp-popover-wrap" ref=${popoverWrapRef}>
        <div className=${`hp-chapters-btn${chaptersOpen ? " active" : ""}`}
             onClick=${() => setChaptersOpen(p => !p)}
             title="Список тем">
          ${ChaptersIcon}
        </div>
        ${chaptersOpen && html`
          <${ChapterPanel} onClose=${() => setChaptersOpen(false)} wrapRef=${popoverWrapRef} />
        `}
      </div>

      <div className="hp-close" onClick=${close} title="Закрыть плеер">
        ${CloseIcon}
      </div>
    </div>`;
}
