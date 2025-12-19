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
# --- Data Structures & Helpers ---
class ListNode:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def list_to_ll(arr, pos=-1):
    if not arr: return None
    
    # Handle [[val, random_index], ...] format
    if arr and isinstance(arr[0], list) and len(arr[0]) == 2:
        nodes = []
        for val, _ in arr:
            nodes.append(ListNode(val))
        
        for i, (_, rand_idx) in enumerate(arr):
            if i < len(arr) - 1:
                nodes[i].next = nodes[i + 1]
            if rand_idx is not None:
                 nodes[i].random = nodes[rand_idx]
        return nodes[0]

    # Standard [1, 2, 3]
    head = ListNode(arr[0])
    curr = head
    nodes = [head]
    for x in arr[1:]:
        t = ListNode(x)
        curr.next = t
        curr = t
        nodes.append(t)
    
    if pos != -1 and 0 <= pos < len(nodes):
        curr.next = nodes[pos]

    return head

def ll_to_list(node):
    res = []
    curr = node
    has_random = False
    nodes_map = {}
    idx = 0
    visited = set()
    while curr and id(curr) not in visited:
        visited.add(id(curr))
        nodes_map[curr] = idx
        res.append(getattr(curr, 'val', None))
        if getattr(curr, 'random', None) is not None:
            has_random = True
        curr = getattr(curr, 'next', None)
        idx += 1
        
    if has_random:
        full_res = []
        curr = node
        visited = set()
        while curr and id(curr) not in visited:
            visited.add(id(curr))
            rand_node = getattr(curr, 'random', None)
            rand_idx = nodes_map.get(rand_node, None) if rand_node else None
            full_res.append([getattr(curr, 'val', None), rand_idx])
            curr = getattr(curr, 'next', None)
        return full_res
        
    return res

def list_to_tree(arr):
    if not arr: return None
    if not arr[0] and arr[0] != 0: return None # Handle [null]
    
    root = TreeNode(arr[0])
    q = [root]
    i = 1
    while q and i < len(arr):
        node = q.pop(0)
        
        # Left child
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            q.append(node.left)
        i += 1
        
        # Right child
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            q.append(node.right)
        i += 1
    return root

def tree_to_list(root):
    if not root: return []
    res = []
    q = [root]
    while q:
        node = q.pop(0)
        if node:
            res.append(node.val)
            q.append(node.left)
            q.append(node.right)
        else:
            res.append(None)
    
    # Trim trailing Nones
    while res and res[-1] is None:
        res.pop()
    return res



def adj_to_graph(adjList):
    if not adjList: return None
    n = len(adjList)
    if n == 0: return None
    nodes = [Node(i + 1) for i in range(n)]
    for i, neighbors in enumerate(adjList):
        nodes[i].neighbors = [nodes[j - 1] for j in neighbors]
    return nodes[0]

def graph_to_adj(node):
    if not node: return []
    from collections import deque
    nodes = {} # val -> node
    q = deque([node])
    nodes[node.val] = node
    while q:
        curr = q.popleft()
        for nei in curr.neighbors:
            if nei.val not in nodes:
                nodes[nei.val] = nei
                q.append(nei)
    
    if not nodes: return []
    max_val = max(nodes.keys())
    res = [[] for _ in range(max_val)]
    for val in range(1, max_val + 1):
            if val in nodes:
                res[val-1] = sorted([nei.val for nei in nodes[val].neighbors])
    return res

