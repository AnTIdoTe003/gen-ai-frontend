# 🌟 TripCraft AI - Your Personalized Journey Awaits

> **Discover India like never before with AI-crafted itineraries tailored to your budget, interests, and time.**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)](https://www.docker.com/)

## 🚀 What is TripCraft AI?

TripCraft AI is a revolutionary travel planning platform that uses artificial intelligence to create personalized itineraries for exploring India. From heritage wonders to adventure thrills, our AI analyzes your preferences, budget, and time constraints to craft the perfect journey.

### ✨ Key Features

- 🧠 **AI-Powered Itineraries** - Advanced AI creates perfectly tailored travel plans
- 🗺️ **Local Insights** - Authentic recommendations from local experts and hidden gems
- ⏰ **Real-Time Adjustments** - Instant itinerary updates for weather changes or delays
- 💳 **One-Click Booking** - Integrated booking system for flights, hotels, and experiences
- 🌍 **Multilingual Support** - Available in Hindi, English, and 10+ regional languages
- ⚡ **Instant Planning** - Complete itinerary in under 2 minutes

### 📊 Platform Stats

- 🗺️ **500+** Destinations Covered
- ⏱️ **2 Min** Average Planning Time
- ✨ **10K+** Happy Travelers

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.5.2 with Pages Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.4.0 + tailwindcss-animate
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **Fonts**: Space Grotesk & DM Sans (Google Fonts)
- **Analytics**: Vercel Analytics

### Authentication & APIs

- **Google OAuth**: Google Sign-In integration
- **API Backend**: Custom API at `https://trip.debmalya.in/`

### Development Tools

- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/yarn support
- **Build Tool**: Next.js with Turbopack support

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix-based)
│   ├── hero-section.tsx # Landing page hero
│   ├── features-section.tsx
│   ├── pricing-section.tsx
│   ├── google-auth.tsx  # Google authentication
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── _app.tsx        # App wrapper
│   └── index.tsx       # Home page
└── styles/             # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/tripcraft-ai.git
   cd tripcraft-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your values:

   ```env
   NEXT_PUBLIC_API_URL=https://trip.debmalya.in/
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### 🐳 Docker Deployment

The project includes an optimized Dockerfile for production deployment, especially designed for Google Cloud Run.

**Build and run with Docker:**

```bash
# Build the image
docker build -t tripcraft-ai .

# Run locally
docker run -p 3000:3000 tripcraft-ai
```

**Deploy to Google Cloud Run:**

```bash
# Tag for Google Container Registry
docker tag tripcraft-ai gcr.io/YOUR_PROJECT_ID/tripcraft-ai

# Push to GCR
docker push gcr.io/YOUR_PROJECT_ID/tripcraft-ai

# Deploy to Cloud Run
gcloud run deploy tripcraft-ai \
  --image gcr.io/YOUR_PROJECT_ID/tripcraft-ai \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🎨 UI Components

The project uses a comprehensive design system built on Radix UI primitives:

- **Layout**: Cards, Separators, Aspect Ratio
- **Navigation**: Navigation Menu, Breadcrumbs, Pagination
- **Forms**: Input, Textarea, Select, Checkbox, Radio Group
- **Feedback**: Toast, Alert Dialog, Progress, Skeleton
- **Overlay**: Dialog, Popover, Tooltip, Hover Card
- **Data Display**: Table, Badge, Avatar, Carousel

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server
npm run lint         # Run ESLint

# Docker
docker build -t tripcraft-ai .    # Build Docker image
docker run -p 3000:3000 tripcraft-ai  # Run container
```

## 🌟 Features Deep Dive

### 🤖 AI-Powered Planning

- Analyzes user preferences, budget, and time constraints
- Considers weather, local events, and seasonal factors
- Provides detailed day-by-day itineraries with cost breakdowns

### 🔐 Authentication

- Google OAuth integration for secure sign-in
- Seamless user experience with one-click authentication
- Support for multiple authentication providers

### 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Beautiful animations and transitions
- Dark/light theme support with next-themes

### 🎯 User Experience

- Intuitive step-by-step planning process
- Real-time itinerary adjustments
- Integrated booking system
- Multilingual support

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod
```

### Google Cloud Run

- Optimized Dockerfile included
- Supports automatic scaling
- Cost-effective for variable traffic

### Traditional Hosting

- Build static files with `npm run build`
- Deploy to any static hosting provider

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for hosting and analytics
- **Google** for authentication services

## 📞 Support

- 📧 Email: support@tripcraft.ai
- 💬 Discord: [Join our community](https://discord.gg/tripcraft)
- 📖 Documentation: [docs.tripcraft.ai](https://docs.tripcraft.ai)

---

<div align="center">
  <p>Made with ❤️ for travelers who dream big</p>
  <p>
    <a href="https://tripcraft.ai">🌐 Visit TripCraft AI</a> •
    <a href="https://twitter.com/tripcraft_ai">🐦 Follow us on Twitter</a> •
    <a href="https://linkedin.com/company/tripcraft-ai">💼 LinkedIn</a>
  </p>
</div>
