"""
Backend Package
Provides AI adapters, MCP protocol, and configuration.
"""
from .config import Config, get_config
from .factory import AdapterFactory, get_adapter
from .adapters import AIAdapter, OllamaAdapter, OpenAIAdapter, Message, GenerationConfig
from .mcp import ProblemContext, MCPRequest, MCPResponse, build_context_from_solution

__all__ = [
    # Config
    "Config",
    "get_config",
    # Factory
    "AdapterFactory", 
    "get_adapter",
    # Adapters
    "AIAdapter",
    "OllamaAdapter",
    "OpenAIAdapter",
    "Message",
    "GenerationConfig",
    # MCP
    "ProblemContext",
    "MCPRequest",
    "MCPResponse",
    "build_context_from_solution",
]
