# Deployment Guide - CPX QLND Game

## Overview

Deploy Online PvP game requires:
- **Frontend**: GitHub Pages (free) or Vercel
- **Backend**: Render, Railway, or Fly.io (free tier)

---

## Option 1: Deploy Backend on Render (Free)

### Step 1: Prepare Backend Files

Create `server/package.json`:

```json
{
  "name": "cpx-qlnd-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "tsx src/index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "express": "^5.2.1",
    "socket.io": "^4.8.3",
    "cors": "^2.8.6"
  },
  "devDependencies": {
    "tsx": "^4.21.0",
    "typescript": "^5.0.2"
  }
}
```

Create `server/.production` file:

```bash
PORT=3001
NODE_ENV=production
```

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 3: Deploy on Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **New +** → **Web Service**
4. Connect your GitHub repo
5. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `PORT`: `3001`

6. Click **Deploy Web Service**

7. After deployment, get your backend URL (e.g., `https://cpx-qlnd-server.onrender.com`)

---

## Option 2: Deploy Frontend on GitHub Pages

### Step 1: Update vite.config.ts

Add base path for GitHub Pages:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/cpx-qlnd/', // Replace with your repo name
  server: {
    allowedHosts: ['all'],
    strictPort: true,
  },
})
```

### Step 2: Deploy

```bash
# Make deploy script executable
chmod +x deploy-frontend.sh

# Deploy
./deploy-frontend.sh
```

Or manually:

```bash
npm run build
git add dist
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

### Step 3: Enable GitHub Pages

1. Go to repo **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **gh-pages** → **/ (root)**
4. Save

Your frontend URL: `https://yourusername.github.io/cpx-qlnd/`

---

## Step 3: Update CORS on Backend

Update `server/src/index.ts`:

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:5173',
      /\.ngrok-free\.app$/,
      'https://yourusername.github.io', // Add your GitHub Pages URL
      'https://cpx-qlnd-server.onrender.com', // Add your Render URL
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
```

---

## Option 3: Full Stack on Vercel (Easier)

### Deploy Both Frontend + Backend

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Create `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/socket.io/(.*)",
      "dest": "http://localhost:3001/socket.io/$1"
    }
  ]
}
```

3. Deploy:
```bash
vercel
```

---

## Testing Deployment

1. Update your game's socket URL:
```javascript
// In .env or directly in code
const SOCKET_URL = 'https://cpx-qlnd-server.onrender.com';
```

2. Test invite link:
```
https://yourusername.github.io/cpx-qlnd/?server=https://cpx-qlnd-server.onrender.com
```

---

## Free Hosting Options

| Service | Frontend | Backend | Free Tier | Notes |
|---------|----------|---------|-----------|-------|
| **GitHub Pages** | ✅ | ❌ | ✅ | Static only |
| **Vercel** | ✅ | ✅ | ✅ | Easiest, 100GB bandwidth |
| **Netlify** | ✅ | ⚠️ | ✅ | Functions only |
| **Render** | ❌ | ✅ | ✅ | Best for Node.js |
| **Railway** | ❌ | ✅ | ✅ | $5 credit/month |
| **Fly.io** | ❌ | ✅ | ✅ | 3 VMs free |

---

## Quick Start (Recommended)

**Fastest way** - Use Vercel for both:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Follow prompts to deploy
```

Vercel will auto-detect your frontend + backend and deploy both!
