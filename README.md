# CARI PROMPT — AI Reverse-Engineering & Prompt Generation Web App

A full replica and enhanced version of [cariprompt.com](https://cariprompt.com), featuring **11 complete AI Prompt Tools** built with Next.js (App Router), TypeScript, Tailwind CSS, and custom prompt engines specifically optimized for **Google Flow (Google Veo & Google Imagen 3)**, Midjourney v6.1, Kling, and Sora.

---

## 🚀 Key Highlights & Google Flow Integration

1. **Google Flow (Google Veo) Director Prompt Engine**:
   - Converts uploaded videos and clips into rich, temporal-action, multi-angle camera directions ("push-in dolly zoom", "orbital pan", "volumetric rim lighting", "specular reflections").
   - Outputs both English technical prompts (ready to copy into Google Flow) and Indonesian explanations.

2. **Google Flow (Google Imagen 3) & Midjourney Engine**:
   - Reconstructs visual styles, lighting setups, camera lenses (85mm f/1.4, 35mm anamorphic), and color palettes from reference photos.

3. **Complete Suite of 11 AI Tools**:
   - **Cari Prompt Gambar** (`/gambar`): Vision prompt extraction for Imagen 3 & Midjourney.
   - **Shorts Video Prompt** (`/shortsvideo`): Short reels & timelapse extractor for Google Veo & Kling.
   - **Long Video Prompt** (`/longvideo`): Multi-scene cinematic video breakdown.
   - **Storyboard Produk** (`/storyboard`): 3-beat script (Hook, Demo, CTA) for TikTok Shop & Shopee Video.
   - **Poster Infografis** (`/poster-infografis`): 20-point structure infographic generator.
   - **Sales Page Generator** (`/sales-page`): 16-section high-converting sales copywriter (AIDA / PAS).
   - **Buku Mewarnai** (`/coloring-book-prompt`): 10–16 page children's coloring book with printable PDF (@media print).
   - **Game Interaktif** (`/game-prompt`): Single-file HTML5/CSS/JavaScript canvas game generator.
   - **Style Detection** (`/style-detection`): Visual attribute & lighting detector with similarity slider.
   - **Prompt Optimizer** (`/prompt-optimizer`): Prompt upgrade engine for Gemini, ChatGPT, and Claude.
   - **Prompt to Image** (`/prompt-to-image`): Text-to-image studio interface.

4. **Authentic Showcase Carousel**:
   - Preloaded with 6 real showcase items (videos and images) streaming directly from the original edge storage with one-click copy and full-screen inspection modals.

5. **Mobile-First Responsive Design**:
   - Neo-brutalist dark aesthetic (`#0a0a0c`), electric lime neon accents (`#d4f933`), Inter typography, and Roboto Mono badges.

---

## 🛠️ Quick Start

### 1. Development Mode
```bash
cd "D:\Projects\REA cariprompt"
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Production Build & Run
```bash
npm run build
npm run start -p 3000
```

### 3. Optional: Configure Google Gemini API Key
To enable live AI vision multimodal analysis via Gemini 2.5 Flash, add your key to `.env.local`:
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```
*(If no API key is set, the app runs in intelligent instant reconstruction mode).*

---

## 📁 Project Structure

```
D:\Projects\REA cariprompt/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts     # Central LLM & Vision generation API
│   │   ├── coloring-book-prompt/     # Buku Mewarnai tool
│   │   ├── gambar/                   # Cari Prompt Gambar tool
│   │   ├── game-prompt/              # Game Interaktif tool
│   │   ├── longvideo/                # Long Video Prompt tool
│   │   ├── poster-infografis/        # Poster Infografis tool
│   │   ├── prompt-optimizer/         # Prompt Optimizer tool
│   │   ├── prompt-to-image/          # Prompt to Image tool
│   │   ├── sales-page/               # Sales Page Generator tool
│   │   ├── shortsvideo/              # Shorts Video Prompt tool
│   │   ├── storyboard/               # Storyboard Produk tool
│   │   ├── style-detection/          # Style Detection tool
│   │   ├── globals.css               # CariPrompt dark/neon design tokens
│   │   ├── layout.tsx                # Root layout with Inter & Roboto Mono
│   │   └── page.tsx                  # Home landing page
│   ├── components/
│   │   ├── Navbar.tsx                # Dropdown menu (11 tools) + mobile drawer
│   │   ├── HeroSection.tsx           # Mobile-first hero banner
│   │   ├── ShowcaseCarousel.tsx      # Video/image carousel with 1-click copy
│   │   ├── ToolCardsGrid.tsx         # 11 interactive tool cards
│   │   ├── PricingAndFaqSection.tsx  # Pricing cards & accordion FAQ
│   │   └── Footer.tsx                # Branding & navigation links
│   ├── data/
│   │   ├── showcase.ts               # 6 preloaded showcase items & edge media
│   │   └── tools.ts                  # Metadata for all 11 AI tools
│   └── lib/
│       ├── promptEngines.ts          # Core prompt engineering algorithms
│       └── utils.ts                  # Tailwind class merger
├── .env.example
├── .env.local
├── package.json
└── tsconfig.json
```
