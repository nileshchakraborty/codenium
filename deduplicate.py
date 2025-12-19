import json
from pathlib import Path
import sys

# Add current dir to path to import main/ai_engine if needed later
sys.path.append(str(Path(__file__).resolve().parent))
from main import title_to_slug, load_problems

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "problems.json"

def deduplicate():
    with open(DATA_FILE, "r") as f:
        data = json.load(f)

    seen_slugs = set()
    cleaned_categories = []
    
    total_removed = 0

    # We want to keep "major" categories first if possible.
    # The existing order in problems.json is usually manually curated first.
    
    for cat in data.get("categories", []):
        new_problems = []
        for p in cat["problems"]:
            title = p.get("title")
            
            # Filter invalid titles like ">" or empty
            if not title or len(title) < 2 or title == ">":
                print(f"Removing invalid problem: {title}")
                total_removed += 1
                continue
                
            slug = p.get("slug") or title_to_slug(title)
            
            if slug in seen_slugs:
                print(f"Removing duplicate: {slug} from {cat['name']}")
                total_removed += 1
                continue
            
            seen_slugs.add(slug)
            # Ensure slug is set
            p["slug"] = slug
            new_problems.append(p)
        
        cat["problems"] = new_problems
        if new_problems:
             cleaned_categories.append(cat)
        else:
            print(f"Removing empty category: {cat['name']}")

    data["categories"] = cleaned_categories

    print(f"\nTotal removed: {total_removed}")
    
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    deduplicate()
