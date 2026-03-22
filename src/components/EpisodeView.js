import { html } from "../lib.js";
import { useEpisodeData } from "../hooks.js";
import { LoadingScreen, ErrorScreen } from "./shared.js";
import { Dashboard } from "./Dashboard.js";

export function EpisodeView({ id, tab }) {
  const { loading, data, error } = useEpisodeData(id);
  if (loading || (!data && !error)) return html`<${LoadingScreen} />`;
  if (error) return html`<${ErrorScreen} id=${id} />`;
  return html`<${Dashboard} data=${data} routeTab=${tab} />`;
}
