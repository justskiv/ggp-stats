import { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Treemap } from "recharts";

const COLORS = {
  nikolay: "#6366f1",
  kirill: "#f59e0b",
  vlad: "#10b981",
};

const SPEAKER_NAMES = {
  nikolay: "Николай Тузов",
  kirill: "Кирилл Мокевнин",
  vlad: "Влад",
};

const SPEAKER_ROLES = {
  nikolay: "Ведущий",
  kirill: "Гость · Hexlet",
  vlad: "Гость · YouTube",
};

const speakingData = [
  { name: "Николай", fullName: "Николай Тузов", words: 4850, pct: 39.8, time: 68, timePct: 38.6, utterances: 128, avgWords: 37.9, longest: 180, color: COLORS.nikolay },
  { name: "Кирилл", fullName: "Кирилл Мокевнин", words: 5200, pct: 42.6, time: 72, timePct: 40.9, utterances: 107, avgWords: 48.6, longest: 210, color: COLORS.kirill },
  { name: "Влад", fullName: "Влад", words: 2150, pct: 17.6, time: 36, timePct: 20.5, utterances: 68, avgWords: 31.6, longest: 120, color: COLORS.vlad },
];

const radarData = [
  { metric: "Слова", nikolay: 93, kirill: 100, vlad: 41 },
  { metric: "Реплики", nikolay: 100, kirill: 84, vlad: 53 },
  { metric: "Время", nikolay: 94, kirill: 100, vlad: 50 },
  { metric: "Ср. длина", nikolay: 78, kirill: 100, vlad: 65 },
  { metric: "Макс. реплика", nikolay: 86, kirill: 100, vlad: 57 },
];

const topicsTimeline = [
  { topic: "Знакомство", start: 0, duration: 4, color: "#e2e8f0" },
  { topic: "Как изучить технологию за 48ч", start: 4, duration: 6, color: "#c7d2fe" },
  { topic: "Теория vs Практика", start: 10, duration: 8, color: "#a5b4fc" },
  { topic: "SICP и «Код» Питцольда", start: 18, duration: 9, color: "#818cf8" },
  { topic: "Культура образования: Россия vs США", start: 27, duration: 10, color: "#6366f1" },
  { topic: "Рекомендации книг", start: 37, duration: 9, color: "#a5b4fc" },
  { topic: "Таненбаум, Кнут, SICP", start: 46, duration: 12, color: "#818cf8" },
  { topic: "Фундамент и A-players", start: 58, duration: 12, color: "#6366f1" },
  { topic: "Найм джунов и TCP/UDP", start: 70, duration: 7, color: "#c7d2fe" },
  { topic: "Практическое обучение", start: 77, duration: 8, color: "#a5b4fc" },
  { topic: "Сравнение себя с другими", start: 85, duration: 20, color: "#818cf8" },
  { topic: "Теория → Практика: что первично?", start: 105, duration: 10, color: "#c7d2fe" },
  { topic: "Золотой фонд ресурсов", start: 115, duration: 27, color: "#6366f1" },
  { topic: "ИИ и обучение", start: 142, duration: 34, color: "#f59e0b" },
];

const booksByType = [
  { name: "Книги", value: 22, fill: "#6366f1" },
  { name: "Курсы", value: 3, fill: "#10b981" },
  { name: "Платформы", value: 6, fill: "#f59e0b" },
  { name: "Другое", value: 4, fill: "#94a3b8" },
];

const booksMentionedBy = [
  { name: "Кирилл", count: 17 },
  { name: "Николай", count: 14 },
  { name: "Влад", count: 8 },
];

const techData = [
  { name: "PHP", mentions: 8 },
  { name: "Go", mentions: 5 },
  { name: "Python", mentions: 4 },
  { name: "ChatGPT", mentions: 6 },
  { name: "Linux", mentions: 5 },
  { name: "Rust", mentions: 3 },
  { name: "Ruby", mentions: 3 },
  { name: "Kubernetes", mentions: 2 },
  { name: "JavaScript", mentions: 2 },
  { name: "Vim", mentions: 3 },
  { name: "Claude", mentions: 2 },
  { name: "Gemini", mentions: 2 },
];

