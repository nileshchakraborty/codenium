# Setup Development Environment

---
description: How to set up and start the development environment
---

To start the development environment for Codenium, follow these steps:

1. **Configure Environment**: Ensure you have a `.env` file with the necessary API keys (OpenAI, Google OAuth, etc.). You can use `.env.example` as a template.
2. **Install Dependencies**: Run `make install` to install frontend, backend, and Python dependencies.
// turbo
3. **Start Dev Servers**: Run `make dev` or `./start.sh` to start both the frontend and backend development servers.
   - Frontend will be available at `http://localhost:3000`.
   - Backend API will be available at `http://localhost:3001`.
4. **Verify Health**: Check the API status at `http://localhost:3001/api/health`.
