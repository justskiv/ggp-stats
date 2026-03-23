import { html } from "./lib.js";
import { useRoute } from "./hooks.js";
import { PlayerProvider } from "./components/PlayerProvider.js";
import { Header } from "./components/Header.js";
import { EpisodeList } from "./components/EpisodeList.js";
import { EpisodeView } from "./components/EpisodeView.js";

function App() {
  const route = useRoute();
  return html`
    <${PlayerProvider}>
      <${Header} />
      ${route.page === "episode"
        ? html`<${EpisodeView} id=${route.id} tab=${route.tab} />`
        : html`<${EpisodeList} />`}
    <//>
  `;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
