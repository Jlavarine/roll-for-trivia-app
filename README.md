# Roll for Trivia 🎲

## About the Project
Roll for Trivia is a **daily trivia game** where users log in, play a daily quiz, and compete on the **leaderboard**. Questions update every day, and only the highest scores are recorded per user.

## Features
**User Authentication** - Players create an account with a username and password.  
**Daily Trivia Challenge** - Users can only play once per day.  
**Leaderboard** - Tracks the top scores for each day.  
**Prevention of Replays** - If a user has already played, they cannot replay until the next day.  
**Automatic Score Reset** - Old scores are cleared daily to keep the leaderboard fresh.  

## Installation & Setup
1. **Clone the repository:**  
   ```sh
   git clone https://github.com/Jlavarine/roll-for-trivia.git
   cd roll-for-trivia
   ```
2. **Install dependencies:**  
   ```sh
   npm install
   ```
3. **Start the app with Expo:**  
   ```sh
   npx expo start
   ```
4. **Run on your device:**  
   - Scan the QR code with the Expo Go app (iOS/Android).
   - Or run it in an emulator (`npm run android` or `npm run ios`).

## Technologies Used
- **React Native** (Expo) - Mobile framework
- **AsyncStorage** - Local storage for user authentication and scores
- **Open Trivia DB API** - Fetches daily trivia questions
- **React Navigation** - Handles screen navigation

## Future Improvements 🚀
**Daily Streak Tracking** - Players can maintain a streak by playing daily.  
**Achievements & Badges** - Unlockable rewards for high scores and streaks.  
**Firebase Integration** - Store user progress across devices.  
**Custom Trivia Mode** - Users can create custom trivia quizzes for friends.  

