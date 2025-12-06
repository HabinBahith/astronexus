# 🚀 AstroNexus - Mission Control for Space Exploration

A modern, real-time space exploration dashboard powered by NASA's APIs. Discover near-Earth objects, track the ISS, explore stunning space imagery, stay updated on space missions, and monitor space weather—all from one elegant interface.

**Live URL**: [Your Deployment URL]

---

## ✨ Features

### 🌍 **ISS Tracker**

- Real-time International Space Station position and altitude tracking
- Calculate next visible passes from your location
- View orbital information and velocity data
- Live telemetry updates

### 🌠 **Meteor Live**

- Browse near-Earth objects (NEOs) from NASA's NeoWs API
- View close-approach dates, distances, and impact velocities
- Explore detailed orbital elements (semi-major axis, eccentricity, inclination)
- Filter by hazard status and sort by proximity or size
- Auto-loads 7 days of meteorite data on initialization

### 🖼️ **Space Gallery**

- Search thousands of stunning images from NASA, ESA, and JWST
- Auto-loads curated space content (galaxies, nebulas) when empty
- Filter by source and sort by relevance or date
- High-resolution image previews with detailed metadata
- Download functionality

### 📰 **Space News & Weather**

- Real-time space weather alerts from NASA DONKI
- Kp Index and solar wind monitoring
- Latest space news and missions feed
- Solar activity tracking

### 🚀 **Missions**

- Upcoming and recent space launches
- Mission details: vehicle, provider, payload, and objectives
- Launch status and schedule information
- Links to mission pages and video coverage

### 🔭 **Telescope Data**

- Access to astronomical observation data
- Telescope imagery and analysis tools

### 🤖 **AI Explainer**

- Ask questions about space and astronomy
- Powered by Groq AI (with Mixtral model)
- Get instant explanations on complex space topics

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **State Management**: React Hooks + React Query
- **HTTP Client**: Fetch API with timeout handling
- **Build Tool**: Vite
- **APIs**:
  - NASA API (ISS, NEO, Gallery, Space Weather)
  - Launch Library API (Missions)
  - Groq AI API (Chat/Explainer)

---

