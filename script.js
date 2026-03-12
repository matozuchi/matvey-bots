const bots = Array.isArray(window.MATVEY_BOTS) ? window.MATVEY_BOTS : [];
const storageKey = "matvey-bots-language";
const supportedLanguages = ["en", "ru"];

const botGrid = document.querySelector("#bot-grid");
const featuredCard = document.querySelector("#featured-card");
const botCount = document.querySelector("#bot-count");
const liveCount = document.querySelector("#live-count");
const tickerTrack = document.querySelector("#ticker-track");
const languageToggle = document.querySelector("#lang-toggle");
const pageName = document.body.dataset.page || "home";

const SITE_COPY = {
  common: {
    languageToggleLabel: {
      en: "Language toggle",
      ru: "Переключатель языка"
    },
    siteStatsLabel: {
      en: "Site stats",
      ru: "Статистика сайта"
    },
    tickerLabel: {
      en: "What you can find here",
      ru: "Что можно найти здесь"
    },
    botCountLabel: {
      en: "Bots listed",
      ru: "Ботов в каталоге"
    },
    liveCountLabel: {
      en: "Live Telegram links",
      ru: "Активных ссылок в Telegram"
    },
    directoryEyebrow: {
      en: "Bot directory",
      ru: "Каталог ботов"
    },
    directoryTitle: {
      en: "Bot directory",
      ru: "Каталог ботов"
    },
    tickerItems: {
      en: ["Nutrition tracking", "Daily habits", "Quick Telegram access"],
      ru: ["Учет питания", "Ежедневные привычки", "Быстрый доступ в Telegram"]
    },
    openInTelegram: {
      en: "Open in Telegram",
      ru: "Открыть в Telegram"
    },
    telegramLinkComingSoon: {
      en: "Telegram link coming soon",
      ru: "Ссылка Telegram скоро появится"
    },
    telegramLabel: {
      en: "Telegram",
      ru: "Telegram"
    },
    statusLabel: {
      en: "Status",
      ru: "Статус"
    },
    formatLabel: {
      en: "Format",
      ru: "Формат"
    },
    formatValue: {
      en: "Telegram bot",
      ru: "Telegram-бот"
    },
    moreInfo: {
      en: "More info",
      ru: "Подробнее"
    }
  },
  pages: {
    home: {
      title: {
        en: "Matvey's Bots",
        ru: "Боты Матвея"
      },
      description: {
        en: "Explore Matvey's Telegram bots with clear descriptions and direct links to open them in Telegram.",
        ru: "Изучайте Telegram-ботов Matvey's Bots с понятными описаниями и прямыми ссылками на Telegram."
      },
      eyebrow: {
        en: "Telegram Bot Directory",
        ru: "Каталог Telegram-ботов"
      },
      siteTitle: {
        en: "Matvey's Bots",
        ru: "Боты Матвея"
      },
      siteCopy: {
        en: "A simple place to browse Matvey's Telegram bots, read what each one does, and jump straight into Telegram.",
        ru: "Телеграм боты на все случаи жизни которые использует Матвей. Теперь доступны для всех!"
      },
      footer: {
        en: "Matvey's Bots • Telegram tools with clear descriptions and direct links.",
        ru: "Боты Матвея • Telegram-инструменты с понятными описаниями и прямыми ссылками."
      }
    },
    bots: {
      title: {
        en: "Bots • Matvey's Bots",
        ru: "Каталог • Боты Матвея"
      },
      description: {
        en: "Browse Matvey's Telegram bots, read what each one does, and open them directly in Telegram.",
        ru: "Смотрите Telegram-ботов Matvey, читайте, что делает каждый, и открывайте их прямо в Telegram."
      },
      eyebrow: {
        en: "Telegram Bot Directory",
        ru: "Каталог Telegram-ботов"
      },
      siteTitle: {
        en: "Matvey's Bots",
        ru: "Боты Матвея"
      },
      siteCopy: {
        en: "Browse the collection, see what each bot does, and open the ones that are live directly in Telegram.",
        ru: "Изучайте каталог, смотрите, что делает каждый бот, и открывайте уже доступных прямо в Telegram."
      },
      footer: {
        en: "Matvey's Bots • Built to make every Telegram bot easy to discover.",
        ru: "Боты Матвея • Сделан так, чтобы каждого Telegram-бота было легко найти."
      }
    }
  }
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getLocalizedValue(value, language) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (Object.prototype.hasOwnProperty.call(value, language)) {
      return value[language];
    }

    if (Object.prototype.hasOwnProperty.call(value, "en")) {
      return value.en;
    }
  }

  return value;
}

