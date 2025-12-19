import json
import requests
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "problems.json"
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:14b"

CANONICAL_TOPICS = [
    "Array / String", "Two Pointers", "Sliding Window", "Matrix", "Hashmap", 
    "Intervals", "Stack", "Linked List", "Binary Tree General", "Binary Tree BFS", 
    "Binary Search Tree", "Graph General", "Graph BFS", "Trie", "Backtracking", 
    "Divide & Conquer", "Kadane's Algorithm", "Binary Search", "Heap", 
    "Bit Manipulation", "Math", "1D DP", "Multidimensional DP"
]

def optimize_topics():
    if not DATA_FILE.exists():
        print("Data file not found")
        return

    with open(DATA_FILE, "r") as f:
        data = json.load(f)

    current_categories = [c["name"] for c in data["categories"]]
    
    # AI Prompt to map categories
    prompt = f"""
    You are organizing LeetCode problems.
    
    Target Canonical Topics:
    {json.dumps(CANONICAL_TOPICS, indent=2)}
    
    Current Topics to Map:
    {json.dumps(current_categories, indent=2)}
    
    Task:
    Map each "Current Topic" to the best fitting "Canonical Topic".
    If a topic is already canonical, map it to itself.
    If a topic is specific (e.g. "Two Pointer Mountain"), map it to the broader canonical topic (e.g. "Two Pointers").
    If it absolutely doesn't fit any, map to "Uncategorized", or suggest the closest one.
    
    Output JSON format:
    {{
        "mapping": {{
            "Current Topic Name": "Canonical Topic Name",
            ...
        }}
    }}
    """
    
    print("Asking AI to map topics...")
    try:
        response = requests.post(OLLAMA_URL, json={
            "model": MODEL,
            "prompt": prompt,
            "stream": False,
            "format": "json"
        }, timeout=300)
        
        if response.status_code != 200:
            print(f"Error: {response.text}")
            return

        result = response.json()
        mapping_data = json.loads(result['response'])
        mapping = mapping_data.get("mapping", {})
        
        # fallback for missing keys
        for c in current_categories:
            if c not in mapping:
                mapping[c] = "Uncategorized"
                
    except Exception as e:
        print(f"AI Failed: {e}")
        return

    # Reconstruct Data
    new_categories_map = { name: {"name": name, "icon": "📁", "problems": []} for name in CANONICAL_TOPICS }
    new_categories_map["Uncategorized"] = {"name": "Uncategorized", "icon": "❓", "problems": []}
    
    # Preserve icons from existing canonicals if possible
    for cat in data["categories"]:
        if cat["name"] in new_categories_map:
            new_categories_map[cat["name"]]["icon"] = cat.get("icon", "📁")

    count_moved = 0
    
    for cat in data["categories"]:
        original_name = cat["name"]
        target_name = mapping.get(original_name, "Uncategorized")
        
        if target_name not in new_categories_map:
             # Should be rare if AI follows instructions, but handle it
             new_categories_map[target_name] = {"name": target_name, "icon": "📁", "problems": []}
             
        target_cat = new_categories_map[target_name]
        
        for problem in cat["problems"]:
            # Add subTopic if it was moved from a different category name
            # OR if we just want to preserve the source structure.
            # User said "add a filter for sub topic"
            
            # If the original category is NOT the canonical one, treat it as a subtopic
            # Even if it IS canonical, maybe we don't need a subtopic? 
            # Or maybe "Array / String" IS the subtopic? 
            # Let's say: Subtopic = Original Category Name.
            
            problem["subTopic"] = original_name
            target_cat["problems"].append(problem)
            count_moved += 1

    # Convert map to list, filtering empty
    final_categories = []
    
    # Enforce canonical order
    for name in CANONICAL_TOPICS:
        if new_categories_map[name]["problems"]:
            final_categories.append(new_categories_map[name])
            
    # Add others (Uncategorized etc)
    for name, cat in new_categories_map.items():
        if name not in CANONICAL_TOPICS and cat["problems"]:
            final_categories.append(cat)
            
    data["categories"] = final_categories
    
    print(f"Reorganized {count_moved} problems into {len(final_categories)} categories.")
    
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    optimize_topics()