def run_tests_internal():
    results = []
    all_passed = True
    test_cases = """ + json.dumps(test_cases) + """
    
    # helper to find solution function
    def find_solution_func(locals_dict):
        # Filter for functions OR CLASSES defined in this module
        ignore = {'run_tests_internal', 'list_to_ll', 'll_to_list', 'list_to_tree', 'tree_to_list', 'adj_to_graph', 'graph_to_adj', 'ListNode', 'TreeNode', 'Node', 'null', 'true', 'false'}
        
        candidates = [obj for name, obj in list(locals_dict.items()) 
                    if (callable(obj) or inspect.isclass(obj)) and obj.__module__ == '__main__' and name not in ignore]
        if not candidates: return None
        return candidates[0]

    solution_func = find_solution_func(globals())
    
    if not solution_func:
        print(json.dumps({"passed": False, "results": [], "error": "No function/class found. Please define a function or class."}))
        return

    is_class_solution = inspect.isclass(solution_func)

    for i, test in enumerate(test_cases):
        try:
            # Parse inputs
            local_scope = {'null': None, 'true': True, 'false': False}
            exec(test['input'], globals(), local_scope)
            
            actual_val = None

            if is_class_solution:
                # Class Design Execution
                # Expected input vars: commands (list of str), args (list of lists)
                # Fallback: support user-defined input var names if needed, but standardizing on commands/args is best.
                cmd_var = next((k for k in local_scope if 'command' in k or 'method' in k or 'op' in k), None)
                arg_var = next((k for k in local_scope if 'arg' in k or 'input' in k or 'val' in k), None)
                
                if cmd_var and arg_var:
                    commands = local_scope[cmd_var]
                    arguments = local_scope[arg_var]
                    
                    # Instantiate
                    # First command is usually the class name, first arg is constructor args
                    obj = solution_func(*arguments[0])
                    res_list = [None] # Constructor returns None
                    
                    for cmd_idx in range(1, len(commands)):
                        method = commands[cmd_idx]
                        params = arguments[cmd_idx]
                        if hasattr(obj, method):
                            val = getattr(obj, method)(*params)
                            res_list.append(val)
                        else:
                            res_list.append(None)
                    actual_val = res_list
                else:
                    raise Exception("Class solution requires 'commands' and 'args' logic in test case.")

            else:
                # Standard Function Execution
                # Smart arg matching
                sig = inspect.signature(solution_func)
                args = []
                for param in sig.parameters:
                    if param in local_scope:
                        val = local_scope[param]
                        
                        # Heuristic: Convert lists to Linked List or Tree based on param name
                        if isinstance(val, list) and param in ['l1', 'l2', 'head', 'list1', 'list2', 'headA', 'headB']:
                            pos = local_scope.get('pos', -1)
                            val = list_to_ll(val, pos)
                        elif isinstance(val, list) and param in ['root', 'p', 'q', 'root1', 'root2', 'subRoot']:
                             val = list_to_tree(val)
                        elif isinstance(val, list) and param in ['node'] and all(isinstance(x, list) for x in val):
                             val = adj_to_graph(val)
                             
                        args.append(val)
                    else:
                        pass # Default logic

                if len(args) != len(sig.parameters):
                     pass

                result = solution_func(*args)
                
                if solution_func.__name__ == 'groupAnagrams' and isinstance(result, list):
                    try:
                        result = sorted([sorted(x) for x in result])
                    except: pass

                # Post-process result
                actual_val = result
                if isinstance(result, ListNode):
                    actual_val = ll_to_list(result)
                elif isinstance(result, TreeNode):
                    actual_val = tree_to_list(result)
                elif hasattr(result, 'val') and hasattr(result, 'neighbors'):
                    actual_val = graph_to_adj(result)
                elif hasattr(result, 'val') and hasattr(result, 'next') and hasattr(result, 'random'):
                    actual_val = ll_to_list(result)
                elif type(result).__name__ == 'Node':
                     if hasattr(result, 'neighbors'): actual_val = graph_to_adj(result)
                     elif hasattr(result, 'random'): actual_val = ll_to_list(result)
            
            # Eval expected
            expected = eval(test['output'], globals(), {'null': None, 'true': True, 'false': False})
            
            # Normalize list-of-lists for order-independent comparison (groupAnagrams, etc.)
            # Skip for [[val, rand_idx]] format (rand_idx can be None/int)
            def is_sortable_list_of_lists(lst):
                if not isinstance(lst, list) or not lst: return False
                if not isinstance(lst[0], list): return False
                # Check if all sublists contain sortable homogeneous types (e.g., strings)
                try:
                    for sublist in lst:
                        if sublist and any(x is None or not isinstance(x, type(sublist[0])) for x in sublist):
                            return False
                    return True
                except:
                    return False
            
            if is_sortable_list_of_lists(expected) and is_sortable_list_of_lists(actual_val):
                try:
                    expected = sorted([sorted(x) for x in expected])
                    actual_val = sorted([sorted(x) for x in actual_val])
                except: pass
            
            # Handle None result for List expected (Function only?)
            if actual_val is None and isinstance(expected, list) and not is_class_solution:
                actual_val = []

            # Compare
            passed = (actual_val == expected)
            if not passed:
                all_passed = False
                
            results.append({
                "case": i + 1,
                "passed": passed,
                "input": test['input'],
                "expected": str(expected),
                "actual": str(actual_val)
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
        pass
        # if os.path.exists(temp_path):
        #     os.remove(temp_path)
        print(f"DEBUG: Temp file at {temp_path}")
