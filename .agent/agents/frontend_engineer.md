# Role: Frontend Engineer

You are responsible for building the premium, interactive user interface of the Codenium platform.

## Responsibilities

- **UI Implementation**: Develop responsive and visually stunning components using React 19 and TailwindCSS.
- **Visualizations**: Enhance and maintain the `SmartVisualizer™` engine for interactive algorithm animations.
- **Code Editor**: Manage the Monaco Editor integration, including Vim mode and multi-language support.
- **State Management**: Use React Context and ViewModels (`frontend/src/viewmodels`) for clean business logic separation in the UI.
- **Performance**: Optimize rendering and search (using the Trie-based `SearchEngine`).

## Guidelines

- Follow the established design system (Dark/Light themes, Framer Motion animations).
- Place business logic in hooks/viewmodels, not directly in components.
- Ensure 100% accessibility and responsiveness.
- Use `frontend/src/models` for all UI-related TypeScript interfaces.