const funFacts = [
  { icon: "😴", text: "Влад опоздал на 30 минут — перепутал день недели и спал в 7 вечера" },
  { icon: "🍝", text: "Кирилл встретил PHP-легенду Диму Котерова на собеседовании в ресторане" },
  { icon: "⚡", text: "В детстве Кирилл разгонял процессоры друзьям за 50 рублей" },
  { icon: "📖", text: "Жена Кирилла прочитала 200 страниц книги «Код» Питцольда" },
  { icon: "👁", text: "В начале стрима на YouTube был всего 1 зритель" },
  { icon: "📡", text: "Влад отключился посреди подкаста из-за технических проблем" },
  { icon: "💡", text: "Кирилл продемонстрировал AI Studio Light от Mac в прямом эфире" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13 }}>
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color || p.fill, margin: "2px 0" }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieLabelRender = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  if (percent < 0.1) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const StatCard = ({ label, value, sub, icon }) => (
  <div style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14, minWidth: 160 }}>
    <div style={{ fontSize: 28 }}>{icon}</div>
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>{value}</div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#64748b" }}>{sub}</div>}
    </div>
  </div>
);

const SpeakerBadge = ({ speaker }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#1e293b", borderRadius: 12, padding: "12px 16px", borderLeft: `4px solid ${speaker.color}` }}>
    <div style={{ width: 42, height: 42, borderRadius: "50%", background: speaker.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>
      {speaker.name[0]}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>{speaker.fullName}</div>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>
        {speaker.words} слов · {speaker.utterances} реплик · {speaker.time} мин
      </div>
    </div>
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: speaker.color }}>{speaker.pct}%</div>
      <div style={{ fontSize: 10, color: "#64748b" }}>по словам</div>
    </div>
  </div>
);

