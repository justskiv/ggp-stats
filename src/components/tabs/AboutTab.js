import { html, Fragment, useMemo } from "../../lib.js";

const URL_RX = /(https?:\/\/[^\s]+)/g;
const IMG_DIR = "assets/img/guests/";

function linkify(text) {
  const parts = text.split(URL_RX);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    p.startsWith("http")
      ? html`<a key=${i} href=${p} target="_blank" rel="noopener">${p}</a>`
      : p
  );
}

export function AboutTab({ data }) {
  const { about, speakers, topics } = data;

  const topTopics = useMemo(
    () => topics.slice().sort((a, b) => b.d - a.d).slice(0, 6),
    [topics],
  );

  if (!about || about.length === 0) return null;

  return html`
    <${Fragment}>
      <div className="abt-grid">
        <div className="abt-main">
          <div className="abt-desc">
            <div className="abt-desc-accent" />
            <div className="abt-desc-body">
              ${about.map((p, i) => html`
                <p key=${i} className="abt-p">
                  ${linkify(p)}
                </p>
              `)}
            </div>
          </div>

          ${topTopics.length > 0 && html`
            <div className="abt-section">
              <h3 className="abt-heading">Ключевые темы</h3>
              <div className="abt-tags">
                ${topTopics.map((tp, i) => html`
                  <div key=${i} className="abt-tag" style=${{ "--tp-c": tp.c || "var(--accent)" }}>
                    <span className="abt-tag-dur">${tp.d} мин</span>
                    <span className="abt-tag-name">${tp.t}</span>
                  </div>
                `)}
              </div>
            </div>
          `}
        </div>

        <div className="abt-side">
          <h3 className="abt-heading">Участники</h3>
          <div className="abt-speakers">
            ${speakers.map((s, i) => html`
              <div key=${i} className="abt-speaker" style=${{ "--sp-c": s.color }}>
                <div className="abt-photo">
                  ${s.img
                    ? html`<img src=${IMG_DIR + s.img} alt=${s.full} />`
                    : s.name[0]}
                </div>
                <div className="abt-speaker-info">
                  <div className="abt-speaker-name">${s.full}</div>
                  <div className="abt-speaker-role">${s.role}</div>
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    <//>`;
}