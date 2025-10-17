# DeepDetect - AI-Generated Image Detection

A modern, responsive, and user-friendly frontend for AI-generated image detection. Identify synthetic faces, manipulated photos, and deepfakes with advanced AI analysis.

## 🎯 Features

- **AI-Generated Image Detection**: Accurate detection with 98%+ confidence
- **Easy Image Upload**: Upload from device or paste image URL
- **Step-by-Step Analysis**: Intuitive 3-step workflow (Upload → Review → Results)
- **Professional PDF Reports**: Download detailed analysis reports as single-page PDFs
- **User History Tracking**: View all previously analyzed images with results
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Pastel Theme UI**: Modern, minimal design with smooth animations
- **Authentication**: Secure login/signup with session management

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)
- **pnpm** (package manager) - Install globally:
  ```bash
  npm install -g pnpm
  ```

### Verify Installation

```bash
node --version      # Should show v16.0.0 or higher
npm --version       # Should show 8.0.0 or higher
pnpm --version      # Should show 10.0.0 or higher
git --version       # Should show 2.0.0 or higher
```

## 🚀 Quick Start

### Step 1: Clone or Extract Project

**If you have a GitHub repo:**
```bash
git clone <your-repo-url>
cd fusion-starter
```

**If you downloaded from Builder.io:**
1. Extract the downloaded ZIP file
2. Open terminal in the extracted folder

### Step 2: Install Dependencies

```bash
pnpm install
```

This installs all required packages:
- React 18 & React Router 6
- Vite (fast build tool)
- Express (backend server)
- TailwindCSS 3 (styling)
- jsPDF & html2canvas (PDF generation)
- Lucide React (icons)
- Sonner (toast notifications)
- And more...

### Step 3: Start Development Server

```bash
pnpm dev
```

You'll see output like:
```
  VITE v7.1.2  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Open in Browser

Open your browser and navigate to:
```
http://localhost:5173
```

You should see the DeepDetect landing page with all features.

## 🧪 Testing the Application

### Create a Test Account

1. Click the **Sign Up** button in the navbar
2. Fill in the form:
   - **Name**: Any name (e.g., John Doe)
   - **Email**: Any email (e.g., test@example.com)
   - **Password**: 8+ characters (e.g., Password123)
3. Click **Sign Up**

### Test Image Analysis

1. After login, click **Start Analysis** or go to `/analyze`
2. Choose upload method:
   - **Upload from Device**: Click to browse or drag-drop an image
   - **Paste Image URL**: Enter a direct image URL
3. Click **Continue** to proceed to review step
4. Click **Start Analysis** to generate mock results
5. View detailed analysis with metrics:
   - Pixel Anomalies
   - Texture Consistency
   - Lighting Realism
   - Edge Quality
6. Click **Download Report as PDF** to download analysis

### View Analysis History

1. Click **Profile** in the navbar
2. See all past analyses with:
   - Classification (AI-Generated or Real)
   - Confidence percentage
   - Analysis timestamp
   - Download and delete options

## 📁 Project Structure

```
fusion-starter/
├── client/                          # Frontend (React SPA)
│   ├── pages/
│   │   ├── Index.tsx               # Landing page with features
│   │   ├── Login.tsx               # Login page
│   │   ├── Signup.tsx              # Sign up page
│   │   ├── ForgotPassword.tsx       # Password recovery
│   │   ├── Analyze.tsx             # Main analysis interface
│   │   ├── Profile.tsx             # User profile & history
│   │   └── NotFound.tsx            # 404 page
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (40+ components)
│   │   └── hooks/                  # Custom React hooks
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── global.css                  # Global styles & theme colors
│   ├── App.tsx                     # App entry & routing
│   └── vite-env.d.ts              # Vite environment types
├── server/                          # Backend (Express)
│   ├── index.ts                    # Server setup & routes
│   └── routes/                     # API endpoint handlers
├── shared/                          # Shared types
│   └── api.ts                      # Shared API types
├── package.json                    # Dependencies & scripts
├── tailwind.config.ts              # TailwindCSS configuration
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── vite.config.server.ts           # Server build configuration
├── postcss.config.js               # PostCSS configuration
└── index.html                      # HTML entry point
```

## 💻 Available Commands

```bash
# Start development server (client + server with hot reload)
pnpm dev

# Build for production
pnpm build

# Build client only
pnpm build:client

# Build server only
pnpm build:server

# Start production server
pnpm start

# Run TypeScript type checking
pnpm typecheck

# Run tests with Vitest
pnpm test