function t(value, language, fallback = "") {
  const localized = getLocalizedValue(value, language);

  if (localized === undefined || localized === null) {
    return fallback;
  }

  return localized;
}

function setText(selector, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.textContent = value;
  }
}

function setAttribute(selector, name, value) {
  const element = document.querySelector(selector);

  if (element) {
    element.setAttribute(name, value);
  }
}

function getTelegramUrl(bot) {
  if (typeof bot.telegramUrl === "string" && bot.telegramUrl.trim().startsWith("https://t.me/")) {
    return bot.telegramUrl.trim();
  }

  if (typeof bot.telegramHandle === "string" && bot.telegramHandle.trim().startsWith("@")) {
    return `https://t.me/${bot.telegramHandle.trim().slice(1)}`;
  }

  return "";
}

function isLive(bot) {
  return getTelegramUrl(bot) !== "";
}

function renderTicker(language) {
  if (!tickerTrack) {
    return;
  }

  const items = t(SITE_COPY.common.tickerItems, language, []);
  const groups = [false, true, true]
    .map((isHidden) => {
      const spans = items
        .map((item) => `<span>${escapeHtml(item)}</span>`)
        .join("");

      return `<div class="ticker-group"${isHidden ? ' aria-hidden="true"' : ""}>${spans}</div>`;
    })
    .join("");

  tickerTrack.innerHTML = groups;
}

function renderActionLinks(bot, language) {
  const telegramUrl = getTelegramUrl(bot);
  const repoLabel = t(bot.repoLabel, language, t(SITE_COPY.common.moreInfo, language));
  const repoLink = bot.repoUrl
    ? `<a class="repo-link" href="${escapeHtml(bot.repoUrl)}">${escapeHtml(repoLabel)}</a>`
    : "";

  if (telegramUrl) {
    return `
      <div class="card-actions">
        <a class="card-link" href="${escapeHtml(telegramUrl)}" target="_blank" rel="noreferrer">${escapeHtml(t(SITE_COPY.common.openInTelegram, language))}</a>
        ${repoLink}
      </div>
    `;
  }

  return `
    <div class="card-actions">
      <span class="empty-state">${escapeHtml(t(SITE_COPY.common.telegramLinkComingSoon, language))}</span>
      ${repoLink}
    </div>
  `;
}

function renderHighlights(bot, language, live = false) {
  const statusClass = live ? "status-ready" : "status-soon";
  const status = t(bot.status, language);
  const highlights = t(bot.highlights, language, []);
  const pills = Array.isArray(highlights)
    ? highlights.map((item) => `<span class="detail-pill">${escapeHtml(item)}</span>`).join("")
    : "";

  return `
    <div class="detail-pills">
      <span class="detail-pill ${statusClass}">${escapeHtml(status)}</span>
      ${pills}
    </div>
  `;
}

function renderHandle(bot, language) {
  if (typeof bot.telegramHandle !== "string" || !bot.telegramHandle.trim()) {
    return "";
  }

  return `<p class="telegram-handle">${escapeHtml(t(SITE_COPY.common.telegramLabel, language))} • ${escapeHtml(bot.telegramHandle)}</p>`;
}

function renderFeatured(bot, language) {
  if (!bot || !featuredCard) {
    return;
  }

  const live = isLive(bot);

  featuredCard.innerHTML = `
    <div>
      <p class="kicker">${escapeHtml(t(bot.category, language))}</p>
      <h3>${escapeHtml(t(bot.name, language))}</h3>
      <p class="summary">${escapeHtml(t(bot.summary, language))}</p>
      ${renderActionLinks(bot, language)}
    </div>
    <div class="featured-side">
      <p class="meta-row">${escapeHtml(t(SITE_COPY.common.statusLabel, language))} • ${escapeHtml(t(bot.status, language))}</p>
      <p class="meta-row">${escapeHtml(t(SITE_COPY.common.formatLabel, language))} • ${escapeHtml(t(SITE_COPY.common.formatValue, language))}</p>
      ${renderHandle(bot, language)}
      ${renderHighlights(bot, language, live)}
    </div>
  `;
}

