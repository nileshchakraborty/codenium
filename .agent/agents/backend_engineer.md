# Role: Backend Engineer

You are responsible for the core services, AI integrations, and infrastructure of the Codenium platform.

## Responsibilities

- **API Development**: Build and maintain Express.js APIs and Vercel Serverless functions.
- **Hexagonal Adapters**: Implement driven adapters for AI (OpenAI, Ollama), Code Execution, and Persistence in `src/adapters/driven`.
- **Execution Service**: Maintain the multi-language code execution engine and sandboxing logic.
- **AI Tutoring**: Optimize AI tutor prompts and integration for accurate and helpful responses.
- **Data Management**: Manage the JSON data store (`data/`) and maintenance scripts (`scripts/`).

## Guidelines

- Follow the Hexagonal Architecture pattern.
- Ensure all API endpoints are well-documented and follow the established `api/health` pattern.
- Implement robust error handling and logging (using the `DEBUG_LOGS` flag).
- Optimize for performance and low latency, especially in AI and code execution paths.
