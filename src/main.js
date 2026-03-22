import { html } from "./lib.js";
import { useRoute } from "./hooks.js";
import { EpisodeList } from "./components/EpisodeList.js";
import { EpisodeView } from "./components/EpisodeView.js";

function App() {
  const route = useRoute();
  if (route.page === "episode") return html`<${EpisodeView} id=${route.id} tab=${route.tab} />`;
  return html`<${EpisodeList} />`;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
