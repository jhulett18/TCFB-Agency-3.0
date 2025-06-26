# TCFB-Agency-3.0

A modern React TypeScript application for finding food assistance agencies in the Treasure Coast Food Bank area. This app provides an interactive map interface with agency locations, filtering capabilities, and detailed information about each food assistance provider.

## 🚀 Features

- **Interactive Google Maps Integration**: Display all food assistance agencies on an interactive map
- **Agency Filtering**: Search and filter agencies by location, type, and services
- **Detailed Agency Information**: View contact details, hours, and services for each agency
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Dynamic marker selection and information display
- **Modern UI/UX**: Clean, intuitive interface with smooth interactions

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **State Management**: Zustand
- **Maps**: Google Maps API with @react-google-maps/api
- **Styling**: CSS3 with custom components
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Google Maps API key

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TCFB-Agency-3.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── InteractiveMap/  # Google Maps integration
│   ├── Sidebar/         # Left sidebar with filters
│   ├── Navbar/          # Top navigation
│   └── AgencyList/      # Agency listing components
├── store/              # Zustand state management
├── data/               # Static data (agencies.json)
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── index.tsx           # App entry point
└── global.css          # Global styles
```

## 🎯 Key Components

### InteractiveMap
- Renders Google Maps with agency markers
- Handles marker clicks and info windows
- Supports custom marker icons based on agency type

### Sidebar
- Contains search and filtering functionality
- Displays agency list with detailed cards
- Responsive design for mobile devices

### AgencyList
- Lists all agencies with filtering
- Agency cards with contact information
- Integration with map selection

## 🔑 API Configuration

**⚠️ IMPORTANT: API Key Security**

The app uses Google Maps API for map functionality. Follow these steps to set up your API key securely:

1. **Get a Google Maps API key** from the [Google Cloud Console](https://console.cloud.google.com/)
2. **Enable the following APIs**:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. **Set up API key restrictions** (recommended):
   - Restrict to HTTP referrers (your domain)
   - Restrict to specific APIs (Maps JavaScript, Places, Geocoding)
4. **Add the API key to your `.env` file**:
   ```env
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

**🔒 Security Notes:**
- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use different API keys for development and production
- Consider using environment-specific API keys with appropriate restrictions

**📝 Setup Instructions:**
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and replace `your_google_maps_api_key_here` with your actual API key
3. Restart your development server after adding the API key

## 📱 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run lint` - Runs ESLint for code quality
- `npm run lint:fix` - Fixes auto-fixable ESLint issues

## 🚀 Deployment

To deploy the app:

1. Build the production version:
   ```bash
   npm run build
   ```

2. The build folder contains the production-ready files

3. Deploy to your preferred hosting service (Netlify, Vercel, AWS, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is version 3.0 of the TCFB Agency application, featuring improved performance, better TypeScript support, and enhanced user experience.
