<div align="center">

<img src="https://img.shields.io/badge/StyleAI-The%20Future%20of%20AI%20Fashion-D4AF37?style=for-the-badge&logoColor=white" />

# ✦ StyleAI — Your Personal AI Fashion Stylist

### *The Future of AI-Powered Fashion Intelligence*

> Upload your fashion pieces, discover curated outfit recommendations, explore personalized styling inspiration, and transform your wardrobe with intelligent AI-powered fashion insights.

<br/>

[![License](https://img.shields.io/badge/License-MIT-D4AF37?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-white?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Active-4CAF50?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-D4AF37?style=flat-square)]()
[![AI Powered](https://img.shields.io/badge/AI-Claude%20Powered-black?style=flat-square&logo=anthropic)](https://anthropic.com)

<br/>

---

### 🌐 [Live Demo](https://fashion-styleai.lovable.app/) &nbsp;&nbsp;

---

</div>

<br/>

## 📸 Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="screenshots/landing.png" alt="Landing Page" width="100%" style="border-radius:8px"/>
      <p align="center"><b>Landing Page & Sign Up</b></p>
    </td>
    <td width="50%">
      <img src="screenshots/home.png" alt="Home Dashboard" width="100%" style="border-radius:8px"/>
      <p align="center"><b>Fashion Intelligence – Home</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="screenshots/ai-stylist.png" alt="AI Stylist" width="100%" style="border-radius:8px"/>
      <p align="center"><b>AI Stylist — Upload & Analyze</b></p>
    </td>
    <td width="50%">
      <img src="screenshots/my-closet.png" width="100%" style="border-radius:8px"/>
      <p align="center"><b>My Closet — Wardrobe Management</b></p>
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <img src="screenshots/archive.png" alt="Fashion Archive" width="100%" style="border-radius:8px"/>
      <p align="center"><b>Fashion Archive — Editorial Collection</b></p>
    </td>
  </tr>
</table>

<br/>

---

## 🌟 Overview

**StyleAI** is a full-stack AI-powered fashion platform that acts as your personal stylist. It leverages computer vision and large language models to analyze clothing items, generate personalized outfit recommendations, and deliver curated editorial fashion content — all in a sleek, luxury dark-themed interface.

The platform combines **real-time weather data**, **AI image analysis**, and a **personal wardrobe management system** to help users dress smarter, not harder.

<br/>

---

## ✦ Core Features

### 🤖 AI Stylist
- **Visual Fashion Analysis** — Upload any clothing item image (JPG, PNG, WEBP); the AI analyzes style, color, fabric type, and aesthetic category
- **Style This Item** — Get full outfit recommendations built around your uploaded piece
- **Discover Similar** — Find visually similar items and alternative styles
- **Complete Outfit** — Auto-generate a head-to-toe outfit based on one item
- **Occasion Styling** — Get outfit suggestions tailored to specific events (Casual, Party, Formal, Workout, etc.)
- **Seasonal Picks** — Weather-aware wardrobe recommendations

### 🌦️ Weather-Integrated Dressing
- Real-time weather display in the navbar (temperature + condition)
- "Dress for today's weather!" toggle in My Closet
- Dynamic outfit recommendations that adapt to current weather conditions

### 👔 My Closet — Wardrobe Management
- Personal digital wardrobe with item categorization
- Wardrobe Essentials section for curated basics
- Style Concierge: one-click outfit generation based on occasion, weather, and personal style
- Occasion filters: Casual, Party, Formal, Workout, Summer, Winter, Articles

### 📰 The Style Journal (Home)
- Curated editorial fashion content
- Emerging trends & timeless style inspiration
- Bookmarkable fashion articles
- Magazine-style layout with featured imagery

### 🗄️ The Fashion Archive
- Complete collection of timeless fashion editorials
- Modern luxury curation and evolving style culture
- Full archive browsing with featured story highlights
- Membership-gated premium content

### 🔐 Authentication System
- Sign Up / Log In with email + password
- Account creation flow with clean onboarding UI
- Session persistence across the app

### 🎨 Design System
- Luxury dark theme: deep blacks (`#0a0a0a`) with gold accents (`#D4AF37`)
- Fully responsive layout
- Floating AI assistant button (sparkle icon) available on every page
- Consistent typography pairing serif display with elegant body text

<br/>

---

## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js** | Component-based UI framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Page transitions & micro-animations |
| **React Router v6** | Client-side routing (Home, AI Stylist, My Closet, Archive) |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express** | REST API server |
| **PostgreSQL** | User data, wardrobe items, bookmarks |
| **Prisma ORM** | Database schema & queries |
| **JWT** | Authentication tokens |
| **Multer** | Image upload handling |
| **Cloudinary** | Cloud image storage & CDN |

### AI & Intelligence
| Technology | Purpose |
|---|---|
| **Anthropic Claude API** | Fashion analysis, outfit generation, style recommendations |
| **Claude Vision** | Image understanding for uploaded clothing items |
| **OpenWeatherMap API** | Real-time weather data for weather-aware recommendations |

### DevOps & Tooling
| Technology | Purpose |
|---|---|
| **Vite** | Frontend build tool |
| **Docker** | Containerization |
| **Vercel** | Frontend deployment |
| **Railway / Render** | Backend deployment |
| **GitHub Actions** | CI/CD pipeline |
| **ESLint + Prettier** | Code quality & formatting |

<br/>

---

## 🗂️ Project Structure

```
styleai/
├── client/                          # React frontend
│   ├── public/
│   │   └── assets/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/              # Top navigation with weather widget
│   │   │   ├── AuthModal/           # Sign Up / Log In modal
│   │   │   ├── FloatingAI/          # Floating sparkle AI button
│   │   │   ├── StyleCard/           # Fashion article card
│   │   │   └── UploadZone/          # Drag & drop image uploader
│   │   ├── pages/
│   │   │   ├── Landing/             # Landing page with hero + auth
│   │   │   ├── Home/                # The Style Journal
│   │   │   ├── AIStylist/           # AI upload & recommendation page
│   │   │   ├── MyCloset/            # Wardrobe management
│   │   │   └── Archive/             # Fashion Archive editorial page
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useWeather.ts
│   │   │   └── useWardrobe.ts
│   │   ├── services/
│   │   │   ├── api.ts               # Axios API client
│   │   │   └── claude.ts            # Claude API integration
│   │   ├── store/                   # Zustand global state
│   │   └── styles/
│   │       └── globals.css
│
├── server/                          # Express backend
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── wardrobeController.ts
│   │   └── stylistController.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── wardrobe.ts
│   │   └── stylist.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   └── upload.ts
│   ├── prisma/
│   │   └── schema.prisma
│   └── utils/
│       ├── claudeClient.ts
│       └── weatherClient.ts
│
├── docs/
│   └── screenshots/
├── .env.example
├── docker-compose.yml
├── README.md
└── package.json
```

<br/>

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- PostgreSQL `v14+`
- An [Anthropic API Key](https://console.anthropic.com/)
- A [OpenWeatherMap API Key](https://openweathermap.org/api)
- A [Cloudinary Account](https://cloudinary.com/)

<br/>

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/styleai.git
cd styleai
```

**2. Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install
```

**3. Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/styleai"

# Auth
JWT_SECRET="your-super-secret-jwt-key"

# Anthropic AI
ANTHROPIC_API_KEY="sk-ant-..."

# Weather
OPENWEATHER_API_KEY="your-openweather-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Client
VITE_API_BASE_URL="http://localhost:3001"
```

**4. Set up the database**
```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

**5. Run the development servers**
```bash
# From project root — runs client + server concurrently
npm run dev
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://localhost:3001` |
| Prisma Studio | `http://localhost:5555` |

<br/>

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create new account |
| `POST` | `/api/auth/login` | Log in, returns JWT |
| `GET` | `/api/auth/me` | Get current user profile |

### AI Stylist
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/stylist/analyze` | Upload image → AI style analysis |
| `POST` | `/api/stylist/outfit` | Generate complete outfit |
| `POST` | `/api/stylist/similar` | Discover similar items |
| `POST` | `/api/stylist/occasion` | Occasion-specific styling |

### Wardrobe
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/wardrobe` | Get all wardrobe items |
| `POST` | `/api/wardrobe` | Add item to wardrobe |
| `DELETE` | `/api/wardrobe/:id` | Remove item |
| `POST` | `/api/wardrobe/outfit` | Generate outfit from wardrobe |

### Weather
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weather?lat=&lon=` | Get weather for location |

<br/>

---

## 🧠 How the AI Works

```
User uploads image
        │
        ▼
Image uploaded to Cloudinary (returns URL)
        │
        ▼
URL + user context sent to Claude Vision API
        │
        ▼
Claude analyzes:
  • Garment type & category
  • Color palette & tones
  • Style aesthetic (minimalist, streetwear, formal, etc.)
  • Fabric & texture estimation
  • Occasion suitability
        │
        ▼
Claude generates:
  • Outfit completion suggestions
  • Complementary piece recommendations
  • Occasion-specific styling notes
  • Seasonal appropriateness
  • Weather-aware adjustments (if enabled)
        │
        ▼
Structured response rendered in Style Preview panel
```

<br/>

---

## 🎨 Design Language

StyleAI uses a carefully crafted luxury dark aesthetic:

| Token | Value | Usage |
|---|---|---|
| Background | `#0a0a0a` | Page background |
| Surface | `#141414` | Cards, panels |
| Border | `#1f1f1f` | Dividers, outlines |
| Gold Primary | `#D4AF37` | CTAs, accents, highlights |
| Gold Muted | `#B8962E` | Hover states |
| Text Primary | `#FFFFFF` | Headings |
| Text Secondary | `#9CA3AF` | Body, captions |
| Display Font | `Playfair Display` | Headlines & hero text |
| Body Font | `Cormorant Garamond` | Italic descriptive text |
| UI Font | `Montserrat` | Labels, nav, buttons |

<br/>

---

## 🌍 Pages Overview

| Page | Route | Description |
|---|---|---|
| **Landing** | `/` | Hero + sign up / log in modal |
| **Home** | `/home` | The Style Journal — editorial content |
| **AI Stylist** | `/stylist` | Upload item → AI recommendations |
| **My Closet** | `/closet` | Wardrobe management + outfit generator |
| **Archive** | `/archive` | Full fashion editorial archive |

<br/>

---

## 🔒 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret for signing JWT tokens |
| `ANTHROPIC_API_KEY` | ✅ | Claude API key |
| `OPENWEATHER_API_KEY` | ✅ | Weather data API key |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `VITE_API_BASE_URL` | ✅ | Backend API base URL |
| `PORT` | ❌ | Server port (default: 3001) |

<br/>

---

## 🛣️ Roadmap

- [x] Landing page with authentication
- [x] AI Stylist with image upload
- [x] Weather-aware outfit recommendations
- [x] My Closet wardrobe management
- [x] Fashion Archive editorial section
- [ ] Social sharing — share outfits to feed
- [ ] Style Mood Board — save & organize inspo
- [ ] Shopping integration — buy recommended items
- [ ] Mobile app (React Native)
- [ ] Try-On simulation (AI virtual fitting)
- [ ] Style profile & preference learning
- [ ] Multi-language support

<br/>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request**

Please make sure your PR follows the existing code style and includes relevant tests.

<br/>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

## 👤 Author

<div align="center">

  <tr>
    <td align="center">
      <a href="https://github.com/NirmitPrasad">
        <img src="https://github.com/NirmitPrasad.png" width="100px;" alt="Nirmit Prasad"/><br />
        <sub><b>Nirmit Prasad</b></sub>
      </a><br />
      <sub>💻 Software Developer</sub>
    </td>
  </tr>



<br/>
<br/>

[![GitHub](https://img.shields.io/badge/GitHub-NirmitPrasad-black?style=flat-square&logo=github)](https://github.com/NirmitPrasad)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=flat-square&logo=linkedin)](www.linkedin.com/in/nirmitprasad)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-D4AF37?style=flat-square)](https://nirmitprasad.in/)

</div>

<br/>

---

<div align="center">

<sub>✦ StyleAI — The Future of AI Fashion ✦</sub>

</div>
