"""
OpenAI API Adapter
Implements the AIAdapter interface for OpenAI models.
"""
import json
import os
from typing import Dict, List, Any, Optional

from .base_adapter import AIAdapter, GenerationConfig, Message


class OpenAIAdapter(AIAdapter):
    """
    Adapter for OpenAI API.
    Requires OPENAI_API_KEY environment variable.
    """
    
    def __init__(
        self, 
        api_key: Optional[str] = None,
        model: str = "gpt-4o-mini",
        timeout: int = 120
    ):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        self.model = model
        self.timeout = timeout
        self.base_url = "https://api.openai.com/v1"
        self._client = None
    
    @property
    def name(self) -> str:
        return f"openai/{self.model}"
    
    def _get_client(self):
        """Lazy load OpenAI client"""
        if self._client is None:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=self.api_key)
            except ImportError:
                raise ImportError("openai package not installed. Run: pip install openai")
        return self._client
    
    def is_available(self) -> bool:
        """Check if OpenAI API key is configured"""
        return bool(self.api_key)
    
    def generate(
        self, 
        prompt: str, 
        system: str = "",
        config: Optional[GenerationConfig] = None
    ) -> Dict[str, Any]:
        """Generate response using OpenAI chat completions"""
        config = config or GenerationConfig()
        
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        
        try:
            client = self._get_client()
            
            kwargs = {
                "model": self.model,
                "messages": messages,
                "temperature": config.temperature,
                "max_tokens": config.max_tokens,
            }
            
            # Handle JSON mode
            if config.format == "json":
                kwargs["response_format"] = {"type": "json_object"}
            
            response = client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content
            
            # If JSON format requested, parse it
            if config.format == "json":
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    return {"error": "Failed to parse JSON response", "raw": content}
            
            return {"response": content}
            
        except ImportError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"OpenAI Error: {str(e)}"}
    
    def chat(
        self, 
        messages: List[Message],
        config: Optional[GenerationConfig] = None
    ) -> Dict[str, Any]:
        """Generate response using OpenAI chat completions"""
        config = config or GenerationConfig()
        
        # Convert Message objects to dicts
        msg_dicts = [{"role": m.role, "content": m.content} for m in messages]
        
        try:
            client = self._get_client()
            
            response = client.chat.completions.create(
                model=self.model,
                messages=msg_dicts,
                temperature=config.temperature,
                max_tokens=config.max_tokens,
            )
            
            content = response.choices[0].message.content
            return {"response": content}
            
        except ImportError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"OpenAI Error: {str(e)}"}
