# Project Story

**Inspiration**
I noticed that while daily puzzle games like Wordle are incredibly popular, they are often solitary and static—they don't reflect the vibrant, changing nature of the communities playing them. I asked: *What if the answer to the daily puzzle was derived from the subreddit itself?* And better yet, *what if the community could compete to create the next day's puzzle?*

Thus, **SubThreadle** was born: a hybrid deduction game that is half puzzle, half social experiment.

**How I built it**
I built SubThreadle using Reddit's **Devvit** platform, specifically leveraging the **Custom Posts** (Interactive Posts) capability.
- **Frontend**: I chose **React** via **Vite** to deliver a "native app" feel within the post. I focused heavily on **visual polish**—implementing "Glassmorphism" UI, 3D tile flip animations, and particle effects to ensure the experience felt premium and delightful.
- **UGC Engine**: The core innovation is the "Tomorrow's Puzzle" engine. I used **Redis** to persist user submissions and votes. When a player wins, they earn the right to suggest a word (validated to prevent spoilers) and vote on others.
- **Daily Cycle**: The game uses a deterministic daily seed combined with community override logic to ensure there is *always* a fresh puzzle available, even if the community sleeps.

**Challenges faced**
One major challenge was **spoiler prevention** in a UGC context. I had to implement strict client-side and logic-based validation to ensure "Hints" didn't trivially give away the "Answer". I also spent significant time on the **mobile experience**, ensuring that the keyboard and animations remained buttery smooth on all devices without draining battery, replacing heavy game engines with optimized CSS and Canvas effects.

**What I learned**
I learned that the Devvit platform is incredibly powerful for bridging the gap between "static content" and "live apps." By giving users agency over the *content* of the game, not just the gameplay, I created something that encourages users to come back every single day—not just to play, but to contribute.

# Built with
- **Devvit**: Core platform and hosting.
- **React**: User Interface library.
- **Vite**: Ultra-fast frontend tooling.
- **TypeScript**: For robust type-safe game logic.
- **Redis**: Fast, persistent storage for user progress, submissions, and voting data.
- **CSS3 / Canvas**: Custom 3D animations and particle effects (no heavy game engines required).
