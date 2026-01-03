# Personalized News Digest Service

A full-stack web application that allows users to subscribe to daily email updates with personalized news digests based on their favorite topics.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Services**: NewsAPI (for articles), Brevo (for emails)
- **Deployment**: Vercel (Frontend & Serverless Backend)

## Features

- **User Authentication**: Secure Login/Register with JWT.
- **Dashboard**: personalized dashboard to manage topics.
- **Topic Management**: Add/Remove favorite topics (e.g., Technology, Sports).
- **Subscription Control**: Toggle email subscription on/off.
- **Manual Trigger**: Send a digest email immediately from the dashboard.
- **Scheduled Digests**: Automatic emails sent every 12 hours (Production) or 5 minutes (Dev).

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas URI
- NewsAPI Key
- Brevo API Key

### Installation

1.  Clone the repository.
2.  Install dependencies:

    ```bash
    # Root
    npm install
    
    # Server
    cd server
    npm install
    
    # Client
    cd client
    npm install
    ```

### Environment Variables

Create a `.env` file in the root (and/or server) with the following:

```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
NEWS_API_KEY=your_news_api_key
CLIENT_URL=http://localhost:5173
```

### Running Locally

1.  Start Backend:
    ```bash
    cd server
    npm run dev
    ```
2.  Start Frontend:
    ```bash
    cd client
    npm run dev
    ```

## Deployment

This project is configured for **Vercel**.

1.  **Push to GitHub**: Ensure this repository is pushed to your GitHub account.
2.  **Vercel Dashboard**:
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.
3.  **Project Configuration**:
    *   **Framework Preset**: Select **Vite**.
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Build Command**: `npm run build` (Default is fine).
    *   **Output Directory**: `dist` (Default is fine).
4.  **Environment Variables**:
    *   Add all variables from your `.env` file (`MONGODB_URI`, `JWT_SECRET`, `BREVO_API_KEY`, `NEWS_API_KEY`).
    *   Set `CLIENT_URL` to your production Vercel URL (you can update this after first deploy).
5.  **Serverless Functions**:
    *   Vercel automatically detects the `api` directory and `vercel.json` configuration to serve the backend.
6.  **Deploy**: Click "Deploy".


## API Endpoints

-   `POST /api/auth/register`
-   `POST /api/auth/login`
-   `GET /api/preferences`
-   `PUT /api/preferences/topics`
-   `PUT /api/preferences/subscribe`
-   `POST /api/preferences/manual-digest`
