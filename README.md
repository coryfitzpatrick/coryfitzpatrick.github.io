# Cory Fitzpatrick Portfolio

Modern portfolio website showcasing development, design, and photography work with an AI-powered chatbot assistant.

🌐 **Live Site**: [coryfitzpatrick.com](https://coryfitzpatrick.com)

## Features

### 🤖 AI Chatbot Assistant
- Interactive chatbot interface powered by AI to answer questions about skills, experience, and projects
- Real-time streaming responses for natural conversation flow
- Custom vintage robot icon design
- Mobile-responsive chat interface

### 📁 Portfolio Categories
- **Dev**: Software development projects and professional experience
- **Design**: Graphic design and creative work
- **Photo**: Photography portfolio

### 🎨 Modern UI/UX
- Responsive grid layout that works on all devices
- Smooth animations and hover effects
- Vintage-inspired design aesthetic
- Custom SCSS styling

## Tech Stack

- **Frontend**: React 19, React Router v5
- **Build Tool**: Vite
- **Styling**: SCSS (Sass)
- **Testing**: Jest, React Testing Library
- **Deployment**: Static hosting (configured for modern platforms)
- **AI Backend**: Google Cloud Run (separate repository)

## Project Structure

```
reactportfolio/
├── public/
│   └── images/          # Portfolio images and assets
├── src/
│   ├── components/      # React components
│   │   ├── chatbot-page.jsx      # AI chatbot interface
│   │   ├── robot-icon.jsx        # Custom SVG robot icon
│   │   ├── category-list.jsx     # Portfolio grid display
│   │   ├── detail-item.jsx       # Individual project details
│   │   ├── about-page.jsx        # About page
│   │   ├── header.jsx            # Site navigation
│   │   └── footer.jsx            # Site footer
│   ├── styles/          # SCSS stylesheets
│   ├── data/           # Portfolio data (data.json)
│   └── main.tsx        # App entry point
├── package.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 24.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reactportfolio.git
cd reactportfolio
```

2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### Building for Production

Build the optimized production bundle:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Configuration

### AI Chatbot API

The chatbot automatically switches between local and production API endpoints:

- **Local Development**: `http://localhost:8000/api/chat/stream`
- **Production**: `https://coryfitzpatrick-ai-backend-fcwbtvbnfa-uc.a.run.app/api/chat/stream`

To run with a local backend:
1. Start the backend server on port 8000
2. Run the frontend dev server
3. The app will automatically detect localhost and use the local API

### Portfolio Data

Portfolio content is managed in `/src/data/data.json`. Update this file to add or modify:
- Project information
- Images and thumbnails
- Project descriptions
- Project URLs

## Deployment

### Current Deployment: Heroku

The site is currently deployed on Heroku with automatic deploys from the `master` branch.

**Deploy to Heroku:**

1. Install Heroku CLI (if not already installed):
```bash
brew install heroku/brew/heroku
```

2. Login to Heroku:
```bash
heroku login
```

3. Deploy changes:
```bash
git add .
git commit -m "Your commit message"
git push origin master  # Pushes to GitHub and auto-deploys to Heroku
```

The `Procfile` is configured to run `npm start` which serves the built static files.

### Alternative Hosting Options

The app can also be deployed to other static hosting platforms:

**Manual Deployment:**

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting provider

Compatible hosting platforms:
- **Heroku** (currently used)
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Serve production build locally |
| `npm run preview` | Preview production build |
| `npm test` | Run test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run build-css` | Compile SCSS to CSS |

## Key Features Implementation

### Chatbot Interface
- Streaming API responses with real-time updates
- Loading spinner during AI response generation
- Auto-scrolling to latest messages
- Example questions for quick start
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### Responsive Design
- Mobile-first approach
- Breakpoints at 768px and 1024px
- Touch-friendly interface for mobile devices
- Optimized images and assets

### Portfolio Grid System
- Custom responsive grid using RWD Grid
- Hover animations on project cards
- Category-based filtering
- Detail pages for each project

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Private portfolio project - All rights reserved

## Contact

Cory Fitzpatrick - Software Tech Lead

For questions about this portfolio or to discuss opportunities, use the AI chatbot on the site or visit [coryfitzpatrick.com](https://coryfitzpatrick.com)
