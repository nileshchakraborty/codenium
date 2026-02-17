import json
import os
import sys

def validate_json(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error reading {path}: {e}")
        sys.exit(1)

def main():
    problems_path = 'system-design/data/problems.json'
    topics_path = 'system-design/data/topics.json'
    gkcs_path = 'system-design/data/gkcs_metadata.json'
    hello_path = 'system-design/data/hello_interview_metadata.json'

    problems = validate_json(problems_path)
    topics = validate_json(topics_path)
    gkcs = validate_json(gkcs_path)
    hello = validate_json(hello_path)

    topic_ids = {t['id'] for t in topics}
    problem_slugs = {p['slug'] for p in problems}

    errors = 0

    # Validate problems
    for p in problems:
        category = p.get('category')
        if not category:
            print(f"Error: Problem '{p['title']}' is missing a category")
            errors += 1
        elif category not in topic_ids:
            print(f"Error: Problem '{p['title']}' has unknown category '{category}'")
            errors += 1


    # Validate metadata mappings
    for entry in gkcs:
        if entry['slug'] not in problem_slugs:
            print(f"Error: GKCS metadata references unknown slug '{entry['slug']}'")
            errors += 1

    for entry in hello:
        if entry['slug'] not in problem_slugs:
            print(f"Error: Hello Interview metadata references unknown slug '{entry['slug']}'")
            errors += 1

    if errors == 0:
        print("\n✅ System Design data validation passed!")
    else:
        print(f"\n❌ Validation failed with {errors} errors.")
        sys.exit(1)

if __name__ == "__main__":
    main()
