# Visamitra Frontend

Frontend for **Visamitra** — a platform for stock price prediction and AI-based crypto trading, built with React and Vite.

## Tech Stack

- **Framework:** React (JSX)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State/Auth:** Custom Auth module (`auth.js`, `Auth.jsx`)

## Project Structure


## Getting Started

```bash
git clone https://github.com/kksingh000/visamitra-frontend.git
cd visamitra-frontend
npm install
cp .env.example .env   # Configure API base URL and keys
npm run dev
```

## Build for Production

```bash
npm run build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` and set the backend API URL (pointing to your `visamitra-backend` deployment on Render) along with any auth keys.

## Related Repositories

- [visamitra-backend](https://github.com/kksingh000/visamitra-backend)

## Author

Krishna Kumar Singh — academic project on stock prediction and crypto trading.
