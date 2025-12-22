
import json
import re
import shutil
import os

SOLUTIONS_PATH = '/Users/nileshchakraborty/workspace/study/leetcode-visual/api/data/solutions.json'
BACKUP_PATH = '/Users/nileshchakraborty/workspace/study/leetcode-visual/api/data/solutions.json.bak'

def migrate_solutions():
    if not os.path.exists(SOLUTIONS_PATH):
        print("solutions.json not found!")
        return

    # Backup
    shutil.copy2(SOLUTIONS_PATH, BACKUP_PATH)
    print(f"Backed up to {BACKUP_PATH}")

    try:
        with open(SOLUTIONS_PATH, 'r') as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading JSON: {e}")
        return

    count = 0
    
    for slug, problem in data.items():
        code = problem.get('code', '')
        if not code:
            continue

        # Check if code needs migration (doesn't have class Solution but has def)
        if "class Solution" not in code and "def " in code:
            print(f"Migrating {slug}...")
            
            lines = code.split('\n')
            new_lines = ["class Solution:"]
            
            # Regex to find function definition: def method_name(arg1, ...):
            # We want to insert 'self' as the first argument
            def_pattern = re.compile(r'^(\s*)def\s+([a-zA-Z0-9_]+)\s*\((.*)\):')
            
            for line in lines:
                # Indent every line
                indent = "    "
                
                # Check for function definition to inject self
                match = def_pattern.match(line)
                if match:
                    prefix = match.group(1)
                    func_name = match.group(2)
                    args = match.group(3)
                    
                    # If self is not already the first arg
                    if not args.strip().startswith('self'):
                        if args.strip():
                            new_args = f"self, {args}"
                        else:
                            new_args = "self"
                        
                        line = f"{prefix}def {func_name}({new_args}):"
                
                new_lines.append(indent + line)
            
            problem['code'] = '\n'.join(new_lines)
            count += 1

    if count > 0:
        with open(SOLUTIONS_PATH, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Successfully migrated {count} solutions!")
    else:
        print("No solutions needed migration.")

if __name__ == "__main__":
    migrate_solutions()
