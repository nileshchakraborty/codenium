import json

PROBLEMS_FILE = "data/problems.json"
SOLUTIONS_FILE = "data/solutions.json"

def load_json(path):
    with open(path, "r") as f:
        return json.load(f)

print("Auditing solutions...")
problems_data = load_json(PROBLEMS_FILE)
solutions_data = load_json(SOLUTIONS_FILE)

total_problems = 0
missing_solutions = []
low_quality_solutions = []
good_solutions = 0

for cat in problems_data["categories"]:
    for p in cat["problems"]:
        total_problems += 1
        slug = p["slug"]
        
        if slug not in solutions_data["solutions"]:
            missing_solutions.append(slug)
            continue
            
        sol = solutions_data["solutions"][slug]
        
        # Quality Checks
        reasons = []
        if not sol.get("intuition") or len(sol["intuition"]) < 2:
            reasons.append("weak intuition")
        if not sol.get("steps") and not sol.get("animationSteps"):
            reasons.append("no visuals")
        if not sol.get("patternEmoji"):
            reasons.append("no emoji")
            
        if reasons:
            low_quality_solutions.append(f"{slug} ({', '.join(reasons)})")
        else:
            good_solutions += 1

print(f"Total Problems: {total_problems}")
print(f"Good Solutions: {good_solutions}")
print(f"Missing Solutions: {len(missing_solutions)}")
print(f"Low Quality Solutions: {len(low_quality_solutions)}")

if missing_solutions:
    print("\nSample Missing:", missing_solutions[:5])
if low_quality_solutions:
    print("\nSample Low Quality:", low_quality_solutions[:5])
