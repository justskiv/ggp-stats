import {
  html, useState, useEffect, useRef, useCallback,
} from "../lib.js";

const TgIcon = html`<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
</svg>`;

const YtIcon = html`<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
</svg>`;

const HabrIcon = html`<span className="ab-social-mask" />`;

const AtomIcon = html`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth=${1.5}>
  <circle cx=${12} cy=${12} r=${3} fill="currentColor" stroke="none" />
  <ellipse cx=${12} cy=${12} rx=${10} ry=${4} />
  <ellipse cx=${12} cy=${12} rx=${10} ry=${4} transform="rotate(60 12 12)" />
  <ellipse cx=${12} cy=${12} rx=${10} ry=${4} transform="rotate(120 12 12)" />
</svg>`;

const AVATAR_DIR = "assets/img/guests/";

const HOST = {
  name: "Николай Тузов",
  desc: "Создатель и ведущий GoGetPodcast. Go-разработчик, инженер, блогер. ex-Plata, ex-Lamoda, ex-Gaijin.",
  avatar: "nikolay-tuzov.jpg",
  socials: [
    { href: "https://t.me/ntuzov", title: "Telegram", icon: TgIcon },
    { href: "https://www.youtube.com/@nikolay_tuzov", title: "YouTube", icon: YtIcon },
    { href: "https://habr.com/ru/users/JustSkiv", title: "Habr", icon: HabrIcon },
    { href: "https://tuzov.dev/", title: "Личный сайт", icon: AtomIcon },
  ],
};

const GUESTS = [
  {
    name: "Кирилл Мокевнин",
    desc: "Основатель Хекслет. Разработчик, преподаватель.",
    avatar: "kirill-mokevnin.png",
    socials: [
      { href: "https://t.me/orgprog", title: "Telegram", icon: TgIcon },
      { href: "https://www.youtube.com/@mokevnin", title: "YouTube", icon: YtIcon },
    ],
    episodes: ["ep20"],
  },
  {
    name: "Влад Тен",
    desc: "Go-разработчик, блогер, автор курсов для инженеров.",
    avatar: "vlad-ten.png",
    socials: [
      { href: "https://t.me/tenfoundation", title: "Telegram", icon: TgIcon },
      { href: "https://www.youtube.com/@vladtenten", title: "YouTube", icon: YtIcon },
    ],
    episodes: ["ep21"],
  },
  {
    name: "Алексей Акулович",
    desc: "Go-разработчик. inDrive, ex-Tinkoff, ex-VK",
    avatar: "alexey-akulovich.jpg",
    socials: [
      { href: "https://t.me/atercattus_was_here", title: "Telegram", icon: TgIcon },
      { href: "https://www.youtube.com/@AterCattus", title: "YouTube", icon: YtIcon },
    ],
    episodes: ["ep21"],
  },
  {
    name: "Глеб Яльчик",
    desc: "Go евангелист, технический директор Pixel Technologies.",
    avatar: "gleb-yalchik.png",
    socials: [],
    episodes: ["ep20"],
  },
];

const ChevronIcon = html`<svg viewBox="0 0 16 16" width=${14} height=${14} fill="currentColor">
  <path d="M4.47 5.47a.75.75 0 0 1 1.06 0L8 7.94l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06z"/>
</svg>`;

function useEpisodeDropdown(episodeIds) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const registry = window.GGP_EPISODES?._registry || [];
  const items = (episodeIds || [])
    .map(id => registry.find(e => e.id === id))
    .filter(Boolean);
  const toggle = useCallback(() => setOpen(v => !v), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const timer = setTimeout(() =>
      document.addEventListener("pointerdown", onClick, true), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick, true);
      clearTimeout(timer);
    };
  }, [open]);

  return { open, toggle, items, wrapRef };
}

function PersonCard({ person }) {
  const { open, toggle, items, wrapRef } = useEpisodeDropdown(person.episodes);

  return html`
    <div className="ab-person-wrap" ref=${wrapRef}>
      <article className="ab-person-card">
        <div className="ab-person-avatar">
          <img src=${AVATAR_DIR + person.avatar} alt=${person.name} />
        </div>
        <div className="ab-person-info">
          <h3 className="ab-person-name">${person.name}</h3>
          <p className="ab-person-desc">${person.desc}</p>
          <div className="ab-person-actions">
            ${person.socials.length > 0 && html`
              <div className="ab-socials">
                ${person.socials.map(s => html`
                  <a key=${s.href} className="ab-social" href=${s.href}
                     target="_blank" rel="noopener noreferrer" title=${s.title}>
                    ${s.icon}
                  </a>
                `)}
              </div>
            `}
            ${items.length > 0 && html`
              <button className="ab-ep-btn" onClick=${toggle}>
                Выпуски (${items.length})
                <span className=${`ab-ep-chevron${open ? " ab-ep-chevron--open" : ""}`}>
                  ${ChevronIcon}
                </span>
              </button>
            `}
          </div>
        </div>
      </article>
      ${open && html`
        <ul className="ab-ep-list">
          ${items.map(ep => html`
            <li key=${ep.id}>
              <a className="ab-ep-item" href=${`#/${ep.id}`}>
                <span className="ab-ep-num">#${ep.number}</span>
                <span className="ab-ep-title">${ep.title}</span>
              </a>
            </li>
          `)}
        </ul>
      `}
    </div>`;
}

export function AboutPage() {
  useEffect(() => { document.title = "О подкасте — GoGetPodcast"; }, []);

  return html`
    <div className="ab-page">
      <section className="ab-hero-wrap">
        <div className="ab-hero">
          <h1 className="ab-hero-title">Go Get Podcast</h1>
          <p className="ab-hero-subtitle">
            Самый популярный подкаст в Go сообществе
          </p>
        </div>
      </section>

      <div className="ab-container">
        <div className="ab-text">
          <p>Подкаст для Go-разработчиков и инженеров из смежных областей.</p>
          <p>Обсуждаем новые возможности языка, релизы, инструменты,
          архитектурные решения, рабочие подходы, AI инструменты
          и работу с ними, как развиваться разработчику. Копаем глубоко,
          обсуждаем без воды и пересказа документации.</p>
          <p>В каждом выпуске гости — действующие инженеры и топовые
          эксперты: тимлиды, архитекторы, разработчики из JetBrains,
          Avito, Lamoda, Wildberries, Яндекса, Хекслет и других компаний.</p>
          <p>Формат подкаста не лекции, а живые разговоры людей, которые
          пишут на Go каждый день, либо занимаются чем-то смежным.</p>
        </div>

        <section className="ab-people">
          <h2 className="ab-section-title">Ведущий</h2>
          <${PersonCard} person=${HOST} />
        </section>

        <section className="ab-people">
          <h2 className="ab-section-title">Гости</h2>
          <div className="ab-people-grid">
            ${GUESTS.map(g => html`<${PersonCard} key=${g.name} person=${g} />`)}
          </div>
        </section>
      </div>
    </div>`;
}