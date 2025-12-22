import json
import re

def generate_implementations():
    print("Starting multi-language template generation...")
    try:
        with open('api/data/solutions.json', 'r') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: api/data/solutions.json not found.")
        return

    solutions = data.get('solutions', {})
    count = 0
    
    for slug, problem in solutions.items():
        python_code = problem.get('code', '') or problem.get('initialCode', '')
        if not python_code:
            continue
            
        # Regex to find def method(self, ...):
        # We need to handle multi-line defs slightly carefully, but usually they are single line in our json
        match = re.search(r'def\s+(\w+)\s*\(([^)]*)\)', python_code)
        
        if not match:
            # Try to match the function if it's not in a class yet (just in case)
            match = re.search(r'def\s+(\w+)\s*\(([^)]*)\)', python_code)
            
        if not match:
            print(f"Skipping {slug}: Could not parse Python function definition from code: {python_code[:50]}...")
            continue
            
        func_name = match.group(1)
        args_str = match.group(2)
        
        # Parse params
        params = [p.strip().split(':')[0].strip() for p in args_str.split(',') if p.strip()]
        # Filter self
        params = [p for p in params if p != 'self']
        
        implementations = {}
        
        # JavaScript
        js_params = ', '.join(params)
        js_doc_params = '\n'.join([f" * @param {{any}} {p}" for p in params])
        js_initial = f"/**\n{js_doc_params}\n * @return {{any}}\n */\nvar {func_name} = function({js_params}) {{\n    // Your code here\n}};"
        implementations['javascript'] = {
            "initialCode": js_initial,
            "code": js_initial.replace("// Your code here", "// Reference solution not yet available.\n    // Use the AI Tutor to generate a solution!")
        }
        
        # Java
        java_params = ', '.join([f"int {p}" for p in params])
        java_initial = f"class Solution {{\n    public int {func_name}({java_params}) {{\n        // Your code here\n        return 0;\n    }}\n}}"
        implementations['java'] = {
            "initialCode": java_initial,
            "code": java_initial.replace("// Your code here", "// Reference solution not yet available.\n        // Use the AI Tutor to generate a solution!")
        }
        
        # C++
        cpp_params = ', '.join([f"int {p}" for p in params])
        cpp_initial = f"class Solution {{\npublic:\n    int {func_name}({cpp_params}) {{\n        // Your code here\n        return 0;\n    }}\n}};"
        implementations['cpp'] = {
            "initialCode": cpp_initial,
            "code": cpp_initial.replace("// Your code here", "// Reference solution not yet available.\n        // Use the AI Tutor to generate a solution!")
        }

        # Go
        go_params = ', '.join([f"{p} int" for p in params])
        go_initial = f"func {func_name}({go_params}) int {{\n    // Your code here\n    return 0\n}}"
        implementations['go'] = {
            "initialCode": go_initial,
            "code": go_initial.replace("// Your code here", "// Reference solution not yet available.\n    // Use the AI Tutor to generate a solution!")
        }

        # Rust
        rust_func_name = re.sub(r'(?<!^)(?=[A-Z])', '_', func_name).lower() # snake_case
        rust_params = ', '.join([f"{p}: i32" for p in params])
        rust_initial = f"impl Solution {{\n    pub fn {rust_func_name}({rust_params}) -> i32 {{\n        // Your code here\n        0\n    }}\n}}"
        implementations['rust'] = {
            "initialCode": rust_initial,
            "code": rust_initial.replace("// Your code here", "// Reference solution not yet available.\n        // Use the AI Tutor to generate a solution!")
        }
        
        # Python (preserve existing)
        implementations['python'] = {
            "initialCode": python_code
        }
        
        # Update problem
        problem['implementations'] = implementations
        count += 1
        
    print(f"Updated {count} problems with multi-language templates.")
        
    with open('api/data/solutions.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Successfully saved api/data/solutions.json")

if __name__ == '__main__':
    generate_implementations()
