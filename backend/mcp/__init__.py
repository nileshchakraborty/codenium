"""
MCP (Model Context Protocol) Package
Provides context building and tool definitions for AI interactions.
"""
from .context import (
    ProblemContext,
    MCPRequest,
    MCPResponse,
    build_context_from_solution,
)
from .tools import (
    Tool,
    ToolRegistry,
    get_registry,
    register_tool,
)

__all__ = [
    "ProblemContext",
    "MCPRequest",
    "MCPResponse",
    "build_context_from_solution",
    "Tool",
    "ToolRegistry",
    "get_registry",
    "register_tool",
]
