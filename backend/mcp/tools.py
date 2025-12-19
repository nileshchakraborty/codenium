"""
MCP Tools Definition
Defines tools that can be called by the AI during problem solving.
"""
from dataclasses import dataclass
from typing import Dict, Any, Callable, List
import json


@dataclass
class Tool:
    """Definition of an MCP tool"""
    name: str
    description: str
    parameters: Dict[str, Any]
    handler: Callable[..., Any]
    
    def to_schema(self) -> Dict[str, Any]:
        """Convert to JSON schema format"""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }


class ToolRegistry:
    """Registry of available tools"""
    
    def __init__(self):
        self._tools: Dict[str, Tool] = {}
    
    def register(self, tool: Tool) -> None:
        """Register a tool"""
        self._tools[tool.name] = tool
    
    def get(self, name: str) -> Tool:
        """Get a tool by name"""
        return self._tools.get(name)
    
    def list_tools(self) -> List[str]:
        """List all tool names"""
        return list(self._tools.keys())
    
    def get_schemas(self) -> List[Dict[str, Any]]:
        """Get all tool schemas"""
        return [t.to_schema() for t in self._tools.values()]
    
    def execute(self, name: str, **kwargs) -> Any:
        """Execute a tool by name"""
        tool = self.get(name)
        if not tool:
            return {"error": f"Tool '{name}' not found"}
        try:
            return tool.handler(**kwargs)
        except Exception as e:
            return {"error": str(e)}


# Global registry
_registry = ToolRegistry()


def register_tool(name: str, description: str, parameters: Dict[str, Any]):
    """Decorator to register a function as a tool"""
    def decorator(func: Callable) -> Callable:
        tool = Tool(
            name=name,
            description=description,
            parameters=parameters,
            handler=func
        )
        _registry.register(tool)
        return func
    return decorator


def get_registry() -> ToolRegistry:
    """Get the global tool registry"""
    return _registry


# ============ Built-in Tools ============

@register_tool(
    name="run_code",
    description="Execute Python code against test cases",
    parameters={
        "type": "object",
        "properties": {
            "code": {"type": "string", "description": "Python code to execute"},
            "test_cases": {"type": "array", "description": "List of test cases"}
        },
        "required": ["code", "test_cases"]
    }
)
def tool_run_code(code: str, test_cases: List[Dict]) -> Dict[str, Any]:
    """Execute code against test cases"""
    # Import here to avoid circular imports
    from runner import execute_code
    return execute_code(code, test_cases)


@register_tool(
    name="get_hints",
    description="Get hints for a problem",
    parameters={
        "type": "object",
        "properties": {
            "slug": {"type": "string", "description": "Problem slug"},
            "hint_index": {"type": "integer", "description": "Which hint to get (0-indexed)"}
        },
        "required": ["slug"]
    }
)
def tool_get_hints(slug: str, hint_index: int = 0) -> Dict[str, Any]:
    """Get hints for a problem"""
    import json
    from pathlib import Path
    
    solutions_file = Path(__file__).parent.parent.parent / "data" / "solutions.json"
    
    try:
        with open(solutions_file) as f:
            data = json.load(f)
        
        if slug not in data.get('solutions', {}):
            return {"error": f"Problem '{slug}' not found"}
        
        hints = data['solutions'][slug].get('hints', [])
        
        if not hints:
            return {"hint": "No hints available for this problem."}
        
        if hint_index >= len(hints):
            hint_index = len(hints) - 1
        
        return {
            "hint": hints[hint_index],
            "hint_number": hint_index + 1,
            "total_hints": len(hints)
        }
        
    except Exception as e:
        return {"error": str(e)}


@register_tool(
    name="get_related_problems",
    description="Get related problems for practice",
    parameters={
        "type": "object",
        "properties": {
            "slug": {"type": "string", "description": "Problem slug"}
        },
        "required": ["slug"]
    }
)
def tool_get_related_problems(slug: str) -> Dict[str, Any]:
    """Get related problems"""
    import json
    from pathlib import Path
    
    solutions_file = Path(__file__).parent.parent.parent / "data" / "solutions.json"
    
    try:
        with open(solutions_file) as f:
            data = json.load(f)
        
        if slug not in data.get('solutions', {}):
            return {"error": f"Problem '{slug}' not found"}
        
        related = data['solutions'][slug].get('relatedProblems', [])
        
        return {
            "related_problems": related,
            "count": len(related)
        }
        
    except Exception as e:
        return {"error": str(e)}
