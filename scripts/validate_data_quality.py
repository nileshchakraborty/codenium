import json
import sys

PROBLEMS_PATH = 'api/data/problems.json'
SOLUTIONS_PATH = 'api/data/solutions.json'

def validate():
    print("Locked & Loaded: Starting Data Quality Validation...")
    
    try:
        with open(PROBLEMS_PATH, 'r') as f:
            problems_data = json.load(f)
        with open(SOLUTIONS_PATH, 'r') as f:
            solutions_data = json.load(f)
    except FileNotFoundError as e:
        print(f"CRITICAL ERROR: {e}")
        return

    problems_list = []
    for category in problems_data.get('categories', []):
        problems_list.extend(category.get('problems', []))
        
    solutions_map = solutions_data.get('solutions', {})
    
    total_problems = len(problems_list)
    missing_solutions = []
    
    # Language Coverage Stats
    lang_stats = {
        'python': {'real': 0, 'placeholder': 0},
        'java': {'real': 0, 'placeholder': 0},
        'cpp': {'real': 0, 'placeholder': 0},
        'javascript': {'real': 0, 'placeholder': 0},
        'go': {'real': 0, 'placeholder': 0},
        'rust': {'real': 0, 'placeholder': 0}
    }
    
    PLACEHOLDER_SUBSTRING = "Reference solution not yet available"
    NAIVE_APPROACH = "Naive approach"
    
    print(f"\n--- Integrity Check ---")
    print(f"Total Problems: {total_problems}")
    print(f"Total Solutions: {len(solutions_map)}")
    
    for prob in problems_list:
        slug = prob.get('slug')
        if not slug:
            print(f"WARNING: Problem found without slug: {prob.get('title')}")
            continue
            
        if slug not in solutions_map:
            missing_solutions.append(slug)
        else:
            # Check implementation quality
            sol = solutions_map[slug]
            impls = sol.get('implementations', {})
            
            # Check Python (root code field)
            py_code = sol.get('code', '')
            if not py_code:
                # Missing entirely
                pass
            elif NAIVE_APPROACH in py_code:
                lang_stats['python']['placeholder'] += 1
            else:
                lang_stats['python']['real'] += 1

            for lang in ['java', 'cpp', 'javascript', 'go', 'rust']:
                code_data = impls.get(lang, {}).get('code', '')
                if not code_data:
                    # Missing entirely
                    pass 
                elif PLACEHOLDER_SUBSTRING in code_data:
                    lang_stats[lang]['placeholder'] += 1
                else:
                    lang_stats[lang]['real'] += 1

    # --- Backward Check (Orphans) ---
    all_problem_slugs = set(p['slug'] for p in problems_list)
    orphan_solutions = [s for s in solutions_map.keys() if s not in all_problem_slugs]
    
    if orphan_solutions:
        print(f"\n[WARN] Found {len(orphan_solutions)} Orphan Solutions (No matching Problem):")
        # limit invalid printing
        print(", ".join(orphan_solutions[:10]))
    else:
        print(f"\n[PASS] No Orphan Solutions found.")

    # --- Consistency Check (Flags) ---
    flag_mismatches = []
    for p in problems_list:
        slug = p.get('slug')
        has_sol_flag = p.get('has_solution', False)
        exists_in_db = slug in solutions_map
        
        if has_sol_flag != exists_in_db:
             flag_mismatches.append(f"{slug} (Flag: {has_sol_flag}, DB: {exists_in_db})")

    if flag_mismatches:
         print(f"\n[WARN] Found {len(flag_mismatches)} 'has_solution' Flag Mismatches:")
         for m in flag_mismatches[:10]:
             print(f"  {m}")
    else:
         print(f"\n[PASS] 'has_solution' flags are consistent.")


    if missing_solutions:
        print(f"\n[FAIL] Found {len(missing_solutions)} problems missing solution entries:")
        for s in missing_solutions[:5]:
             print(f"  - {s}")
        if len(missing_solutions) > 5: print("  ...")
    else:
        print("\n[PASS] All problems have a corresponding solution entry.")
        
    print(f"\n--- Quality Check (Multi-Language Coverage) ---")
    print(f"{'Language':<12} | {'Real Code':<10} | {'Placeholder':<12} | {'Coverage %':<10}")
    print("-" * 50)
    
    all_langs_good = True
    for lang, stats in lang_stats.items():
        total = stats['real'] + stats['placeholder']
        if total == 0:
            coverage = 0
            real_pct = 0
        else:
            coverage = (total / total_problems) * 100
            real_pct = (stats['real'] / total) * 100
            
        print(f"{lang:<12} | {stats['real']:<10} | {stats['placeholder']:<12} | {real_pct:.1f}%")
        
        if real_pct < 50:
            all_langs_good = False

    if all_langs_good:
        print("\n[PASS] Excellent quality! Most problems have real multi-language implementations.")
    else:
        print("\n[WARN] Some languages rely heavily on placeholders. Consider scraping more sources.")

if __name__ == '__main__':
    validate()
