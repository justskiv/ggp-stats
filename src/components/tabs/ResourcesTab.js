import { html, useState, useMemo, Fragment } from "../../lib.js";
import { CATEGORY_GROUPS, GROUP_ORDER } from "../../constants.js";

function matchesSpeaker(who, speaker) {
  return speaker === "all" || who === "Все" || who.split(",").map(x => x.trim()).includes(speaker);
}

export function ResourcesTab({ data }) {
  const { speakers, resources = [] } = data;
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [speakerFilter, setSpeakerFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  const allCategories = useMemo(
    () => new Set(Object.values(CATEGORY_GROUPS).flatMap(g => g.cats)),
    []
  );

  const filteredResources = useMemo(() =>
    resources.filter(r =>
      (categoryFilter === "all" || (CATEGORY_GROUPS[categoryFilter] && CATEGORY_GROUPS[categoryFilter].cats.includes(r.cat)))
      && matchesSpeaker(r.w, speakerFilter)
      && (!searchQuery || r.t.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
    [resources, categoryFilter, speakerFilter, searchQuery]
  );

  const resourceGroups = useMemo(() => {
    const groups = GROUP_ORDER
      .map(k => [k, CATEGORY_GROUPS[k].label, filteredResources.filter(r => CATEGORY_GROUPS[k].cats.includes(r.cat))])
      .filter(g => g[2].length > 0);
    const uncategorized = filteredResources.filter(r => !r.cat || !allCategories.has(r.cat));
    if (uncategorized.length > 0) groups.push(["other", "📦 Прочее", uncategorized]);
    return groups;
  }, [filteredResources, allCategories]);

  const toggleGroup = (gk) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      next.has(gk) ? next.delete(gk) : next.add(gk);
      return next;
    });
  };

  return html`
    <${Fragment}>
      <input type="text" className="res-search" placeholder="Поиск..." value=${searchQuery}
        onChange=${(e) => setSearchQuery(e.target.value)}
        style=${{ width: "100%", padding: "10px 16px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 14, outline: "none", marginBottom: 16 }}
      />

      <div style=${{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20, alignItems: "center" }}>
        <button onClick=${() => setCategoryFilter("all")}
          style=${{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: categoryFilter === "all" ? "var(--accent)" : "var(--bg-elevated)", color: categoryFilter === "all" ? "#fff" : "var(--text-secondary)" }}>
          Все
        </button>
        ${GROUP_ORDER.map(gk => {
          if (!resources.some(r => CATEGORY_GROUPS[gk].cats.includes(r.cat))) return null;
          return html`
            <button key=${gk} onClick=${() => setCategoryFilter(categoryFilter === gk ? "all" : gk)}
              style=${{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: categoryFilter === gk ? 600 : 400, background: categoryFilter === gk ? "var(--accent)" : "var(--bg-elevated)", color: categoryFilter === gk ? "#fff" : "var(--text-secondary)" }}>
              ${CATEGORY_GROUPS[gk].label}
            </button>`;
        })}
        <div style=${{ width: 1, height: 20, background: "var(--bg-elevated)", margin: "0 4px" }} />
        ${speakers.map(s => html`
          <button key=${s.name} onClick=${() => setSpeakerFilter(speakerFilter === s.name ? "all" : s.name)}
            style=${{ padding: "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: speakerFilter === s.name ? 600 : 400, background: speakerFilter === s.name ? s.color : "var(--bg-elevated)", color: speakerFilter === s.name ? "#fff" : "var(--text-secondary)" }}>
            ${s.name}
          </button>
        `)}
      </div>

      ${filteredResources.length < resources.length && html`
        <div style=${{ fontSize: 12, color: "var(--text-tertiary)", marginBottom: 12 }}>Найдено: ${filteredResources.length} из ${resources.length}</div>
      `}

      ${resourceGroups.map(([gk, label, items]) => {
        const isCollapsed = categoryFilter === "all" && collapsedGroups.has(gk);
        return html`
          <div key=${gk} style=${{ marginBottom: 24 }}>
            <div onClick=${categoryFilter === "all" ? () => toggleGroup(gk) : undefined}
              style=${{ display: "flex", alignItems: "center", gap: 8, marginBottom: isCollapsed ? 0 : 10, cursor: categoryFilter === "all" ? "pointer" : "default" }}>
              ${categoryFilter === "all" && html`
                <span style=${{ fontSize: 10, color: "var(--text-muted)", flexShrink: 0, transition: "transform 0.15s", transform: isCollapsed ? "rotate(-90deg)" : "rotate(0)" }}>▼</span>
              `}
              <span style=${{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>${label}</span>
              <span style=${{ fontSize: 12, color: "var(--text-muted)" }}>(${items.length})</span>
              <div style=${{ flex: 1, height: 1, background: "var(--bg-card)" }} />
            </div>
            ${!isCollapsed && html`
              <div className="res-grid" style=${{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                ${items.map((r, i) => html`
                  <div key=${i} className="res-card" style=${{ background: "var(--bg-base)", borderRadius: 10, padding: "12px 16px" }}>
                    <div style=${{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      ${r.icon
                        ? html`<img src=${"assets/icons/" + r.icon} style=${{ width: 20, height: 20, flexShrink: 0, borderRadius: 4, objectFit: "contain" }} />`
                        : html`<span style=${{ fontSize: 16, flexShrink: 0, lineHeight: "20px" }}>${r.tp}</span>`
                      }
                      <div style=${{ flex: 1, minWidth: 0 }}>
                        <div style=${{ fontWeight: 600, fontSize: 13, color: "var(--text-bright)" }}>${r.t}</div>
                        ${r.desc && html`<div style=${{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginTop: 3 }}>${r.desc}</div>`}
                        <div style=${{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 3 }}>${r.w}</div>
                      </div>
                      ${r.url && html`
                        <a href=${r.url} target="_blank" rel="noopener noreferrer"
                          style=${{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 8, background: "var(--accent-bg)", color: "var(--accent-light)", textDecoration: "none", fontSize: 14, flexShrink: 0 }}>
                          ↗
                        </a>
                      `}
                    </div>
                  </div>
                `)}
              </div>
            `}
          </div>`;
      })}

      ${resourceGroups.length === 0 && html`
        <div style=${{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
          <div style=${{ fontSize: 32, marginBottom: 8 }}>🔍</div>
          <div style=${{ fontSize: 14 }}>Ничего не найдено</div>
        </div>
      `}
    <//>`;
}
