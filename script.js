const bots = Array.isArray(window.MATVEY_BOTS) ? window.MATVEY_BOTS : [];

const botGrid = document.querySelector("#bot-grid");
const featuredCard = document.querySelector("#featured-card");
const botCount = document.querySelector("#bot-count");
const liveCount = document.querySelector("#live-count");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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

function renderActionLinks(bot) {
  const telegramUrl = getTelegramUrl(bot);
  const repoLink = bot.repoUrl
    ? `<a class="repo-link" href="${escapeHtml(bot.repoUrl)}">${escapeHtml(bot.repoLabel || "More info")}</a>`
    : "";

  if (telegramUrl) {
    return `
      <div class="card-actions">
        <a class="card-link" href="${escapeHtml(telegramUrl)}" target="_blank" rel="noreferrer">Open in Telegram</a>
        ${repoLink}
      </div>
    `;
  }

  return `
    <div class="card-actions">
      <span class="empty-state">Telegram link coming soon</span>
      ${repoLink}
    </div>
  `;
}

function renderHighlights(highlights = [], status = "", live = false) {
  const statusClass = live ? "status-ready" : "status-soon";
  const pills = highlights
    .map((item) => `<span class="detail-pill">${escapeHtml(item)}</span>`)
    .join("");

  return `
    <div class="detail-pills">
      <span class="detail-pill ${statusClass}">${escapeHtml(status)}</span>
      ${pills}
    </div>
  `;
}

function renderHandle(bot) {
  if (typeof bot.telegramHandle !== "string" || !bot.telegramHandle.trim()) {
    return "";
  }

  return `<p class="telegram-handle">Telegram • ${escapeHtml(bot.telegramHandle)}</p>`;
}

function renderFeatured(bot) {
  if (!bot || !featuredCard) {
    return;
  }

  const live = isLive(bot);

  featuredCard.innerHTML = `
    <div>
      <p class="kicker">${escapeHtml(bot.category)}</p>
      <h3>${escapeHtml(bot.name)}</h3>
      <p class="summary">${escapeHtml(bot.summary)}</p>
      ${renderActionLinks(bot)}
    </div>
    <div class="featured-side">
      <p class="meta-row">Status • ${escapeHtml(bot.status)}</p>
      <p class="meta-row">Format • Telegram bot</p>
      ${renderHandle(bot)}
      ${renderHighlights(bot.highlights, bot.status, live)}
    </div>
  `;
}

function renderGrid(items) {
  if (!botGrid) {
    return;
  }

  botGrid.innerHTML = items
    .map((bot) => {
      const live = isLive(bot);

      return `
        <article class="bot-card">
          <p class="kicker">${escapeHtml(bot.category)}</p>
          <h3>${escapeHtml(bot.name)}</h3>
          <p>${escapeHtml(bot.summary)}</p>
          ${renderHandle(bot)}
          ${renderHighlights(bot.highlights, bot.status, live)}
          ${renderActionLinks(bot)}
        </article>
      `;
    })
    .join("");
}

function renderStats(items) {
  if (botCount) {
    botCount.textContent = String(items.length);
  }

  if (liveCount) {
    liveCount.textContent = String(items.filter(isLive).length);
  }
}

const featuredBot = bots.find((bot) => bot.featured) || bots[0];

renderFeatured(featuredBot);
renderGrid(bots);
renderStats(bots);
