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

- 🧠 **AI-Powered Chat Interface** - ChatGPT-like conversational interface for trip planning
- 🎤 **Voice Input Support** - Speak your travel requests using Web Speech API
- 💬 **Chat History & Sessions** - Persistent chat history with session management
- 🧠 **Intelligent AI Agent** - Agentic AI that learns from interactions and remembers preferences
- 🗺️ **Dynamic Itinerary Creation** - Real-time personalized itinerary building
- 🗺️ **Local Insights** - Authentic recommendations from local experts and hidden gems
- ⏰ **Real-Time Adaptation** - Automatic adjustments for weather changes or delays
- 💳 **Flight & Hotel Cards** - Interactive cards for booking flights and hotels
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

### Backend & Authentication

- **Firebase**: Firebase Authentication and App Hosting integration
- **Google OAuth**: Firebase Auth with Google Sign-In integration
- **API Backend**: Custom API integration for chat and trip planning
- **Chat History API**: RESTful API for managing chat sessions and history

### Development Tools

- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/yarn support
- **Build Tool**: Next.js with Turbopack support
- **PDF Export**: jsPDF for itinerary export
- **Image Capture**: html2canvas for screenshots

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components (Radix-based)
│   ├── chat/            # Chat-related components
│   │   ├── chat-header.tsx       # Chat header with new chat button
│   │   ├── chat-history-panel.tsx # Chat history sidebar
│   │   ├── chat-input.tsx        # Message input with voice support
│   │   ├── chat-message.tsx      # Message display component
│   │   ├── flight-card.tsx       # Flight booking cards
│   │   ├── hotel-card.tsx        # Hotel booking cards
│   │   ├── quick-actions.tsx     # Quick action buttons
│   │   └── typing-indicator.tsx  # Loading animation
│   ├── logs/            # Logging components
│   ├── hero-section.tsx # Landing page hero
│   ├── features-section.tsx
│   ├── pricing-section.tsx
│   ├── google-auth.tsx  # Google authentication
│   └── ...
├── hooks/               # Custom React hooks
│   ├── use-chat-history.ts  # Chat history management
│   ├── use-auth-protection.ts # Auth protection
│   └── ...
├── lib/                 # Utility functions
│   ├── firebase.ts           # Firebase initialization
│   ├── chat-api-service.ts   # Chat API integration
│   ├── chat-history-service.ts # Chat history service
│   ├── auth-service.ts       # Authentication service
│   └── ...
├── pages/               # Next.js pages
│   ├── api/            # API routes
│   ├── chat/           # Chat pages
│   │   ├── chat.tsx    # Main chat page
│   │   └── [id].tsx    # Chat session page
│   ├── _app.tsx        # App wrapper
│   └── index.tsx       # Home page
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or higher
- npm or yarn package manager
- Firebase project with Authentication enabled
- Google OAuth credentials configured in Firebase Console
- API backend URL (if using custom API)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/AnTIdoTe003/gen-ai-frontend.git
   cd gen-ai-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://trip.debmalya.in/

   # Google OAuth (via Firebase)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
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

### 💬 Chat Interface

- **ChatGPT-like Interface**: Clean, modern conversational UI for trip planning
- **Voice Input**: Web Speech API integration for hands-free travel requests
- **Chat History**: Persistent conversation history with session management
- **Quick Actions**: Pre-defined buttons for common trip planning tasks
- **Real-time Responses**: Instant AI responses with typing indicators
- **Message Management**: Copy messages, search history, and manage sessions

### 🔐 Authentication

- Firebase Authentication with Google OAuth integration
- Secure user session management
- Protected routes with authentication checks
- Seamless sign-in/sign-out experience

### 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Beautiful animations and transitions
- Dark/light theme support with next-themes
- Optimized for all screen sizes including mobile devices
- Touch-friendly interface components

### 🎯 User Experience

- Intuitive conversational trip planning
- Real-time itinerary adjustments
- Interactive flight and hotel cards
- Integrated booking system
- Multilingual support
- Keyboard shortcuts (Cmd/Ctrl + K for new chat)

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel --prod
```

### Firebase App Hosting

The project includes `apphosting.yaml` configuration for Firebase App Hosting deployment.

```bash
# Deploy to Firebase App Hosting
firebase deploy --only hosting
```

### Google Cloud Run

- Optimized Dockerfile included
- Supports automatic scaling
- Cost-effective for variable traffic

### Traditional Hosting

- Build static files with `npm run build`
- Deploy to any static hosting provider

## 📚 Additional Documentation

- [Chat Feature Documentation](./CHAT_FEATURE.md) - Detailed guide to the chat interface
- [Chat History API](./CHAT_HISTORY_API.md) - API integration guide for chat history
- [Voice Input Improvements](./VOICE_INPUT_IMPROVEMENTS.md) - Voice input feature documentation
- [Quick Suggestions Enhancement](./QUICK_SUGGESTIONS_ENHANCEMENT.md) - Quick actions documentation

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
- **Firebase** for authentication and hosting services
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
    <a href="https://tripcraft.debmalya.in/">🌐 Visit TripCraft AI</a> •
    <a href="https://twitter.com/tripcraft_ai">🐦 Follow us on Twitter</a> •
    <a href="https://linkedin.com/company/tripcraft-ai">💼 LinkedIn</a>
  </p>
</div>
