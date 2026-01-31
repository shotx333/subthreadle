# SubThreadle

**SubThreadle** is a daily deduction game built for Reddit using [Devvit](https://developers.reddit.com/). It's a Wordle-like puzzle game where the secret words are derived from the subreddit's content (top posts, flairs, memes), making it a unique, community-driven experience.

## 🎮 Features

*   **Daily Puzzle**: Guess the secret word in 6 tries.
*   **Visual Feedback**: Classic Green/Yellow/Gray feedback for letters.
*   **Community Powered**: Players can submit words for future puzzles.
*   **Voting System**: The community votes on submitted entries to decide tomorrow's word.
*   **Mobile Friendly**: Designed to work seamlessly within the Reddit mobile app.

## 🚀 Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) (Version 18 or later recommended)
*   [Devvit CLI](https://developers.reddit.com/docs/get-started/install)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/subthreadle.git
    cd subthreadle
    ```

2.  Install dependencies:
    ```bash
    npm install
    # Install webroot dependencies
    cd webroot && npm install && cd ..
    ```

## 🛠️ Development

This project uses a hybrid structure with a Devvit app wrapper and a React-based web view.

### Running the App

To run the full Devvit application (including the Reddit emulator):

```bash
npm run dev
```

This command runs `devvit playtest`, allowing you to interact with the app in a simulated Reddit environment.

### Frontend Development

If you are just working on the visual game interface (the web view), you can run the frontend in isolation for faster iteration:

```bash
npm run web-dev
```

This starts the Vite development server in `webroot`.

## 📂 Project Structure

*   **`src/`**: Contains the main Devvit application logic (backend/server-side).
*   **`webroot/`**: Contains the React frontend application (the game UI).
*   **`devvit.yaml`**: The Devvit app configuration file.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

[MIT](LICENSE)
