# Peinture (AI Image Gen)

A sleek, dark-themed AI image generator built with React, TypeScript, and Tailwind CSS. This application leverages powerful Hugging Face models (Z-Image Turbo, Qwen Image Fast) to generate high-quality images from text prompts in seconds.

![App Screenshot](https://cdn.xiangfa.org/upload/WX20251206-170626@2x.png)

## ✨ Features

- **Multi-Model Support**: Switch between `Z-Image Turbo` and `Qwen Image Fast` for different generation styles and speeds.
- **Prompt Optimization**: Integrated AI prompt enhancer that expands simple ideas into detailed, cinematic descriptions.
- **History Gallery**: Automatically saves generated images locally. View, zoom, pan, and manage your creation history.
- **Interactive Viewer**: Zoom and pan capabilities for detailed image inspection.
- **4x Resolution**: Using AI technology, any image can be upscaled 4x resolution, achieving a maximum image quality of 8K.
- **Multilingual**: Full support for English and Chinese (中文) interfaces.
- **Hugging Face Integration**: Optional API token support for higher rate limits.
- **Privacy Focused**: History is stored in your browser's LocalStorage; no backend database is required for user data.

## 🛠 Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animation**: CSS Transitions & Tailwind
- **APIs**:
  - Hugging Face Integration (Image Generate Engineering)
  - Pollinations.ai (Prompt Engineering)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Amery2010/peinture.git
   cd peinture
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

## 📦 Deployment

This project is a static Single Page Application (SPA), making it easy to deploy on any platform that supports static hosting.

### Option 1: Vercel (Recommended)

Vercel is optimized for frontend frameworks and requires zero configuration.

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Run the deploy command from the project root:
   ```bash
   vercel
   ```

3. Follow the prompts. Vercel will automatically detect Vite and set the build command to `npm run build` and the output directory to `dist`.

**Alternatively, via the Vercel Dashboard:**
1. Push your code to GitHub.
2. Import the repository in Vercel.
3. Keep the default "Framework Preset" as `Vite`.
4. Click **Deploy**.

### Option 2: Cloudflare Pages

Cloudflare Pages is the best way to host static assets on the Cloudflare network.

1. Push your code to a GitHub repository.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Compute (Workers & Pages)** > **Create Application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. In "Build settings":
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

### Option 3: Static CDN (Nginx, Apache, Netlify, S3)

To host on any standard web server or CDN:

1. Build the project locally:
   ```bash
   npm run build
   ```

2. This will generate a `dist` folder containing `index.html` and bundled assets.

3. Upload the **contents** of the `dist` folder to your server's public root directory (e.g., `/var/www/html` or an S3 bucket).

4. **Important for SPAs**: Ensure your server is configured to redirect all 404 requests to `index.html` so that React Router (if added in the future) or client-side logic handles the routing.

## ⚙️ Configuration

### Hugging Face Token (Optional)

The application works out-of-the-box using public quotas. However, for heavy usage, users can provide their own Hugging Face Read Token.

1. Click the **Settings** in the top right.
2. Paste your token in the "Hugging Face Token" field.
3. Click **Save**.

This token is stored securely in your browser's `localStorage` and is strictly used to authenticate requests to the Hugging Face Inference endpoints.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
