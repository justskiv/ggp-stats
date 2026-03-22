export const DASH_TABS = [
  { id: "overview", label: "📊 Обзор" },
  { id: "speakers", label: "🗣 Спикеры" },
  { id: "topics", label: "📋 Темы" },
  { id: "resources", label: "📚 Ресурсы" },
  { id: "fun", label: "🎉 Fun Facts" },
];

export const CATEGORY_GROUPS = {
  books:    { label: "📖 Книги",       cats: ["cs","os","db","algo","code","biz","sci"] },
  course:   { label: "🎓 Курсы",       cats: ["course"] },
  platform: { label: "🌐 Платформы",   cats: ["platform"] },
  article:  { label: "📝 Статьи",      cats: ["article"] },
  ai:       { label: "🤖 AI",          cats: ["ai"] },
  tool:     { label: "🔧 Инструменты", cats: ["tool"] },
};

export const GROUP_ORDER = ["books", "course", "platform", "article", "ai", "tool"];