const tabs = [
  { id: "overview", label: "Обзор" },
  { id: "speakers", label: "Спикеры" },
  { id: "topics", label: "Темы" },
  { id: "resources", label: "Ресурсы" },
  { id: "fun", label: "Fun Facts" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [metricType, setMetricType] = useState("words");

  const pieDataMap = {
    words: speakingData.map((s) => ({ name: s.name, value: s.words, pct: s.pct })),
    time: speakingData.map((s) => ({ name: s.name, value: s.time, pct: s.timePct })),
    utterances: speakingData.map((s) => ({ name: s.name, value: s.utterances, pct: ((s.utterances / 303) * 100).toFixed(1) })),
  };
  const metricLabels = { words: "По словам", time: "По времени (мин)", utterances: "По репликам" };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", padding: 0 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e293b 100%)", padding: "32px 24px 20px", borderBottom: "1px solid #334155" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>🎙️</span>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: "-0.5px" }}>GoGetPodcast · Выпуск #21</h1>
              <p style={{ fontSize: 13, color: "#a5b4fc", margin: "4px 0 0" }}>Обучение программированию — с новыми людьми</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            <StatCard icon="⏱" value="2ч 56м" label="Длительность" sub="176 минут" />
            <StatCard icon="💬" value="12 200" label="Всего слов" sub="~70 слов/мин" />
            <StatCard icon="🗣" value="303" label="Реплик" sub="3 спикера" />
            <StatCard icon="📚" value="35" label="Ресурсов" sub="книги, курсы, платформы" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 4, padding: "16px 0 0", borderBottom: "1px solid #1e293b", overflowX: "auto" }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: "10px 20px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: activeTab === t.id ? 700 : 500,
                background: activeTab === t.id ? "#1e293b" : "transparent",
                color: activeTab === t.id ? "#f1f5f9" : "#64748b",
                borderBottom: activeTab === t.id ? "2px solid #6366f1" : "2px solid transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "24px 0 48px" }}>
          {/* ============ OVERVIEW ============ */}
          {activeTab === "overview" && (
            <div>
              {/* Speakers summary */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
                {speakingData.map((s) => (
                  <SpeakerBadge key={s.name} speaker={s} />
                ))}
              </div>

              {/* Pie + Bar side by side */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Pie Chart */}
                <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Распределение эфира</h3>
                    <div style={{ display: "flex", gap: 4 }}>
                      {Object.entries(metricLabels).map(([k, v]) => (
                        <button
                          key={k}
                          onClick={() => setMetricType(k)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            border: "none",
                            fontSize: 11,
                            cursor: "pointer",
                            background: metricType === k ? "#6366f1" : "#334155",
                            color: metricType === k ? "#fff" : "#94a3b8",
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={pieDataMap[metricType]} cx="50%" cy="50%" innerRadius={55} outerRadius={95} dataKey="value" labelLine={false} label={PieLabelRender} strokeWidth={2} stroke="#0f172a">
                        {pieDataMap[metricType].map((_, i) => (
                          <Cell key={i} fill={[COLORS.nikolay, COLORS.kirill, COLORS.vlad][i]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 8 }}>
                    {speakingData.map((s) => (
                      <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color }} />
                        <span style={{ color: "#94a3b8" }}>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bar Chart */}
                <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Сравнение метрик</h3>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={[
                      { metric: "Слова (×100)", nikolay: 48.5, kirill: 52, vlad: 21.5 },
                      { metric: "Реплики", nikolay: 128, kirill: 107, vlad: 68 },
                      { metric: "Время (мин)", nikolay: 68, kirill: 72, vlad: 36 },
                      { metric: "Ср. длина", nikolay: 37.9, kirill: 48.6, vlad: 31.6 },
                    ]} margin={{ left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="nikolay" name="Николай" fill={COLORS.nikolay} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="kirill" name="Кирилл" fill={COLORS.kirill} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="vlad" name="Влад" fill={COLORS.vlad} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* ============ SPEAKERS ============ */}
          {activeTab === "speakers" && (
            <div>
              {/* Radar */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px" }}>Радар активности (нормализованный, макс = 100)</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10 }} />
                    <Radar name="Николай" dataKey="nikolay" stroke={COLORS.nikolay} fill={COLORS.nikolay} fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Кирилл" dataKey="kirill" stroke={COLORS.kirill} fill={COLORS.kirill} fillOpacity={0.15} strokeWidth={2} />
                    <Radar name="Влад" dataKey="vlad" stroke={COLORS.vlad} fill={COLORS.vlad} fillOpacity={0.15} strokeWidth={2} />
                    <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Speaker detail cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {speakingData.map((s) => (
                  <div key={s.name} style={{ background: "#1e293b", borderRadius: 12, padding: 20, borderTop: `3px solid ${s.color}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                        {s.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>{s.fullName}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{SPEAKER_ROLES[s.name === "Николай" ? "nikolay" : s.name === "Кирилл" ? "kirill" : "vlad"]}</div>
                      </div>
                    </div>
                    {[
                      ["Слов", s.words.toLocaleString(), `${s.pct}%`],
                      ["Реплик", s.utterances, `${((s.utterances / 303) * 100).toFixed(1)}%`],
                      ["Время", `${s.time} мин`, `${s.timePct}%`],
                      ["Ср. длина реплики", `${s.avgWords} слов`, ""],
                      ["Макс. реплика", `${s.longest} слов`, ""],
                    ].map(([label, val, extra], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid #334155" : "none", fontSize: 13 }}>
                        <span style={{ color: "#94a3b8" }}>{label}</span>
                        <span style={{ fontWeight: 600 }}>
                          {val} {extra && <span style={{ color: s.color, fontSize: 11 }}>{extra}</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Insight */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginTop: 20, borderLeft: `4px solid ${COLORS.kirill}` }}>
                <h4 style={{ margin: "0 0 8px", fontSize: 14, color: COLORS.kirill }}>📊 Ключевой инсайт</h4>
                <p style={{ margin: 0, fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>
                  <strong style={{ color: "#f1f5f9" }}>Кирилл Мокевнин</strong> — абсолютный лидер по объёму речи (42.6% слов), при этом у него самые длинные реплики в среднем (48.6 слов) — он даёт развёрнутые, глубокие ответы.{" "}
                  <strong style={{ color: "#f1f5f9" }}>Николай</strong> как ведущий задаёт ритм — у него больше всего реплик (128), но они короче. <strong style={{ color: "#f1f5f9" }}>Влад</strong> говорит компактнее всех, но его вклад ценен точными примерами.
                </p>
              </div>
            </div>
          )}

          {/* ============ TOPICS ============ */}
          {activeTab === "topics" && (
            <div>
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Таймлайн тем подкаста</h3>
                <div style={{ position: "relative" }}>
                  {topicsTimeline.map((t, i) => {
                    const leftPct = (t.start / 176) * 100;
                    const widthPct = (t.duration / 176) * 100;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 6, gap: 8 }}>
                        <div style={{ width: 60, textAlign: "right", fontSize: 11, color: "#64748b", flexShrink: 0 }}>
                          {Math.floor(t.start / 60)}:{String(t.start % 60).padStart(2, "0")}
                        </div>
                        <div style={{ flex: 1, position: "relative", height: 28 }}>
                          <div
                            style={{
                              position: "absolute",
                              left: `${leftPct}%`,
                              width: `${widthPct}%`,
                              height: "100%",
                              background: t.color,
                              borderRadius: 6,
                              display: "flex",
                              alignItems: "center",
                              paddingLeft: 8,
                              fontSize: 11,
                              fontWeight: 500,
                              color: "#fff",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              cursor: "default",
                              transition: "opacity 0.2s",
                            }}
                            title={`${t.topic} (${t.duration} мин)`}
                          >
                            {t.topic}
                          </div>
                        </div>
                        <div style={{ width: 40, fontSize: 11, color: "#64748b", flexShrink: 0 }}>{t.duration} мин</div>
                      </div>
                    );
                  })}
                  {/* Time axis */}
                  <div style={{ display: "flex", marginLeft: 68, marginTop: 8 }}>
                    {[0, 30, 60, 90, 120, 150, 176].map((m) => (
                      <div key={m} style={{ position: "absolute", left: `calc(68px + ${(m / 176) * 100}% * (100% - 108px) / 100%)`, fontSize: 10, color: "#475569" }}>
                        {Math.floor(m / 60)}:{String(m % 60).padStart(2, "0")}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top topics by duration */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Топ тем по длительности</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={[...topicsTimeline].sort((a, b) => b.duration - a.duration).slice(0, 8)} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} unit=" мин" />
                    <YAxis type="category" dataKey="topic" width={200} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="duration" name="Длительность" fill="#6366f1" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ============ RESOURCES ============ */}
          {activeTab === "resources" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Resources by type */}
                <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Ресурсы по типу</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={booksByType} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: "#475569" }} strokeWidth={2} stroke="#0f172a">
                        {booksByType.map((entry, i) => (
                          <Cell key={i} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Who mentioned most */}
                <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Кто упомянул больше ресурсов</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={booksMentionedBy}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                      <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" name="Ресурсов" fill="#6366f1" radius={[6, 6, 0, 0]}>
                        {booksMentionedBy.map((_, i) => (
                          <Cell key={i} fill={[COLORS.kirill, COLORS.nikolay, COLORS.vlad][i]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Technologies */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Технологии и инструменты</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={techData.sort((a, b) => b.mentions - a.mentions)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="mentions" name="Упоминаний" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Resources list */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Все упомянутые ресурсы (35)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { t: "SICP", who: "Все", type: "📖" },
                    { t: "«Код» Питцольда", who: "Кирилл", type: "📖" },
                    { t: "«Цель» Голдратта", who: "Кирилл, Николай", type: "📖" },
                    { t: "Грокаем алгоритмы", who: "Николай", type: "📖" },
                    { t: "Nand2Tetris", who: "Николай", type: "🎓" },
                    { t: "Совершенный код (McConnell)", who: "Кирилл, Николай", type: "📖" },
                    { t: "Программист-прагматик", who: "Кирилл", type: "📖" },
                    { t: "TAPL (Benjamin Pierce)", who: "Кирилл", type: "📖" },
                    { t: "Чистый код (Martin)", who: "Кирилл", type: "📖" },
                    { t: "Joel on Software", who: "Кирилл", type: "📝" },
                    { t: "Deadlock Empire", who: "Николай", type: "🎮" },
                    { t: "CS:APP / 15-213", who: "Влад", type: "📖" },
                    { t: "OS: Three Easy Pieces", who: "Влад", type: "📖" },
                    { t: "DB System Concepts", who: "Влад", type: "📖" },
                    { t: "Книги Таненбаума", who: "Все", type: "📖" },
                    { t: "CLRS (Кармен)", who: "Николай, Влад", type: "📖" },
                    { t: "Кнут", who: "Все", type: "📖" },
                    { t: "Homo Sapiens (Harari)", who: "Кирилл", type: "📖" },
                    { t: "Проект Phoenix", who: "Кирилл", type: "📖" },
                    { t: "Deadline (DeMarco)", who: "Николай", type: "📖" },
                    { t: "Hexlet", who: "Кирилл", type: "🌐" },
                    { t: "Code Basics", who: "Кирилл", type: "🌐" },
                    { t: "Exercism", who: "Кирилл", type: "🌐" },
                    { t: "Rustlings", who: "Влад", type: "🎓" },
                    { t: "How to Design Programs", who: "Кирилл", type: "📖" },
                    { t: "Чистая архитектура", who: "Николай", type: "📖" },
                    { t: "Go Tour", who: "Влад, Николай", type: "🎓" },
                    { t: "Лекции Фейнмана", who: "Николай", type: "📖" },
                    { t: "CodeBattle", who: "Кирилл", type: "🌐" },
                    { t: "Vim Golf", who: "Кирилл", type: "🎮" },
                    { t: "Mat Academy", who: "Влад", type: "🌐" },
                    { t: "optimizationguide.com", who: "Николай", type: "🌐" },
                    { t: "Poe.com", who: "Николай", type: "🤖" },
                    { t: "NotebookLM", who: "Николай", type: "🤖" },
                    { t: "7 баз за неделю", who: "Кирилл", type: "📖" },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#0f172a", borderRadius: 8, fontSize: 13 }}>
                      <span style={{ fontSize: 16 }}>{r.type}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{r.t}</div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{r.who}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ============ FUN FACTS ============ */}
          {activeTab === "fun" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, marginBottom: 24 }}>
                {funFacts.map((f, i) => (
                  <div key={i} style={{ background: "#1e293b", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 16, fontSize: 14, lineHeight: 1.5 }}>
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{f.icon}</span>
                    <span style={{ color: "#cbd5e1" }}>{f.text}</span>
                  </div>
                ))}
              </div>

              {/* People mentioned */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Упомянутые персоны (18 человек)</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[
                    "Рахим · Hexlet",
                    "Дима Котеров · PHP",
                    "Joel Spolsky · Stack Overflow",
                    "Фейнман · физика",
                    "Ландау · физика",
                    "Лобачевский · математика",
                    "Эйлер · математика",
                    "Дробышевский · антропология",
                    "Сурдин · астрономия",
                    "Илон Маск",
                    "Стив Джобс",
                    "Глеб · подкаст",
                    "Лёша · подкаст",
                    "Данил · подкаст",
                    "Антон Бельназаров",
                    "Махоткин Алексей · CTO",
                    "Benjamin Pierce · TAPL",
                    "Керниган · CS",
                  ].map((p, i) => (
                    <span key={i} style={{ background: "#334155", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "#cbd5e1" }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ background: "#1e293b", borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Быстрые факты в цифрах</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    ["19", "Технологий", "упомянуто"],
                    ["18", "Персон", "упомянуто"],
                    ["22", "Книги", "рекомендовано"],
                    ["6", "Платформ", "для обучения"],
                    ["~70", "Слов/мин", "средний темп"],
                    ["48.6", "Слов", "ср. реплика Кирилла"],
                    ["128", "Реплик", "макс (Николай)"],
                    ["210", "Слов", "длиннейшая реплика"],
                  ].map(([val, label, sub], i) => (
                    <div key={i} style={{ background: "#0f172a", borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                      <div style={{ fontSize: 24, fontWeight: 800, color: "#a5b4fc" }}>{val}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginTop: 2 }}>{label}</div>
                      <div style={{ fontSize: 10, color: "#64748b" }}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
