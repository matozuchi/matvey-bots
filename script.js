const bots = Array.isArray(window.MATVEY_BOTS) ? window.MATVEY_BOTS : [];

const botGrid = document.querySelector("#bot-grid");
const featuredCard = document.querySelector("#featured-card");
const botCount = document.querySelector("#bot-count");
const liveCount = document.querySelector("#live-count");

const hasTelegramUrl = (value) => typeof value === "string" && value.trim().startsWith("https://t.me/");

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

function renderActionLinks(bot) {
  const repoLink = bot.repoUrl
    ? `<a class="repo-link" href="${escapeHtml(bot.repoUrl)}">${escapeHtml(bot.repoLabel || "More info")}</a>`
    : "";

  if (hasTelegramUrl(bot.telegramUrl)) {
    return `
      <div class="card-actions">
        <a class="card-link" href="${escapeHtml(bot.telegramUrl)}" target="_blank" rel="noreferrer">Open on Telegram</a>
        ${repoLink}
      </div>
    `;
  }

  return `
    <div class="card-actions">
      <span class="empty-state">Add Telegram link in bots.js</span>
      ${repoLink}
    </div>
  `;
}

function renderHighlights(highlights = [], status = "", isLive = false) {
  const statusClass = isLive ? "status-ready" : "status-soon";
  const statusText = escapeHtml(status);
  const pills = highlights
    .map((item) => `<span class="detail-pill">${escapeHtml(item)}</span>`)
    .join("");

  return `
    <div class="detail-pills">
      <span class="detail-pill ${statusClass}">${statusText}</span>
      ${pills}
    </div>
  `;
}

function renderFeatured(bot) {
  if (!bot || !featuredCard) {
    return;
  }

  const isLive = hasTelegramUrl(bot.telegramUrl);

  featuredCard.innerHTML = `
    <div>
      <p class="kicker">${escapeHtml(bot.category)} Desk</p>
      <h3>${escapeHtml(bot.name)}</h3>
      <p class="summary">${escapeHtml(bot.summary)}</p>
      ${renderActionLinks(bot)}
    </div>
    <div class="featured-side">
      <p class="meta-row">Status • ${escapeHtml(bot.status)}</p>
      <p class="meta-row">Format • Telegram bot</p>
      ${renderHighlights(bot.highlights, bot.status, isLive)}
    </div>
  `;
}

function renderGrid(items) {
  if (!botGrid) {
    return;
  }

  botGrid.innerHTML = items
    .map(
      (bot) => {
        const isLive = hasTelegramUrl(bot.telegramUrl);

        return `
        <article class="bot-card">
          <p class="kicker">${escapeHtml(bot.category)}</p>
          <h3>${escapeHtml(bot.name)}</h3>
          <p>${escapeHtml(bot.summary)}</p>
          ${renderHighlights(bot.highlights, bot.status, isLive)}
          ${renderActionLinks(bot)}
        </article>
      `
      }
    )
    .join("");
}

function renderStats(items) {
  if (botCount) {
    botCount.textContent = String(items.length);
  }

  if (liveCount) {
    liveCount.textContent = String(items.filter((item) => hasTelegramUrl(item.telegramUrl)).length);
  }
}

const featuredBot = bots.find((bot) => bot.featured) || bots[0];

renderFeatured(featuredBot);
renderGrid(bots);
renderStats(bots);
