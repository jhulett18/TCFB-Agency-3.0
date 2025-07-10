# TCFB Agency 3.0 - Food Finder App

A React-based web application for finding food assistance agencies in the Treasure Coast area, featuring Google Maps integration and Microsoft Graph API support.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)
- Google Maps API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd TCFB-Agency-3.0-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env and add your Google Maps API key
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

4. **Start development server**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## 🏗️ Building for Production

### Option 1: Using Build Scripts (Recommended)

**Windows:**
```bash
build.bat
```

**Linux/Mac:**
```bash
chmod +x build.sh
./build.sh
```

### Option 2: Manual Build
```bash
npm run build
```

The build output will be in the `build/` directory, ready for deployment.

## 🚀 Deployment

### Netlify (Recommended)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variables in Netlify dashboard:
   - `REACT_APP_GOOGLE_MAPS_API_KEY`

### Vercel
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the React app
4. Add environment variables in Vercel dashboard

### GitHub Pages
1. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/your-repo-name",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
2. Install gh-pages: `npm install --save-dev gh-pages`
3. Deploy: `npm run deploy`

### AWS S3 + CloudFront
1. Build the app: `npm run build`
2. Upload `build/` contents to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain (optional)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API key | Yes |
| `REACT_APP_MICROSOFT_CLIENT_ID` | Microsoft Graph API client ID | No |
| `REACT_APP_MICROSOFT_TENANT_ID` | Microsoft Graph API tenant ID | No |

### Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Maps JavaScript API
4. Create credentials (API Key)
5. Restrict the API key to your domain for security

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AgencyList/     # Agency listing components
│   ├── InteractiveMap/ # Google Maps integration
│   ├── Navbar/         # Navigation component
│   └── Sidebar/        # Sidebar with filters
├── data/               # Static data files
│   └── agencies.json   # Agency data
├── store/              # State management (Zustand)
├── tests/              # Test components
│   └── MsGraphListTest.tsx  # Microsoft Graph API test
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── App.tsx             # Main application component
```

## 🧪 Testing

### Microsoft Graph API Test
The app includes a test component for Microsoft Graph API integration:

```bash
# Import and use in your app temporarily
import MsGraphListTest from './tests/MsGraphListTest';
```

This component demonstrates CRUD operations on Microsoft Lists.

## 📝 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues

## 🔒 Security Notes

- Never commit your `.env` file to version control
- Restrict your Google Maps API key to specific domains
- Use environment variables for all sensitive configuration
- The app is designed for static hosting (no backend required)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This is version 3.0 of the TCFB Agency application, featuring improved performance, better TypeScript support, and enhanced user experience.