## 📦 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx              # Navigation bar with all routes
│   ├── dashboard/
│   │   └── StatusBar.tsx           # Live system status display
│   ├── tracker/
│   │   └── ISSTracker.tsx          # ISS tracking interface
│   ├── MeteorLive/
│   │   ├── MeteorLive.tsx          # NEO browser UI
│   │   └── NeoDetailModal.tsx      # Detailed NEO info modal
│   ├── gallery/
│   │   ├── SpaceGallery.tsx        # Image search & filter
│   │   └── ImageCard.tsx           # Image preview card
│   ├── weather/
│   │   └── SpaceWeather.tsx        # Weather alerts
│   ├── missions/
│   │   └── MissionsFeed.tsx        # Mission listings
│   ├── ai/
│   │   └── AIExplainer.tsx         # AI chat interface
│   ├── space/
│   │   └── SolarSystemScene.tsx    # 3D visualization
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── api.ts                      # NASA APIs (ISS, Missions, Weather)
│   ├── meteorApi.ts                # NASA NeoWs API integration
│   ├── spaceGalleryApi.ts          # NASA Image library API
│   └── utils.ts                    # Utility functions
├── pages/
│   ├── Index.tsx                   # Home page
│   ├── Tracker.tsx                 # ISS Tracker page
│   ├── Meteor.tsx                  # Meteor/NEO page
│   ├── Gallery.tsx                 # Space Gallery page
│   ├── Weather.tsx                 # Space Weather page
│   ├── Missions.tsx                # Missions page
│   ├── Telescope.tsx               # Telescope page
│   ├── AIExplainerPage.tsx         # AI page
│   └── NotFound.tsx                # 404 page
├── types/
│   └── satellite-js.d.ts           # Satellite.js type definitions
├── hooks/
│   └── use-toast.ts                # Toast notifications
├── App.tsx                         # Main app routing
└── main.tsx                        # Entry point
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16+ and **npm** 7+
- NASA API Key (get free at https://api.nasa.gov)
- Groq API Key (optional, for AI features - get free at https://console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/HabinBahith/astronexus.git
cd astronexus

# Install dependencies
npm install

# Create .env file in project root
echo "VITE_NASA_API_KEY=your_nasa_api_key_here" > .env
echo "VITE_GROQ_API_KEY=your_groq_api_key_here" >> .env
```

### Running Locally

```bash
# Start development server (with hot reload)
npm run dev

# Open browser to http://localhost:5173 (or the port shown in terminal)
```

### Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Check for TypeScript errors
npm run type-check
```

---

## 🔑 API Configuration

### NASA API

1. Visit https://api.nasa.gov
2. Sign up for a free API key
3. Add to `.env`:
   ```
   VITE_NASA_API_KEY=your_key_here
   ```

### Groq API (Optional - for AI Explainer)

1. Visit https://console.groq.com
2. Sign up and create an API key
3. Add to `.env`:
   ```
   VITE_GROQ_API_KEY=your_key_here
   ```

---

## 📖 Usage Guide

### ISS Tracker

- Click **"ISS Tracker"** in the navbar
- Enter your latitude and longitude to calculate next pass
- View real-time position, altitude, and orbital info
- Updates refresh automatically

### Meteor Live

- Click **"Meteor"** in the navbar
- Auto-loads 7 days of near-Earth object data
- Use filters: Hazard Status, Sort By, Reset
- Click any object card to view detailed orbital data and approach history

### Space Gallery

- Click **"Gallery"** in the navbar
- Search bar auto-loads gallery images on empty search (galaxies, nebulas, space)
- Refine with Source (NASA/ESA/JWST) and Sort filters
- Click images to view full resolution and download

### Space News

- Click **"Space News"** in the navbar
- View real-time Kp Index and solar wind data
- Monitor space weather alerts and activity

### Missions

- Click **"Missions"** in the navbar
- View upcoming and recent space launches
- Filter and sort by date and status

### AI Explainer

- Click **"AI Explainer"** in the navbar
- Ask questions about space, astronomy, or NASA missions
- Select AI model (Groq Mixtral recommended)
- Get instant answers powered by AI

---

## 🎨 Design Features

- **Glass Morphism UI**: Modern frosted glass panels with backdrop blur
- **Cyan Glow Effects**: Glowing text and borders for space theme
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Dark Theme**: Eye-friendly dark space theme
- **Real-time Updates**: Live data feeds with auto-refresh
- **Smooth Animations**: Hover effects, transitions, and loading states

---

## 📊 Data Sources

| Feature       | API                | Update Frequency |
| ------------- | ------------------ | ---------------- |
| ISS Position  | wheretheiss.at     | Real-time (10s)  |
| NEO Data      | NASA NeoWs API     | Daily            |
| Space Images  | NASA Images API    | On-demand        |
| Missions      | Launch Library API | Daily            |
| Space Weather | NASA DONKI         | Real-time        |
| AI Responses  | Groq API           | On-demand        |

---

## 🐛 Troubleshooting

### "API Key Not Found"

- Ensure `.env` file exists in project root
- Check that `VITE_NASA_API_KEY` is set correctly
- Restart dev server after updating `.env`

### ISS Data Not Loading

- Check internet connection
- Verify NASA API key is valid
- Try refreshing the page

### Images Not Showing in Gallery

- Ensure CORS is enabled (NASA API should handle this)
- Check browser console for error messages
- Try a different search term

### AI Explainer Not Working

- Verify `VITE_GROQ_API_KEY` is set in `.env`
- Check that Groq API key is valid and has usage quota
- Try with a simpler question

---

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
# Required
VITE_NASA_API_KEY=your_nasa_api_key

# Optional (for AI features)
VITE_GROQ_API_KEY=your_groq_api_key

# Build settings (auto-set by Vite)
VITE_APP_TITLE=AstroNexus
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Authors

- **HabinBahith** - Main Developer

---

## 🙏 Acknowledgments

- **NASA** - For providing comprehensive space data APIs
- **Launch Library** - For space mission information
- **Groq** - For AI-powered explanations
- **shadcn/ui** - For beautiful UI components
- **Tailwind CSS** - For utility-first styling

---

## 📞 Support

For issues, feature requests, or questions:

- Open an issue on GitHub
- Check existing documentation
- Review API documentation links

---

## 🔗 Useful Links

- [NASA API Documentation](https://api.nasa.gov)
- [Launch Library API](https://ll.thespacedevs.com)
- [Groq Console](https://console.groq.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

---

**Last Updated**: December 6, 2025

Made with ❤️ for space exploration enthusiasts
