import { useState, useEffect } from "./lib.js";

export function useRoute() {
  const parse = (hash) => {
    if (!hash || hash === "#" || hash === "#/") return { page: "list" };
    if (hash === "#/about") return { page: "about" };
    const m = hash.match(/^#\/([^/]+)(?:\/([^/]+))?$/);
    return m ? { page: "episode", id: m[1], tab: m[2] || null } : { page: "list" };
  };
  const [route, setRoute] = useState(parse(window.location.hash));
  useEffect(() => {
    const handler = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return route;
}

export function useEpisodeData(id) {
  const [state, setState] = useState({ loading: false, data: null, error: null });
  useEffect(() => {
    if (!id) return;
    if (window.GGP_EPISODES[id]) {
      setState({ loading: false, data: window.GGP_EPISODES[id], error: null });
      return;
    }
    setState({ loading: true, data: null, error: null });
    let cancelled = false;
    const script = document.createElement("script");
    script.src = "episodes/" + id + "/data.js";
    script.onload = () => {
      if (cancelled) return;
      if (window.GGP_EPISODES[id]) {
        setState({ loading: false, data: window.GGP_EPISODES[id], error: null });
      } else {
        setState({ loading: false, data: null, error: "no-data" });
      }
    };
    script.onerror = () => {
      if (!cancelled) setState({ loading: false, data: null, error: "load-failed" });
    };
    document.head.appendChild(script);
    return () => { cancelled = true; };
  }, [id]);
  return state;
}
