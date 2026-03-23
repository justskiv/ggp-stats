import {
  html, useRef, useEffect, useMemo, useState, useCallback,
} from "../lib.js";
import { usePlayer } from "./PlayerProvider.js";
import { formatTime } from "../utils.js";

const COOLDOWN = 5000;

const PlaySvg = html`<svg width=${10} height=${10} viewBox="0 0 24 24" fill="currentColor"><polygon points="8,4 20,12 8,20" /></svg>`;

export function ChapterPanel({ onClose, wrapRef }) {
  const {
    topics, currentChapter, episodeMeta,
    duration, seek, playing, audio,
  } = usePlayer();

  const panelRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef(new Map());
  const lastManualScroll = useRef(0);
  const autoScrolling = useRef(false);

  const [showJump, setShowJump] = useState(false);

  const currentIndex = useMemo(
    () => topics.findIndex(tp => tp.t === currentChapter?.t && tp.s === currentChapter?.s),
    [topics, currentChapter]
  );

  // Click-outside (exclude popover-wrap) and Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    const onClick = (e) => {
      const wrap = wrapRef?.current;
      if (wrap && !wrap.contains(e.target)) onClose();
    };
    window.addEventListener("keydown", onKey);
    const timer = setTimeout(() =>
      document.addEventListener("pointerdown", onClick, true), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick, true);
      clearTimeout(timer);
    };
  }, [onClose, wrapRef]);

  // Scroll helpers
  const scrollToCurrent = useCallback((behavior = "smooth") => {
    const el = itemRefs.current.get(currentIndex);
    if (!el) return;
    autoScrolling.current = true;
    el.scrollIntoView({ block: "nearest", behavior });
    setTimeout(() => { autoScrolling.current = false; }, 300);
  }, [currentIndex]);

  const onListScroll = useCallback(() => {
    if (autoScrolling.current) return;
    lastManualScroll.current = Date.now();
  }, []);

  useEffect(() => { scrollToCurrent("instant"); }, []);

  useEffect(() => {
    if (currentIndex < 0) return;
    if (Date.now() - lastManualScroll.current < COOLDOWN) return;
    scrollToCurrent();
  }, [currentIndex, scrollToCurrent]);

  // IntersectionObserver for "jump to current" button
  useEffect(() => {
    if (currentIndex < 0 || !listRef.current) { setShowJump(false); return; }
    const el = itemRefs.current.get(currentIndex);
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowJump(!entry.isIntersecting),
      { root: listRef.current, threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentIndex]);

  const onChapterClick = useCallback((topic) => {
    seek(topic.s);
    if (audio && audio.paused) audio.play();
  }, [seek, audio]);

  const setItemRef = useCallback((i, el) => {
    if (el) itemRefs.current.set(i, el);
    else itemRefs.current.delete(i);
  }, []);

  const eqPaused = !playing;

  return html`
    <div className="cp" ref=${panelRef}>
      <div className="cp-list" ref=${listRef} onScroll=${onListScroll}>
        ${topics.map((topic, i) => {
          const state = i === currentIndex ? "is-current"
            : i < currentIndex ? "is-past" : "";
          return html`
            <div key=${topic.s + "-" + i}
                 ref=${(el) => setItemRef(i, el)}
                 className=${`cp-item ${state}`}
                 onClick=${() => onChapterClick(topic)}>
              <div className="cp-left">
                <div className="cp-time">${formatTime(topic.s)}</div>
                <div className="cp-play">${PlaySvg}</div>
                <div className="cp-eq">
                  <div className="eq" style=${{ height: 12 }}>
                    <div className="eq-bar" style=${{ animation: "eq1 0.6s ease-in-out infinite", width: 2, animationPlayState: eqPaused ? "paused" : "running" }} />
                    <div className="eq-bar" style=${{ animation: "eq2 0.5s ease-in-out infinite", width: 2, animationPlayState: eqPaused ? "paused" : "running" }} />
                    <div className="eq-bar" style=${{ animation: "eq3 0.7s ease-in-out infinite", width: 2, animationPlayState: eqPaused ? "paused" : "running" }} />
                  </div>
                </div>
              </div>
              <div className="cp-name">${topic.t}</div>
              <div className="cp-dur">${topic.d}м</div>
            </div>`;
        })}
      </div>

      ${showJump && html`
        <div className="cp-jump" onClick=${() => scrollToCurrent()}>
          Текущая глава
        </div>
      `}
    </div>`;
}
