#!/usr/bin/env python3
"""
Script to check and fix indentation in solutions.json.
"""

import json
import os

SOLUTIONS_PATH = 'api/data/solutions.json'


def fix_indent():
    """Check for indentation issues in solutions."""
    if not os.path.exists(SOLUTIONS_PATH):
        print(f"File not found: {SOLUTIONS_PATH}")
        return

    with open(SOLUTIONS_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Logic to traverse and check indentation
    for slug, problem in data.items():
        impls = problem.get('implementations', {})

        for lang in ['javascript', 'typescript']:
            if lang in impls:
                obj = impls[lang]
                for key in ['code', 'initialCode']:
                    code = obj.get(key, '')
                    if 'class Solution' in code:
                        lines = code.split('\n')
                        # Find the line with class Solution
                        class_line_idx = -1
                        indentation = ""

                        for idx, line in enumerate(lines):
                            if 'class Solution' in line:
                                class_line_idx = idx
                                # Capture leading whitespace
                                lstrip = line.lstrip()
                                indentation = line[:len(line) - len(lstrip)]
                                break

                        if class_line_idx != -1 and len(indentation) > 0:
                            print(f"Fixing indentation for {slug} ({lang})...")

                            # Remove that indentation from all lines
                            new_lines = []
                            for line in lines:
                                if line.startswith(indentation):
                                    new_lines.append(line[len(indentation):])
                                else:
                                    # If line is empty or doesn't have the
                                    # indentation, keep as is
                                    # Better to strip if it's just whitespace
                                    if not line.strip():
                                        new_lines.append("")
                                    else:
                                        new_lines.append(line)

                            fixed_code = '\n'.join(new_lines)
                            obj[key] = fixed_code

    # Save changes
    with open(SOLUTIONS_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print("Indentation check complete.")


def check_problem():
    """Print the code for a specific problem to check indentation manually."""
    if not os.path.exists(SOLUTIONS_PATH):
        print(f"File not found: {SOLUTIONS_PATH}")
        return

    with open(SOLUTIONS_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if 'valid-palindrome' in data:
        impls = data['valid-palindrome'].get('implementations', {})
        if 'javascript' in impls:
            print(impls['javascript']['code'])


if __name__ == "__main__":
    check_problem()