function renderGrid(items, language) {
  if (!botGrid) {
    return;
  }

  botGrid.innerHTML = items
    .map((bot) => {
      const live = isLive(bot);

      return `
        <article class="bot-card">
          <p class="kicker">${escapeHtml(t(bot.category, language))}</p>
          <h3>${escapeHtml(t(bot.name, language))}</h3>
          <p>${escapeHtml(t(bot.summary, language))}</p>
          ${renderHandle(bot, language)}
          ${renderHighlights(bot, language, live)}
          ${renderActionLinks(bot, language)}
        </article>
      `;
    })
    .join("");
}

function renderStats(items, language) {
  if (botCount) {
    botCount.textContent = String(items.length);
  }

  if (liveCount) {
    liveCount.textContent = String(items.filter(isLive).length);
  }

  setText("#bot-count-label", t(SITE_COPY.common.botCountLabel, language));
  setText("#live-count-label", t(SITE_COPY.common.liveCountLabel, language));
}

function updateToggleButtons(language) {
  if (!languageToggle) {
    return;
  }

  languageToggle.dataset.language = language;
  languageToggle.setAttribute("aria-pressed", language === "ru" ? "true" : "false");
}

function renderPageCopy(language) {
  const pageCopy = SITE_COPY.pages[pageName] || SITE_COPY.pages.home;
  const metaDescription = document.querySelector('meta[name="description"]');

  document.documentElement.lang = language;
  document.body.dataset.lang = language;
  document.title = t(pageCopy.title, language);

  if (metaDescription) {
    metaDescription.setAttribute("content", t(pageCopy.description, language));
  }

  setText("#eyebrow-text", t(pageCopy.eyebrow, language));
  setText("#site-title", t(pageCopy.siteTitle, language));
  setText("#site-copy", t(pageCopy.siteCopy, language));
  setText("#directory-eyebrow", t(SITE_COPY.common.directoryEyebrow, language));
  setText("#directory-title", t(SITE_COPY.common.directoryTitle, language));
  setText("#footer-copy", t(pageCopy.footer, language));

  setAttribute("#lang-toggle", "aria-label", t(SITE_COPY.common.languageToggleLabel, language));
  setAttribute("#stat-row", "aria-label", t(SITE_COPY.common.siteStatsLabel, language));
  setAttribute("#ticker", "aria-label", t(SITE_COPY.common.tickerLabel, language));
}

function persistLanguage(language) {
  try {
    window.localStorage.setItem(storageKey, language);
  } catch (error) {
    // Ignore storage failures and keep the page usable.
  }
}

function getInitialLanguage() {
  try {
    const storedLanguage = window.localStorage.getItem(storageKey);

    if (supportedLanguages.includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch (error) {
    // Ignore storage failures and fall back to browser language.
  }

  return navigator.language && navigator.language.toLowerCase().startsWith("ru") ? "ru" : "en";
}

function applyLanguage(language) {
  const nextLanguage = supportedLanguages.includes(language) ? language : "en";

  persistLanguage(nextLanguage);
  updateToggleButtons(nextLanguage);
  renderPageCopy(nextLanguage);
  renderTicker(nextLanguage);
  renderFeatured(featuredBot, nextLanguage);
  renderGrid(secondaryBots, nextLanguage);
  renderStats(bots, nextLanguage);
}

const featuredBot = bots.find((bot) => bot.featured) || bots[0];
const secondaryBots = bots.filter((bot) => bot !== featuredBot).slice(0, 3);

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    const currentLanguage = languageToggle.dataset.language === "ru" ? "ru" : "en";
    const nextLanguage = currentLanguage === "ru" ? "en" : "ru";
    applyLanguage(nextLanguage);
  });
}

applyLanguage(getInitialLanguage());
