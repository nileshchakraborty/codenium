"""
AI Adapters Package
Provides adapters for different AI providers.
"""
from .base_adapter import AIAdapter, GenerationConfig, Message
from .ollama_adapter import OllamaAdapter
from .openai_adapter import OpenAIAdapter

__all__ = [
    "AIAdapter",
    "GenerationConfig", 
    "Message",
    "OllamaAdapter",
    "OpenAIAdapter",
]
