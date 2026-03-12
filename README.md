# Matvey's Bots

Static homepage for your Telegram bot directory, designed with a news-site look and ready for free hosting.

## Best free hosting option

For this version, use **GitHub Pages**.

Why:

- Free for a simple static site
- No server or database needed
- Very easy to update when you add a new bot
- Works directly from this folder with no build step

If you later want a custom domain, analytics, or edge features, **Cloudflare Pages** is the best alternative.

## Files to edit

- `bots.js`: add or update your Telegram bot links
- `index.html`: page structure
- `styles.css`: design
- `script.js`: renders the bot cards from `bots.js`

## Add your Telegram links

Open `bots.js` and replace each empty `telegramUrl` value with the real Telegram link:

```js
telegramUrl: "https://t.me/your_bot_username"
```

To add another bot, duplicate one object in the array and change the values.

## Publish on GitHub Pages

1. Create a new GitHub repository.
2. Upload the contents of this folder.
3. In GitHub, open `Settings` -> `Pages`.
4. Under `Build and deployment`, choose `Deploy from a branch`.
5. Select your main branch and `/ (root)`.
6. Save.

GitHub will publish the site at a URL like:

`https://your-github-username.github.io/your-repo-name/`

## Local preview

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open:

`http://localhost:8000`
