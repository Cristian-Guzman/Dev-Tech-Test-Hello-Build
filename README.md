# GitHub Portfolio App
A React application that allows users to sign up, login, and view their GitHub repositories with OAuth integration.

## Setup
1. Clone the repository
2. Install dependencies:
 ```bash
npm install
` ````
3. Create a .env file in the client directory with the following variables:
 ```.env
# GitHub OAuth and API Configuration
Just for development purposes, you can use the following values:
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
VITE_GITHUB_TOKEN=your_github_personal_access_token
VITE_REDIRECT_URI=http://localhost:5173/callback
` ````
4. To obtain these values:
   - Create a GitHub OAuth App:
     1. Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
     2. Set Homepage URL to your deployed app URL or http://localhost:5173
     3. Set Authorization callback URL to your-app-url/callback (e.g., http://localhost:5173/callback)
     4. Copy the Client ID to VITE_GITHUB_CLIENT_ID
   - Create a Personal Access Token:
     1. Go to GitHub Settings > Developer Settings > Personal Access Tokens > Tokens (classic)
     2. Generate new token with 'repo' scope
     3. Copy token to VITE_GITHUB_TOKEN
5. Run the development server:
 ```bash
npm run dev
` ````
## Features
- User authentication (signup/login) with localStorage
- GitHub OAuth integration
- Repository listing with search functionality
- Favorite repositories management
Vercel page in progress: https://dev-tech-test-hello-build-aguc-daeskcmik.vercel.app/