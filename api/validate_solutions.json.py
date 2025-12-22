
import json
import sys

def validate_solutions(filepath):
    try:
        with open(filepath, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    issues = []
    
    for slug, problem in data.items():
        # Check code format
        code = problem.get('code', '')
        if code and not code.strip().startswith('class Solution:'):
            # Some older ones might rely on top-level functions, but we want class Solution now
            # Brute force check if it has "def " but not class Solution
            if "def " in code:
               issues.append(f"[{slug}] Code does not start with 'class Solution:'")

        # Check for truncated examples
        examples = problem.get('examples', [])
        for i, ex in enumerate(examples):
            inp = ex.get('input', '')
            if '...' in inp:
                issues.append(f"[{slug}] Example {i+1} input contains '...': {inp}")
                
        # Check for truncated testCases
        test_cases = problem.get('testCases', [])
        for i, tc in enumerate(test_cases):
            inp = tc.get('input', '')
            if '...' in inp:
                issues.append(f"[{slug}] TestCase {i+1} input contains '...': {inp}")

    if not issues:
        print("No issues found!")
    else:
        print(f"Found {len(issues)} issues:")
        for issue in issues:
            print(issue)

if __name__ == "__main__":
    validate_solutions('/Users/nileshchakraborty/workspace/study/leetcode-visual/api/data/solutions.json')
