# ⭐ Aarya's Learning Star

An interactive quiz and practice Progressive Web App (PWA) for **Aarya**, a Grade 3–4 student following the **Abeka curriculum**. Covers Math, English, Science, and Jamaican History/Social Studies with 15 questions per subject across Easy, Medium, and Hard difficulty levels.

## Features

- **4 Built-in Subjects** — Math, English, Science, and Jamaica-focused History
- **Multiple Question Types** — Multiple choice, true/false, and fill-in-the-blank
- **3 Difficulty Levels** — Easy, Medium, Hard
- **Text-to-Speech** — "Read to me" button on every question (Web Speech API)
- **Stars & Points** — Earn stars for correct answers, tracked across sessions
- **Progress Dashboard** — Stars per subject, accuracy %, and daily streak counter
- **Celebratory Animations** — Confetti bursts on quiz completion
- **Weekly Test Upload** — Parents upload an Abeka PDF; AI generates quiz questions
- **Works Offline** — Service worker caches all app assets after first load
- **Installable PWA** — Add to Home Screen on iPhone/iPad for a native app feel

## How to Run Locally

This is a vanilla HTML/CSS/JS app with **no build step required**. You just need a local HTTP server.

### Option 1: Python (built into macOS)

```bash
cd aaryas-learning-star
python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

### Option 2: Node.js (if installed)

```bash
npx serve aaryas-learning-star
```

### Option 3: VS Code Live Server

Open the folder in VS Code and use the "Live Server" extension.

> **Important:** The app must be served over HTTP(S) — opening `index.html` directly as a file will not work (service worker and PWA features require a server).

## Install on iPhone / iPad

1. Open the app URL in **Safari** (e.g., `http://your-computer-ip:8080` on the same Wi-Fi, or after deploying to a host)
2. Tap the **Share** button (box with up arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

The app icon will appear on the Home Screen and open in full-screen standalone mode.

> For the best PWA experience on iOS, serve over HTTPS (e.g., deploy to Netlify, Vercel, or GitHub Pages).

## Parent Setup: PIN, API Key & Weekly PDF

### Setting the PIN

1. Tap the **⚙️ icon** on the home screen (top-right)
2. The first time, you'll be asked to **create a 4-digit PIN**
3. Enter any 4 digits — this protects the settings from accidental access
4. To reset the PIN later, enter the current PIN, then tap "Reset PIN"

### Claude API Key (for PDF → Quiz)

1. Enter the parent settings (⚙️ → enter PIN)
2. Paste your **Claude API key** in the "Claude API Key" field
   - Get one from [console.anthropic.com](https://console.anthropic.com/)
   - Uses model: `claude-sonnet-4-20250514`
3. The key is stored **only in localStorage on the device** — it is never sent anywhere except directly to the Anthropic API

### Uploading the Weekly Test PDF

1. Enter parent settings (⚙️ → enter PIN)
2. Tap **"Upload Weekly Test PDF"** and select the Abeka weekly test PDF
3. The app will:
   - Extract text from the PDF using **PDF.js** (client-side)
   - Send the text to the **Claude API** to generate 10–15 age-appropriate questions
   - Save the questions to localStorage
4. Aarya will see a highlighted **"📄 This Week's Test"** card on her home screen
5. Uploading a new PDF replaces the previous week's questions

> **Note:** PDF upload and AI question generation require an internet connection. All other features work offline.

## Project Structure

```
aaryas-learning-star/
├── index.html           # Main HTML with PWA meta tags
├── manifest.json        # PWA manifest
├── sw.js                # Service worker for offline caching
├── css/
│   ├── styles.css       # Main styles
│   └── animations.css   # CSS animations and transitions
├── js/
│   ├── questions.js     # Question bank (60+ questions across 4 subjects)
│   ├── storage.js       # LocalStorage manager (progress, stars, settings)
│   ├── tts.js           # Text-to-speech using Web Speech API
│   ├── confetti.js      # Canvas-based confetti celebration effects
│   ├── quiz.js          # Quiz engine (state, scoring, flow)
│   ├── screens.js       # Screen renderers (home, quiz, results, settings)
│   ├── pdf-upload.js    # PDF text extraction + Claude API integration
│   └── app.js           # Main app controller and navigation
├── icons/
│   ├── icon.svg         # Vector app icon
│   ├── icon-512.png     # 512×512 PNG icon
│   ├── icon-192.png     # 192×192 PNG icon
│   └── apple-touch-icon.png  # 180×180 iOS icon
└── README.md
```

## Tech Stack

- **Vanilla HTML / CSS / JavaScript** — no framework, no build step
- **PDF.js** (CDN) — client-side PDF text extraction
- **Claude API** (`claude-sonnet-4-20250514`) — AI-powered question generation from PDFs
- **Web Speech API** — text-to-speech for reading questions aloud
- **LocalStorage** — all progress, stars, and settings stored on-device
- **Service Worker** — offline caching for full PWA support

## Deploying

For a real install experience (HTTPS required for full PWA on iOS):

- **Netlify**: Drag and drop the `aaryas-learning-star` folder
- **Vercel**: `npx vercel aaryas-learning-star`
- **GitHub Pages**: Push to a repo and enable Pages in settings

## License

Built with love for Aarya. ⭐
