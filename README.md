# Netflix Clone

A Netflix clone built with React.js that mimics the Netflix user interface and functionality.

## Features

- 🎬 Netflix-like UI with dark theme
- 🔐 Login/Signup screens
- 🏠 Home screen with movie rows
- 🎯 Featured movie banner
- 👤 User profile screen
- 📱 Responsive design
- 🎭 Movie data from TMDB API

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get TMDB API Key:**
   - Go to [TMDB](https://www.themoviedb.org/)
   - Create an account and get your API key
   - Replace the placeholder in `src/requests.js` with your actual API key

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Nav.js          # Navigation bar
│   ├── Banner.js       # Featured movie banner
│   └── Row.js          # Movie rows
├── screens/
│   ├── HomeScreen.js   # Main home page
│   ├── LoginScreen.js  # Login page
│   ├── SignupScreen.js # Signup form
│   └── ProfileScreen.js # User profile
├── requests.js         # API endpoints
├── axios.js           # Axios configuration
└── App.js             # Main app component
```

## Technologies Used

- React.js
- React Router
- Axios for API calls
- CSS3 for styling
- TMDB API for movie data

## Note

This is a demo project for educational purposes. To use real movie data, you'll need to:
1. Get a TMDB API key
2. Replace the placeholder API key in the requests.js file
3. Handle authentication properly for a production app# netflix-clone
