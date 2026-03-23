import {
  html, useState, useEffect, useRef,
  useCallback, createContext, useContext,
} from "../lib.js";

const PlayerContext = createContext(null);

export const usePlayer = () => useContext(PlayerContext);

const SPEEDS = [1, 1.25, 1.5, 1.75, 2];

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
  }
  const audio = audioRef.current;

  const currentTimeRef = useRef(0);
  const topicsRef = useRef([]);

  const [state, setState] = useState({
    episodeId: null,
    episodeMeta: null,
    playing: false,
    duration: 0,
    playbackRate: 1,
    currentChapter: null,
    topics: [],
  });

  useEffect(() => {
    const onLoadedMetadata = () => {
      setState((s) => ({ ...s, duration: audio.duration }));
    };

    const onPlay = () => setState((s) => ({ ...s, playing: true }));
    const onPause = () => setState((s) => ({ ...s, playing: false }));

    const onTimeUpdate = () => {
      const t = audio.currentTime;
      currentTimeRef.current = t;

      const topics = topicsRef.current;
      if (topics.length === 0) return;
      let chapter = null;
      for (let i = topics.length - 1; i >= 0; i--) {
        if (topics[i].s <= t) { chapter = topics[i]; break; }
      }
      setState((s) => {
        if (s.currentChapter === chapter) return s;
        if (s.currentChapter && chapter && s.currentChapter.t === chapter.t) return s;
        return { ...s, currentChapter: chapter };
      });
    };

    const onEnded = () => {
      currentTimeRef.current = 0;
      setState((s) => ({ ...s, playing: false }));
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audio]);

  const play = useCallback((episodeData) => {
    const { meta, topics } = episodeData;
    topicsRef.current = topics || [];

    if (state.episodeId === meta.id) {
      audio.play();
      return;
    }

    audio.src = meta.audioUrl;
    audio.playbackRate = state.playbackRate;
    audio.play();
    setState((s) => ({
      ...s,
      episodeId: meta.id,
      episodeMeta: { number: meta.number, title: meta.subtitle },
      topics: topics || [],
      currentChapter: topics && topics.length > 0 ? topics[0] : null,
      duration: 0,
    }));
  }, [audio, state.episodeId, state.playbackRate]);

  const pause = useCallback(() => { audio.pause(); }, [audio]);

  const togglePlay = useCallback(() => {
    if (audio.paused) { audio.play(); } else { audio.pause(); }
  }, [audio]);

  const seek = useCallback((seconds) => {
    const clamped = Math.max(0, Math.min(seconds, audio.duration || 0));
    audio.currentTime = clamped;
    currentTimeRef.current = clamped;
  }, [audio]);

  const setSpeed = useCallback((rate) => {
    audio.playbackRate = rate;
    setState((s) => ({ ...s, playbackRate: rate }));
  }, [audio]);

  const cycleSpeed = useCallback(() => {
    const idx = SPEEDS.indexOf(state.playbackRate);
    const next = SPEEDS[(idx + 1) % SPEEDS.length];
    setSpeed(next);
  }, [state.playbackRate, setSpeed]);

  const close = useCallback(() => {
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    currentTimeRef.current = 0;
    topicsRef.current = [];
    setState((s) => ({
      episodeId: null,
      episodeMeta: null,
      playing: false,
      duration: 0,
      playbackRate: s.playbackRate,
      currentChapter: null,
      topics: [],
    }));
  }, [audio]);

  const value = {
    ...state,
    currentTimeRef,
    audio,
    play,
    pause,
    togglePlay,
    seek,
    setSpeed,
    cycleSpeed,
    close,
  };

  return html`
    <${PlayerContext.Provider} value=${value}>
      ${children}
    <//>`;
}
