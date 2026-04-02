# L'Oreal Chatbot - Setup Instructions

## Overview

This chatbot requires a backend service to securely handle OpenAI API calls. For GitHub Pages deployment, use **Cloudflare Workers** as a proxy.

## Why Cloudflare Workers?

- **Security**: Your OpenAI API key stays on the server, not exposed in the browser
- **Free tier**: Cloudflare Workers has a generous free tier (100,000 requests/day)
- **Easy deployment**: Simple copy-paste setup

## Setup Steps

### 1. Create a Cloudflare Account

- Go to https://dash.cloudflare.com/signup
- Sign up with your email (free plan is fine)

### 2. Create a Cloudflare Worker

1. Log in to https://dash.cloudflare.com
2. Click **"Workers & Pages"** in the sidebar
3. Click **"Create application"** → **"Create a Worker"**
4. Choose a name (e.g., `loreal-chatbot-worker`)
5. Click **"Deploy"**

### 3. Deploy the Worker Code

1. In the Cloudflare dashboard, click on your newly created worker
2. Click **"Edit code"**
3. Replace all code with the content from `RESOURCE_cloudflare-worker.js` in this repo
4. Click **"Save and Deploy"**

### 4. Add Your OpenAI API Key

1. In the Cloudflare Workers dashboard, click **"Settings"** tab
2. Under **"Environment Variables"**, click **"Add variable"**
3. Name: `OPENAI_API_KEY`
4. Value: [Paste your OpenAI API key from https://platform.openai.com/account/api-keys]
5. Keep the encryption checkbox selected
6. Click **"Encrypt and save"**

### 5. Update Your Website Code

1. Open `script.js` in your repo
2. Find this line: `const apiUrl = "https://YOUR_WORKER_NAME.YOUR_USERNAME.workers.dev";`
3. Replace `YOUR_WORKER_NAME` and `YOUR_USERNAME` with your actual details:
   - Your worker URL appears in the Cloudflare dashboard (e.g., `https://loreal-chatbot-worker.john-smith.workers.dev`)

### 6. Deploy to GitHub Pages

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Configure Cloudflare Worker for API proxy"
   git push
   ```
2. GitHub Pages will automatically deploy your site

## Testing

1. Visit your GitHub Pages URL
2. Try asking the chatbot a question
3. If you see "Chatbot not configured" message after step 5 above, double-check your worker URL

## Troubleshooting

**"Chatbot not configured" error**

- Make sure you updated the `apiUrl` in `script.js` with your actual Cloudflare Worker URL
- URL must not contain `YOUR_` placeholders

**CORS errors**

- The CORS headers in `RESOURCE_cloudflare-worker.js` should handle this
- Verify the worker is deployed and accessible

**API key errors from OpenAI**

- Verify your OpenAI API key is correct
- Check it's saved as an environment variable in Cloudflare (not hardcoded)
- Ensure your OpenAI account has remaining credits

## Security Notes

- ✅ Never commit `secrets.js` to GitHub
- ✅ API key is stored securely in Cloudflare environment variables
- ✅ Browser code never sees the API key
- ✅ File `.gitignore` prevents accidental commits
