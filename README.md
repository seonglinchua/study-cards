# StudyCards - Educational Flashcard Application

A full-stack educational flashcard web application built with modern web technologies. Perfect for kids and learners of all ages to master new concepts through interactive flashcards.

## Features

### Core Functionality
- **Interactive Flashcards**: Smooth card flip animations for engaging learning
- **Deck Library**: Browse and filter flashcard decks by category
- **Study Interface**: Navigate through cards with progress tracking
- **Progress Tracking**: Mark cards as learned and track your mastery
- **Deck Management**: Create custom decks with unlimited cards
- **Dark Mode**: Toggle between light and dark themes

### Pre-loaded Content
- Animals deck (10 cards)
- Colors deck (8 cards)
- Alphabet deck (26 cards)

## Tech Stack

- **Frontend**: React 18 + Next.js 15 (App Router)
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth (ready for future implementation)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project (free tier is sufficient)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd study-cards
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**

   a. Go to [Firebase Console](https://console.firebase.google.com/)

   b. Create a new project or use an existing one

   c. Enable **Realtime Database** in your Firebase project:
      - Navigate to Build → Realtime Database
      - Click "Create Database"
      - Start in test mode (for development)

   d. Get your Firebase configuration:
      - Go to Project Settings → General
      - Scroll to "Your apps" section
      - Click the web icon (</>)
      - Copy your Firebase configuration

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-id-default-rtdb.firebaseio.com
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### First Run

On first run, the application will automatically seed the database with three example decks (Animals, Colors, Alphabet). This happens automatically when you visit the homepage.

## Project Structure

```
study-cards/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Deck management interface
│   │   ├── decks/             # Deck library page
│   │   ├── study/[deckId]/    # Study interface
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── deck-card.tsx     # Deck display component
│   │   ├── flashcard.tsx     # Flashcard with flip animation
│   │   ├── navigation.tsx    # Main navigation
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/                   # Utility functions
│   │   ├── firebase.ts       # Firebase configuration
│   │   ├── deckService.ts    # Database operations
│   │   ├── seedData.ts       # Initial deck data
│   │   └── utils.ts          # Helper functions
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts
│   └── hooks/                 # Custom React hooks (future use)
├── public/                    # Static assets
├── .env.local                 # Environment variables (create this)
├── .env.example              # Environment template
└── README.md                 # This file
```

## Usage

### Browsing Decks
1. Navigate to the "Decks" page from the navigation menu
2. Filter decks by category using the badges
3. Click "Start Learning" on any deck to begin studying

### Studying
1. Click on a flashcard to flip it
2. Use "Previous" and "Next" buttons to navigate
3. Mark cards as learned to track your progress
4. View your progress in the progress bar at the top

### Creating Custom Decks
1. Navigate to the "Admin" page
2. Enter deck title, description, and category
3. Add cards (front and back content)
4. Click "Add Card" to add more cards
5. Click "Create Deck" to save

## Firebase Security Rules

For production, update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "decks": {
      ".read": true,
      ".write": true
    },
    "userProgress": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**
   - Add all Firebase environment variables from `.env.local`
   - These can be added in the Vercel dashboard under Settings → Environment Variables

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `your-project.vercel.app`

### Environment Variables for Vercel

Make sure to add these in your Vercel project settings:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

## Development

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run start
```

### Lint Code
```bash
npm run lint
```

## Future Enhancements

Potential features to add:
- User authentication with Firebase Auth
- Personal deck collections
- Spaced repetition algorithm
- Study statistics dashboard
- Image upload for flashcards
- Social sharing
- Multi-language support
- Audio pronunciation
- Collaborative decks

## Technologies Used

- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality UI components
- **Firebase**: Backend as a service
- **Lucide Icons**: Beautiful icon library
- **Vercel**: Deployment platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Check Firebase documentation for database-related questions
- Review Next.js documentation for framework questions

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons by [Lucide](https://lucide.dev)
- Backend by [Firebase](https://firebase.google.com)