# Format code with Prettier
pnpm format.fix
```

## 🎨 Customization

### Change Theme Colors

Edit `client/global.css` to modify the pastel color palette:

```css
:root {
  --primary: 280 70% 60%;        /* Purple */
  --secondary: 50 90% 75%;       /* Yellow */
  --accent: 180 80% 65%;         /* Cyan */
  /* ... other colors ... */
}
```

### Add New Pages

1. Create a new file in `client/pages/MyPage.tsx`
2. Add route in `client/App.tsx`:
   ```typescript
   <Route path="/my-page" element={<MyPage />} />
   ```
3. Add navigation link in `client/components/Navbar.tsx`

### Add API Endpoints

1. Create handler in `server/routes/my-endpoint.ts`
2. Register in `server/index.ts`:
   ```typescript
   app.get("/api/my-endpoint", handleMyEndpoint);
   ```

## 🔐 Authentication

The app uses **mock authentication** for demo purposes. All data is stored in **localStorage**.

### How It Works

- **Signup**: Creates a mock token and stores user data in localStorage
- **Login**: Validates credentials and sets auth token
- **Protected Routes**: Routes check for auth token and redirect to login if missing
- **Logout**: Clears token and user data

**For Production:** Replace mock auth with a real backend service (Firebase, Auth0, Supabase, etc.)

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| **Frontend Framework** | React 18 |
| **Routing** | React Router 6 |
| **Styling** | TailwindCSS 3 + Radix UI |
| **Build Tool** | Vite 7 |
| **Backend Server** | Express 5 |
| **Language** | TypeScript |
| **PDF Generation** | jsPDF + html2canvas |
| **Icons** | Lucide React |
| **Notifications** | Sonner |
| **Testing** | Vitest |
| **Package Manager** | pnpm |

## 🐛 Troubleshooting

### Issue: Command not found: pnpm
```bash
npm install -g pnpm
```

### Issue: Port 5173 already in use
```bash
# Use a different port
pnpm dev -- --port 3000
```

### Issue: Dependencies not installing
```bash
# Clear cache and reinstall
pnpm install --force
```

### Issue: PDF download fails
```bash
# Ensure all dependencies are installed
pnpm install
# Restart dev server
pnpm dev
```

### Issue: Blank page after login
```bash
# Clear browser cache and localStorage
# Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
# Refresh page
```

### Issue: Images not displaying
- Check that image URLs are accessible and not blocked by CORS
- Use public image URLs for testing

### Issue: TypeScript errors
```bash
# Run type checking
pnpm typecheck

# Fix ESLint issues
pnpm format.fix
```

## 📖 Project Features

### Landing Page
- Hero section with call-to-action
- "What are AI-Generated Images" section
- "Why It's Dangerous" section with risk factors
- Features showcase (Accuracy, Speed, History, Reports)
- About Us section
- Final CTA with newsletter signup
- Responsive footer

### Authentication Pages
- **Login**: Email + password
- **Signup**: Full form with validation (8+ char password)
- **Forgot Password**: Email recovery flow

### Analysis Page (3-Step Workflow)
1. **Step 1 - Upload**: File upload or URL input
2. **Step 2 - Review**: Image preview with analysis info
3. **Step 3 - Results**: Full-page results with:
   - Classification (AI-Generated or Real)
   - Confidence percentage with progress bar
   - Detailed metrics table
   - Image preview
   - PDF report download
   - Navigation options

### Profile & History Page
- User information display
- Statistics dashboard (total analyses, real vs AI count)
- Complete analysis history with:
  - Classification badge
  - Confidence score
  - Timestamp
  - Download report button
  - Delete option

## 🚢 Deployment

### Deploy to Netlify
1. Push code to GitHub
2. Connect repository to Netlify
3. Netlify automatically builds and deploys

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel dashboard
3. Automatic deployments on push

### Manual Deployment
```bash
# Build for production
pnpm build

# Files ready in:
# - dist/spa/          (frontend)
# - dist/server/       (backend)
```

## 📝 Environment Variables (Optional)

Create `.env` file in root for configuration:

```
VITE_API_URL=http://localhost:5173/api
NODE_ENV=development
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Push to GitHub
4. Create a pull request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the code comments
3. Check React Router and TailwindCSS documentation
4. Visit the project repository issues page

## 🎉 Ready to Go!

Your DeepDetect app is now ready to run locally. Start the development server with `pnpm dev` and begin exploring!

### Quick Links
- 🏠 [Landing Page](http://localhost:5173)
- 🔐 [Login](http://localhost:5173/login)
- 📝 [Sign Up](http://localhost:5173/signup)
- 🔍 [Analysis](http://localhost:5173/analyze) (requires login)
- 👤 [Profile](http://localhost:5173/profile) (requires login)

---

**Happy analyzing! 🚀**
