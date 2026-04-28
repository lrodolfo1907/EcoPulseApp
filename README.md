# EcoPulse

EcoPulse is a web application designed to track, encourage, and gamify eco-friendly initiatives. Users can calculate their carbon footprint, join local and global environmental challenges, track their "Green Hours," and learn about sustainability.

## Features

- **Authentication:** Secure sign-up and sign-in using Google or Email/Password (powered by Firebase Auth).
- **Dashboard:** Overview of daily eco-tips, current Green Hours, and quick actions.
- **Carbon Calculator:** Estimate your carbon footprint based on transport, energy, and diet.
- **Initiatives:** Browse and join local and global environmental challenges.
- **Portfolio:** Track joined and completed initiatives, and view recent activity.
- **Real-time Data:** Live synchronization of user data and initiatives using Firestore.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide React (Icons), Motion (Animations)
- **Backend/Database:** Firebase (Authentication, Firestore)
- **AI Integration:** Google Gemini API (for generating daily eco-tips and dynamic content)

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn
- A Firebase project
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd ecopulse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Variables:
   Ensure you have your Firebase configuration set up. The project uses a `firebase-applet-config.json` file for Firebase initialization and a `.env` file for other secrets (like `GEMINI_API_KEY`).

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs TypeScript type checking.
