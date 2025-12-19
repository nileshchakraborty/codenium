import json
from pathlib import Path
import sys
import time

# Add current dir to path
sys.path.append(str(Path(__file__).resolve().parent))
from main import title_to_slug, load_problems, load_solutions
from ai_engine import generate_solution_json, validate_and_fix

# Paths
BASE_DIR = Path(__file__).resolve().parent
SOLUTIONS_FILE = BASE_DIR / "data" / "solutions.json"

def generate_missing():
    problems_data = load_problems()
    # Reload solutions freshly
    solutions_data = load_solutions()
    
    seen_slugs = set()
    missing_slugs = []
    
    # Identify missing
    for cat in problems_data.get("categories", []):
        for p in cat["problems"]:
            slug = p.get("slug")
            if not slug:
                continue
            
            if slug not in solutions_data.get("solutions", {}):
                if slug not in seen_slugs:
                    missing_slugs.append((slug, p["title"]))
                    seen_slugs.add(slug)
    
    print(f"Total missing solutions: {len(missing_slugs)}")
    
    # Limit to batches ? 
    # For now, let's try to process them. 
    # If the user stops the script, we should save progress.
    
    count = 0
    for slug, title in missing_slugs:
        count += 1
        print(f"[{count}/{len(missing_slugs)}] Generating solution for: {title} ({slug})...")
        
        try:
            # 1. Generate
            # We don't have problem description easily accessible unless we scrape or ask AI to hallucinate it.
            # We will ask AI to solve it based on Title. Top 150/75 are well known.
            desc = f"LeetCode problem: {title}"
            solution_data = generate_solution_json(title, desc)
            
            if "error" in solution_data:
                print(f"  Error generating: {solution_data['error']}")
                continue
            
            # 2. Validate
            # This runs the code against the generated test cases
            solution_data, passed = validate_and_fix(solution_data, slug)
            
            # 3. Save to memory dict
            solution_data["generated"] = True
            solution_data["validationPassed"] = passed
            solution_data["title"] = title
            
            solutions_data["solutions"][slug] = solution_data
            
            # 4. Save to file immediately (safer)
            with open(SOLUTIONS_FILE, "w") as f:
                json.dump(solutions_data, f, indent=4)
                
            print(f"  Saved. Validation Passed: {passed}")
            
            # Sleep slightly to ignore rate limits if using public API?
            # Local Ollama - depends on GPU.
            
        except Exception as e:
            print(f"  Exception: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    generate_missing()
