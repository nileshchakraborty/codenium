"""
MCP (Model Context Protocol) Context Builder
Provides standardized context format for AI interactions.
"""
from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
import json


@dataclass
class ProblemContext:
    """Represents a LeetCode problem context for AI"""
    title: str
    slug: str
    description: str = ""
    difficulty: str = ""
    constraints: List[str] = field(default_factory=list)
    hints: List[str] = field(default_factory=list)
    examples: List[Dict[str, str]] = field(default_factory=list)
    pattern: str = ""
    tags: List[str] = field(default_factory=list)
    
    def to_prompt(self) -> str:
        """Convert to a formatted prompt string"""
        parts = [f"# {self.title}"]
        
        if self.difficulty:
            parts.append(f"**Difficulty:** {self.difficulty}")
        
        if self.description:
            parts.append(f"\n## Description\n{self.description}")
        
        if self.examples:
            parts.append("\n## Examples")
            for i, ex in enumerate(self.examples, 1):
                parts.append(f"\n**Example {i}:**")
                if 'input' in ex:
                    parts.append(f"- Input: `{ex['input']}`")
                if 'output' in ex:
                    parts.append(f"- Output: `{ex['output']}`")
                if 'explanation' in ex:
                    parts.append(f"- Explanation: {ex['explanation']}")
        
        if self.constraints:
            parts.append("\n## Constraints")
            for c in self.constraints:
                parts.append(f"- {c}")
        
        if self.hints:
            parts.append("\n## Hints")
            for h in self.hints:
                parts.append(f"- {h}")
        
        if self.pattern:
            parts.append(f"\n**Pattern:** {self.pattern}")
        
        return "\n".join(parts)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary"""
        return {
            "title": self.title,
            "slug": self.slug,
            "description": self.description,
            "difficulty": self.difficulty,
            "constraints": self.constraints,
            "hints": self.hints,
            "examples": self.examples,
            "pattern": self.pattern,
            "tags": self.tags,
        }


@dataclass  
class MCPRequest:
    """MCP-style request format"""
    context: ProblemContext
    instruction: str
    history: List[Dict[str, str]] = field(default_factory=list)
    tools: List[str] = field(default_factory=list)  # Available tools
    
    def to_messages(self, system_prompt: str) -> List[Dict[str, str]]:
        """Convert to messages format for chat"""
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add context as system message
        context_str = f"Context:\n{self.context.to_prompt()}"
        messages.append({"role": "system", "content": context_str})
        
        # Add available tools info if any
        if self.tools:
            tools_str = f"Available tools: {', '.join(self.tools)}"
            messages.append({"role": "system", "content": tools_str})
        
        # Add history
        for msg in self.history:
            messages.append(msg)
        
        # Add current instruction
        messages.append({"role": "user", "content": self.instruction})
        
        return messages


@dataclass
class MCPResponse:
    """MCP-style response format"""
    content: str
    tool_calls: List[Dict[str, Any]] = field(default_factory=list)
    error: Optional[str] = None
    
    @property
    def success(self) -> bool:
        return self.error is None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "content": self.content,
            "tool_calls": self.tool_calls,
            "error": self.error,
            "success": self.success,
        }


def build_context_from_solution(solution_data: Dict[str, Any], slug: str) -> ProblemContext:
    """Build ProblemContext from solution data"""
    return ProblemContext(
        title=solution_data.get('title', slug.replace('-', ' ').title()),
        slug=slug,
        description=solution_data.get('description', solution_data.get('oneliner', '')),
        difficulty='',  # Could be added from problems.json
        constraints=solution_data.get('constraints', []),
        hints=solution_data.get('hints', []),
        examples=solution_data.get('examples', solution_data.get('testCases', [])),
        pattern=solution_data.get('pattern', ''),
        tags=[],
    )
