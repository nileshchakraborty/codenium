import json
import requests
import re
from runner import execute_code
import time

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:14b" # Optimized for coding tasks

SYSTEM_PROMPT = """You are an expert LeetCode tutor helping ADHD students. 
Your goal is to explain the problem VISUALLY and succinctly.

Output MUST be valid JSON with this exact structure:
{
    "pattern": "Two Pointers",
    "patternEmoji": "👉👈",
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "oneliner": "Use two pointers starting from ends to find the pair.",
    "intuition": [
        "First intuition bullet",
        "Second intuition bullet"
    ],
    "visualizationType": "array", 
    "initialState": [2, 7, 11, 15],
    "animationSteps": [
        {
            "type": "highlight",
            "indices": [0, 3],
            "color": "accent",
            "pointers": [ { "index": 0, "label": "L" }, { "index": 3, "label": "R" } ],
            "transientMessage": "Sum = 17. Too big!"
        },
        {
            "type": "highlight",
            "indices": [0, 2],
            "color": "success",
            "pointers": [ { "index": 0, "label": "L" }, { "index": 2, "label": "R" } ],
            "transientMessage": "Sum = 13. Match!"
        }
    ],
    "code": "def twoSum(nums, target):\\n    ...",
    "keyInsight": "The array is sorted, so we can use directionality.",
    "testCases": [
        { "input": "numbers = [2,7,11,15], target = 9", "output": "[1, 2]" }
    ]
}

VISUALIZATION RULES:
- "visualizationType": Only "array" (for now).
- "initialState": The starting array of numbers.
- "animationSteps": List of visual changes. 
  - "indices": 0-based indexes to highlight.
  - "color": "accent" (blue) or "success" (green).
  - "pointers": Optional list of {index, label} objects.
  - "transientMessage": Short message shown for this step.
- "code" MUST be a valid Python function.
- "testCases" MUST have valid python input assignment strings.
"""

def generate_solution_json(problem_title, problem_desc):
    prompt = f"""
    Problem: {problem_title}
    Description: {problem_desc}
    
    Generate the JSON solution.
    """
    
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "system": SYSTEM_PROMPT,
            "stream": False,
            "format": "json" 
        }, timeout=60)
        
        if response.status_code != 200:
            return {"error": f"Ollama Error: {response.text}"}
            
        result = response.json()
        content = result['response']
        
        # Parse JSON
        try:
            data = json.loads(content)
            return data
        except json.JSONDecodeError:
            # Try to fix common JSON issues or extract from markdown
            match = re.search(r'\{.*\}', content, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except:
                    pass
            return {"error": "Failed to parse JSON from AI response", "raw": content}
            
    except Exception as e:
        return {"error": str(e)}

def validate_and_fix(solution_data, problem_slug):
    """
    Validates code against test cases. If fails, asks AI to fix.
    """
    code = solution_data.get('code')
    test_cases = solution_data.get('testCases')
    
    if not code or not test_cases:
        return solution_data, False
        
    # Run tests
    result = execute_code(code, test_cases)
    
    if result['success'] and result['passed']:
        return solution_data, True
        
    # If failed, try to fix (Simple retry logic for now)
    # in a real app, we'd feed the error back to LLM
    print(f"Validation failed for {problem_slug}: {result.get('error') or 'Tests failed'}")
    return solution_data, False
