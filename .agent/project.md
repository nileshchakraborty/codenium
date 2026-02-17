# Codenium Project Overview

Codenium is a premium, next-generation platform for visualizing algorithms and data structures with interactive step-by-step animations, AI-powered tutoring, and a comprehensive library of 250+ LeetCode problems.

## 🏗 Architecture: Hexagonal (Ports & Adapters)

The project follows a clean separation between business logic and external dependencies.

- **Frontend**: React + Vite + TypeScript + TailwindCSS. Located in `frontend/`.
- **Backend**: Node.js + Express + TypeScript. Primary logic in `src/` (Hexagonal) and `api/` (Vercel Serverless).
- **Domain Layer**: Located in `src/domain/`. Defines entities and ports (interfaces).
- **Application Layer**: Located in `src/application/`. Use cases like `ProblemService`.
- **Adapters**: Located in `src/adapters/`. Implementations for AI (OpenAI, Ollama), Code Execution, and Persistence.

## 🧪 Tech Stack

- **Frontend**: React 19, Vite 7, TypeScript 5.7, TailwindCSS 3.4, Monaco Editor 4.7, Framer Motion 12.
- **Backend**: Node.js 24, Express 4.18.
- **AI**: OpenAI SDK 4.20, Ollama.
- **Infrastructure**: Vercel (Serverless), Railway/Render (Docker).

## 📂 Key Directories

- `frontend/`: React SPA.
- `api/`: Vercel Serverless functions.
- `src/`: Core business logic (Hexagonal architecture).
- `scripts/`: Maintenance and data management scripts.
- `data/`: JSON data store for problems and solutions.

## 🚀 Core Goals

- Provide 100% visualization coverage for 250+ LeetCode problems.
- Offer AI-powered tutoring for personalized learning.
- Maintain a premium, interactive user experience.
