import { html } from "./lib.js";
import { useRoute } from "./hooks.js";
import { PlayerProvider } from "./components/PlayerProvider.js";
import { Header } from "./components/Header.js";
import { EpisodeList } from "./components/EpisodeList.js";
import { EpisodeView } from "./components/EpisodeView.js";
import { AboutPage } from "./components/AboutPage.js";

function App() {
  const route = useRoute();

  let page;
  if (route.page === "episode") page = html`<${EpisodeView} id=${route.id} tab=${route.tab} />`;
  else if (route.page === "about") page = html`<${AboutPage} />`;
  else page = html`<${EpisodeList} />`;

  return html`
    <${PlayerProvider}>
      <${Header} />
      ${page}
    <//>
  `;
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(html`<${App} />`);
