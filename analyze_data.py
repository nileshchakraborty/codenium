import json
from pathlib import Path
import sys

# Add current dir to path to import main/ai_engine if needed later
sys.path.append(str(Path(__file__).resolve().parent))
from main import title_to_slug, load_problems, load_solutions

def analyze():
    problems_data = load_problems()
    solutions_data = load_solutions()
    
    existing_solutions = set(solutions_data.get("solutions", {}).keys())
    
    seen_slugs = set()
    duplicates = []
    missing_solutions = []
    total_problems = 0
    
    print("\n--- Analzying Problems ---")
    
    for cat in problems_data.get("categories", []):
        print(f"Category: {cat['name']} ({len(cat['problems'])} problems)")
        for p in cat["problems"]:
            slug = p.get("slug") or title_to_slug(p["title"])
            total_problems += 1
            
            if slug in seen_slugs:
                duplicates.append(f"{slug} (in {cat['name']})")
            else:
                seen_slugs.add(slug)
                
            if slug not in existing_solutions:
                missing_solutions.append(slug)

    print(f"\nTotal Problems: {total_problems}")
    print(f"Unique Slugs: {len(seen_slugs)}")
    print(f"Duplicates Found: {len(duplicates)}")
    if duplicates:
        print(f"Example duplicates: {duplicates[:5]}")
        
    print(f"\nMissing Solutions: {len(missing_solutions)}")
    if missing_solutions:
        print(f"Example missing: {missing_solutions[:5]}")

if __name__ == "__main__":
    analyze()
