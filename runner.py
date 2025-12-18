import json
import subprocess
import sys
import tempfile
import os
import inspect

def execute_code(code, test_cases):
    """
    Executes the given Python code against the provided test cases.
    Returns a result dict with passed/failed status and details.
    """
    # Runner script template
    runner_code = """
import json
import inspect
import sys

# ... [Same logic as before, but cleaner] ...
def run_tests_internal():
    results = []
    all_passed = True
    test_cases = """ + json.dumps(test_cases) + """
    
    # helper to find solution function
    def find_solution_func(locals_dict):
        # Filter for functions defined in this module
        functions = [obj for name, obj in list(locals_dict.items()) 
                    if callable(obj) and obj.__module__ == '__main__' and name != 'run_tests_internal']
        if not functions: return None
        return functions[-1]

    solution_func = find_solution_func(locals())
    
    if not solution_func:
        print(json.dumps({"passed": False, "results": [], "error": "No function found. Please define a function."}))
        return

    for i, test in enumerate(test_cases):
        try:
            # Parse inputs
            local_scope = {}
            exec(test['input'], {}, local_scope)
            
            # Smart arg matching
            sig = inspect.signature(solution_func)
            args = []
            for param in sig.parameters:
                if param in local_scope:
                    args.append(local_scope[param])
                else:
                    pass # Hope for the best or default

            if len(args) != len(sig.parameters):
                 # Fallback for simple cases if names don't match
                 # e.g. input "nums = ..." func(a)"
                 pass

            result = solution_func(*args)
            
            # Eval expected
            expected = eval(test['output'])
            
            # Compare
            passed = (result == expected)
            if not passed:
                all_passed = False
                
            results.append({
                "case": i + 1,
                "passed": passed,
                "input": test['input'],
                "expected": str(expected),
                "actual": str(result)
            })
            
        except Exception as e:
            all_passed = False
            results.append({
                "case": i + 1,
                "passed": False,
                "input": test['input'],
                "error": str(e)
            })
    
    print(json.dumps({"passed": all_passed, "results": results}))

if __name__ == "__main__":
    try:
        run_tests_internal()
    except Exception as e:
        print(json.dumps({"passed": False, "results": [], "error": str(e)}))
"""
    
    full_script = code + "\n\n" + runner_code

    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as temp:
        temp.write(full_script)
        temp_path = temp.name

    try:
        process = subprocess.run(
            [sys.executable, temp_path],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        stdout = process.stdout
        stderr = process.stderr
        
        try:
            lines = stdout.strip().split('\n')
            if not lines or not lines[-1].strip():
                 return {"success": False, "error": "No output", "logs": stdout, "stderr": stderr}
            result_json = json.loads(lines[-1])
            logs = '\n'.join(lines[:-1])
            return {
                "success": True,
                "passed": result_json.get("passed", False),
                "results": result_json.get("results", []),
                "logs": logs,
                "error": result_json.get("error", None) or stderr
            }
        except json.JSONDecodeError:
             return {"success": False, "error": "JSON Decode Error", "logs": stdout, "stderr": stderr}
             
    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Timeout"}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
