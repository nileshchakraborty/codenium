"""
Base Adapter Interface for AI Providers
Implements the Adapter pattern for swappable AI backends.
"""
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
from dataclasses import dataclass


@dataclass
class GenerationConfig:
    """Configuration for text generation"""
    temperature: float = 0.7
    max_tokens: int = 4096
    stream: bool = False
    format: Optional[str] = None  # e.g., "json"


@dataclass
class Message:
    """Chat message format"""
    role: str  # "system", "user", "assistant"
    content: str


class AIAdapter(ABC):
    """
    Abstract base class for AI provider adapters.
    All AI providers must implement this interface.
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return the adapter name"""
        pass
    
    @abstractmethod
    def generate(
        self, 
        prompt: str, 
        system: str = "",
        config: Optional[GenerationConfig] = None
    ) -> Dict[str, Any]:
        """
        Generate a response from a single prompt.
        
        Args:
            prompt: The user prompt
            system: Optional system prompt
            config: Generation configuration
            
        Returns:
            Dict with 'response' or 'error' key
        """
        pass
    
    @abstractmethod
    def chat(
        self, 
        messages: List[Message],
        config: Optional[GenerationConfig] = None
    ) -> Dict[str, Any]:
        """
        Generate a response from a chat conversation.
        
        Args:
            messages: List of Message objects
            config: Generation configuration
            
        Returns:
            Dict with 'response' or 'error' key
        """
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """
        Check if the AI provider is available.
        
        Returns:
            True if the provider can be reached
        """
        pass
    
    def generate_json(
        self, 
        prompt: str, 
        system: str = ""
    ) -> Dict[str, Any]:
        """
        Generate a JSON response.
        
        Args:
            prompt: The user prompt
            system: Optional system prompt
            
        Returns:
            Parsed JSON dict or error dict
        """
        config = GenerationConfig(format="json")
        return self.generate(prompt, system, config)
