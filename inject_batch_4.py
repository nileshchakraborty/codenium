import json

SOLUTIONS_FILE = "data/solutions.json"

batch_4_solutions = {
    "ransom-note": {
        "title": "Ransom Note",
        "pattern": "Hash Map / Counter",
        "patternEmoji": "\ud83d\udcc3",
        "timeComplexity": "O(m+n)",
        "spaceComplexity": "O(1) (26 chars)",
        "oneliner": "Count letters in magazine; ensure every letter in note is available.",
        "intuition": [
            "\ud83c\udfaf Can we construct 'note' from 'magazine' letters?",
            "\ud83e\udde0 Count frequency of each char in magazine.",
            "\ud83d\udca1 For each char in note, subtract count. If count < 0, False."
        ],
        "testCases": [
            {"input": "ransomNote = \"a\", magazine = \"b\"", "output": "false"},
            {"input": "ransomNote = \"aa\", magazine = \"aab\"", "output": "true"}
        ],
        "steps": [
            {"step": 1, "title": "Count Magazine", "visual": "Map: {a:2, b:1}", "explanation": "Available resources."},
            {"step": 2, "title": "Check Note", "visual": "Need 'a'? Map['a']--. Remaining: 1.", "explanation": "Consume resource."},
            {"step": 3, "title": "Verify", "visual": "If Map[char] < 0, impossible.", "explanation": "Not enough letters."}
        ],
        "code": "def canConstruct(ransomNote, magazine):\\n    from collections import Counter\\n    counts = Counter(magazine)\\n    for c in ransomNote:\\n        counts[c] -= 1\\n        if counts[c] < 0: return False\\n    return True",
        "keyInsight": "Using an array of size 26 is slightly faster than a hashmap, but Counter is cleaner.",
        "visualizationType": "string",
        "initialState": "ransomNote='aa', magazine='aab'",
        "animationSteps": []
    },
    "isomorphic-strings": {
        "title": "Isomorphic Strings",
        "pattern": "Hash Map (Bi-directional)",
        "patternEmoji": "\ud83d\udd04",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "oneliner": "Map s[i]->t[i] AND t[i]->s[i]; detect conflicts.",
        "intuition": [
            "\ud83c\udfaf 'egg' -> 'add'. e->a, g->d.",
            "\ud83e\udde0 Must be consistent (1-to-1 mapping).",
            "\ud83d\udca1 If 'e' maps to 'a', 'a' must map back to 'e' ONLY."
        ],
        "testCases": [
            {"input": "s = \"egg\", t = \"add\"", "output": "true"},
            {"input": "s = \"foo\", t = \"bar\"", "output": "false"}
        ],
        "steps": [
            {"step": 1, "title": "Iterate", "visual": "Pair (s[i], t[i]).", "explanation": "Check character mapping."},
            {"step": 2, "title": "Check S->T", "visual": "MapS[s[i]] exists? Must equal t[i].", "explanation": "Forward consistency."},
            {"step": 3, "title": "Check T->S", "visual": "MapT[t[i]] exists? Must equal s[i].", "explanation": "Backward consistency (No two chars map to same target)."}
        ],
        "code": "def isIsomorphic(s, t):\\n    mapST, mapTS = {}, {}\\n    for c1, c2 in zip(s, t):\\n        if (c1 in mapST and mapST[c1] != c2) or \\\\n           (c2 in mapTS and mapTS[c2] != c1):\\n            return False\\n        mapST[c1] = c2\\n        mapTS[c2] = c1\\n    return True",
        "keyInsight": "Using two maps prevents 'many-to-one' mapping errors (like 'ab' -> 'cc').",
        "visualizationType": "string",
        "initialState": "egg -> add",
        "animationSteps": []
    },
    "word-pattern": {
        "title": "Word Pattern",
        "pattern": "Hash Map (Bi-directional)",
        "patternEmoji": "\ud83e\udde9",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Same as Isomorphic Strings, but mapping Char -> Word.",
        "intuition": [
            "\ud83c\udfaf Pattern 'abba' and words 'dog cat cat dog'.",
            "\ud83e\udde0 a -> dog, b -> cat.",
            "\ud83d\udca1 Split string by space, then check 1-to-1 mapping."
        ],
        "testCases": [
            {"input": "pattern = \"abba\", s = \"dog cat cat dog\"", "output": "true"},
            {"input": "pattern = \"abba\", s = \"dog cat cat fish\"", "output": "false"}
        ],
        "steps": [
            {"step": 1, "title": "Split", "visual": "['dog', 'cat', 'cat', 'dog']", "explanation": "Get tokens."},
            {"step": 2, "title": "Length Check", "visual": "If len(pattern) != len(words): False.", "explanation": "Must match length."},
            {"step": 3, "title": "Bi-Map", "visual": "Map P->W and W->P. Check conflicts.", "explanation": "Ensure consistency."}
        ],
        "code": "def wordPattern(pattern, s):\\n    words = s.split()\\n    if len(pattern) != len(words): return False\\n    c_to_w, w_to_c = {}, {}\\n    for c, w in zip(pattern, words):\\n        if c in c_to_w and c_to_w[c] != w: return False\\n        if w in w_to_c and w_to_c[w] != c: return False\\n        c_to_w[c] = w\\n        w_to_c[w] = c\\n    return True",
        "keyInsight": "Don't forget to check if lengths differ first!",
        "visualizationType": "string",
        "initialState": "abba -> dog cat cat dog",
        "animationSteps": []
    },
    "valid-anagram": {
        "title": "Valid Anagram",
        "pattern": "Hash Map / Sorting",
        "patternEmoji": "\ud83d\udd00",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1)",
        "oneliner": "Check if character counts are identical.",
        "intuition": [
            "\ud83c\udfaf Anagram = same letters, rearranged.",
            "\ud83e\udde0 Sorting works (O(nlogn)), but counting is faster (O(n)).",
            "\ud83d\udca1 Count S, subtract T. All zero? True."
        ],
        "testCases": [
            {"input": "s = \"anagram\", t = \"nagaram\"", "output": "true"},
            {"input": "s = \"rat\", t = \"car\"", "output": "false"}
        ],
        "steps": [
            {"step": 1, "title": "Count S", "visual": "{a:3, n:1, g:1, r:1, m:1}", "explanation": "Tally up."},
            {"step": 2, "title": "Subtract T", "visual": "Decrement counts for 'nagaram'.", "explanation": "Cancel out."},
            {"step": 3, "title": "Result", "visual": "All zero? Match.", "explanation": "Any non-zero means mismatch."}
        ],
        "code": "def isAnagram(s, t):\\n    if len(s) != len(t): return False\\n    # return sorted(s) == sorted(t)\\n    from collections import Counter\\n    return Counter(s) == Counter(t)",
        "keyInsight": "Length check first is a cheap optimization.",
        "visualizationType": "string",
        "initialState": "anagram vs nagaram",
        "animationSteps": []
    },
    "group-anagrams": {
        "title": "Group Anagrams",
        "pattern": "Hash Map",
        "patternEmoji": "\ud83d\udcc2",
        "timeComplexity": "O(NK)",
        "spaceComplexity": "O(NK)",
        "oneliner": "Map sorted string (or char-count tuple) to list of strings.",
        "intuition": [
            "\ud83c\udfaf All anagrams have the same 'signature'.",
            "\ud83e\udde0 Signature = sorted string ('eat' -> 'aet').",
            "\ud83d\udca1 Store {signature: [list of words]}."
        ],
        "testCases": [
            {"input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", "output": "[[...]]"},
            {"input": "strs = [\"\"]", "output": "[[\"\"]]"}
        ],
        "steps": [
            {"step": 1, "title": "Hash Key", "visual": "\"eat\" -> (1,0,0...1...1) OR \"aet\"", "explanation": "Generate canonical key."},
            {"step": 2, "title": "Bucket", "visual": "Map[key].append(word).", "explanation": "Group them."},
            {"step": 3, "title": "Collect", "visual": "Return Map.values()", "explanation": "List of lists."}
        ],
        "code": "def groupAnagrams(strs):\\n    from collections import defaultdict\\n    res = defaultdict(list)\\n    for s in strs:\\n        # Using tuple(sorted(s)) as key\\n        # Or char count tuple for O(N) instead of O(N log K)\\n        count = [0] * 26\\n        for c in s:\\n            count[ord(c) - ord('a')] += 1\\n        res[tuple(count)].append(s)\\n    return list(res.values())",
        "keyInsight": "Using a count-tuple `(2, 1, 0...)` as a dictionary key is efficient and avoids sorting overhead.",
        "visualizationType": "string",
        "initialState": "eat, tea, tan, ate, nat, bat",
        "animationSteps": []
    },
    "two-sum": {
        "title": "Two Sum",
        "pattern": "Hash Map",
        "patternEmoji": "\u2795",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Store seen numbers; check if (target - current) exists in map.",
        "intuition": [
            "\ud83c\udfaf We need: nums[j] = target - nums[i].",
            "\ud83e\udde0 While iterating, store {val: index} of what we've seen.",
            "\ud83d\udca1 Look back: do we have the complement?"
        ],
        "testCases": [
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"},
            {"input": "nums = [3,2,4], target = 6", "output": "[1,2]"}
        ],
        "steps": [
            {"step": 1, "title": "Scan", "visual": "Visit 2. Need 7. Map: {2:0}.", "explanation": "Remember 2."},
            {"step": 2, "title": "Check", "visual": "Visit 7. Need 2. 2 is in Map!", "explanation": "Pair found."},
            {"step": 3, "title": "Found", "visual": "Return [Map[2], CurrentIndex].", "explanation": "Indices found."}
        ],
        "code": "def twoSum(nums, target):\\n    prevMap = {}\\n    for i, n in enumerate(nums):\\n        diff = target - n\\n        if diff in prevMap:\\n            return [prevMap[diff], i]\\n        prevMap[n] = i\\n    return []",
        "keyInsight": "One pass is sufficient because the pair is commutative; we find it when we reach the *second* number.",
        "visualizationType": "array",
        "initialState": [2, 7, 11, 15],
        "animationSteps": []
    },
    "happy-number": {
        "title": "Happy Number",
        "pattern": "Floyd's Cycle Finding",
        "patternEmoji": "\ud83d\ude00",
        "timeComplexity": "O(log n)",
        "spaceComplexity": "O(1)",
        "oneliner": "Detect cycle in sum-of-squares chain. 1 is happy root; other cycles are sad.",
        "intuition": [
            "\ud83c\udfaf Process: replace n with sum of squares of digits.",
            "\ud83e\udde0 It either reaches 1 (Happy) or stuck in a loop (Sad).",
            "\ud83d\udca1 Use Slow/Fast pointers or a Set to detect loop."
        ],
        "testCases": [
            {"input": "n = 19", "output": "true"},
            {"input": "n = 2", "output": "false"}
        ],
        "steps": [
            {"step": 1, "title": "Simulate", "visual": "19 -> 1^2+9^2=82 -> 68 -> 100 -> 1.", "explanation": "Converged to 1."},
            {"step": 2, "title": "Cycle", "visual": "2 -> 4 -> 16... -> 4 (Loop!).", "explanation": "Detected visited number."},
            {"step": 3, "title": "Result", "visual": "If 1: True. If Cycle: False.", "explanation": "Decision."}
        ],
        "code": "def isHappy(n):\\n    visit = set()\\n    while n not in visit:\\n        visit.add(n)\\n        n = sum(int(d)**2 for d in str(n))\\n        if n == 1: return True\\n    return False",
        "keyInsight": "The cycle doesn't grow infinitely; digits reduce numbers drastically (999 -> 243). Loop is guaranteed small.",
        "visualizationType": "string",
        "initialState": "19",
        "animationSteps": []
    },
    "contains-duplicate-ii": {
        "title": "Contains Duplicate II",
        "pattern": "Sliding Window / Hash Map",
        "patternEmoji": "\u26a0\ufe0f",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(k)",
        "oneliner": "Maintain a window of size k using a set; duplicate in window triggers True.",
        "intuition": [
            "\ud83c\udfaf Duplicate must be within distance k (abs(i-j) <= k).",
            "\ud83e\udde0 Keep latest k elements in a set.",
            "\ud83d\udca1 If current num is in set -> found it!"
        ],
        "testCases": [
            {"input": "nums = [1,2,3,1], k = 3", "output": "true"},
            {"input": "nums = [1,2,3,1,2,3], k = 2", "output": "false"}
        ],
        "steps": [
            {"step": 1, "title": "Expand", "visual": "Add nums[i] to window set.", "explanation": "Track recent."},
            {"step": 2, "title": "Shrink", "visual": "If window size > k, remove nums[i-k].", "explanation": "Maintain invariant."},
            {"step": 3, "title": "Check", "visual": "nums[i] already in set? True.", "explanation": "Collision detected."}
        ],
        "code": "def containsNearbyDuplicate(nums, k):\\n    window = set()\\n    l = 0\\n    for r in range(len(nums)):\\n        if r - l > k:\\n            window.remove(nums[l])\\n            l += 1\\n        if nums[r] in window:\\n            return True\\n        window.add(nums[r])\\n    return False",
        "keyInsight": "Removing the element falling out of the window makes lookups O(1).",
        "visualizationType": "array",
        "initialState": [1, 2, 3, 1],
        "animationSteps": []
    },
    "longest-consecutive-sequence": {
        "title": "Longest Consecutive Sequence",
        "pattern": "Hash Set",
        "patternEmoji": "\ud83d\udd22",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Only start counting if (num-1) is NOT in set. This ensures we only count from sequence starts.",
        "intuition": [
            "\ud83c\udfaf We want 1, 2, 3, 4 given unsorted inputs.",
            "\ud83e\udde0 Hash Set gives O(1) lookup.",
            "\ud83d\udca1 Key: Don't count '2' if '1' exists. Only start counting at '1'. Avoids O(n^2)."
        ],
        "testCases": [
            {"input": "nums = [100,4,200,1,3,2]", "output": "4"},
            {"input": "nums = [0,3,7,2,5,8,4,6,0,1]", "output": "9"}
        ],
        "steps": [
            {"step": 1, "title": "Setify", "visual": "{100, 4, 200, 1, 3, 2}", "explanation": "Remove dupes, fast access."},
            {"step": 2, "title": "Check Start", "visual": "Is 100-1 in set? No. Start chain. 100... len 1.\nIs 4-1 (3) in set? Yes. Skip.", "explanation": "Ensure single traversal."},
            {"step": 3, "title": "Expand", "visual": "At 1: 1 in, 2 in, 3 in, 4 in. Stop. Len 4.", "explanation": "Count sequence."}
        ],
        "code": "def longestConsecutive(nums):\\n    numSet = set(nums)\\n    longest = 0\\n    for n in numSet:\\n        if (n - 1) not in numSet:\\n            length = 0\\n            while (n + length) in numSet:\\n                length += 1\\n            longest = max(length, longest)\\n    return longest",
        "keyInsight": "Checking `if (n-1) not in set` ensures each sequence is only processed ONCE, making it linear.",
        "visualizationType": "array",
        "initialState": [100, 4, 200, 1, 3, 2],
        "animationSteps": []
    },
    "insert-delete-getrandom-o1": {
        "title": "Insert Delete GetRandom O(1)",
        "pattern": "Hash Map + Dynamic Array",
        "patternEmoji": "\ud83c\udfb2",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(n)",
        "oneliner": "Map stores {val: index}. To delete, swap val with last element, then pop.",
        "intuition": [
            "\ud83c\udfaf List allows O(1) random access (choice).",
            "\ud83e\udde0 Hashmap allows O(1) lookup/delete logic.",
            "\ud83d\udca1 Problem: Deleting from middle of list is O(n). Solution: Swap with end, then pop!"
        ],
        "testCases": [
            {"input": "insert(1), remove(2), getRandom()", "output": "Checks"}
        ],
        "steps": [
            {"step": 1, "title": "Insert", "visual": "Append to list. Map[val] = len-1.", "explanation": "Easy O(1)."},
            {"step": 2, "title": "Delete", "visual": "Val at index `i`. Swap list[i] with list[end]. Update map for swapped item. Pop list.", "explanation": "O(1) removal."},
            {"step": 3, "title": "Random", "visual": "random.choice(list)", "explanation": "Uniform distribution."}
        ],
        "code": "import random\\nclass RandomizedSet:\\n    def __init__(self):\\n        self.valMap = {}\\n        self.valList = []\\n    def insert(self, val):\\n        if val in self.valMap: return False\\n        self.valMap[val] = len(self.valList)\\n        self.valList.append(val)\\n        return True\\n    def remove(self, val):\\n        if val not in self.valMap: return False\\n        idx = self.valMap[val]\\n        lastVal = self.valList[-1]\\n        self.valList[idx] = lastVal\\n        self.valMap[lastVal] = idx\\n        self.valList.pop()\\n        del self.valMap[val]\\n        return True\\n    def getRandom(self):\\n        return random.choice(self.valList)",
        "keyInsight": "The 'Swap and Pop' technique is crucial for O(1) deletions in arrays.",
        "visualizationType": "array",
        "initialState": [],
        "animationSteps": []
    },
    "contains-duplicate": {
         "title": "Contains Duplicate",
         "pattern": "Hash Set",
         "patternEmoji": "\ud83d\udc6f",
         "timeComplexity": "O(n)",
         "spaceComplexity": "O(n)",
         "oneliner": "Add to set; if exists, return True.",
         "intuition": [
             "\ud83c\udfaf Any number appearing twice?",
             "\ud83e\udde0 Set stores unique elements.",
             "\ud83d\udca1 Check membership before adding."
         ],
         "testCases": [{"input":"[1,2,3,1]", "output":"true"}],
         "steps": [
             {"step": 1, "title": "Scan", "visual": "Iterate numbers.", "explanation": "Standard pass."},
             {"step": 2, "title": "Check", "visual": "In set? True.", "explanation": "Collision."},
             {"step": 3, "title": "Add", "visual": "Add to set.", "explanation": "Track seen."}
         ],
         "code": "def containsDuplicate(nums):\\n    seen = set()\\n    for n in nums:\\n        if n in seen: return True\\n        seen.add(n)\\n    return False",
         "keyInsight": "HashSet provides immediate collision detection.",
         "visualizationType":"array",
         "initialState": [1,2,3,1],
         "animationSteps": []
    },
    "how-many-numbers-are-smaller-than-the-current-number": {
        "title": "How Many Numbers Smaller",
        "pattern": "Bucket Sort / Counting",
        "patternEmoji": "\ud83d\udcca",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(1) (range limited)",
        "oneliner": "Count occurrences, prefix sum to find cumulative count smaller.",
        "intuition": [
             "\ud83c\udfaf If 5 numbers are <= 7, and 2 numbers are == 7, then 3 are < 7.",
             "\ud83e\udde0 Frequency array tracks counts.",
             "\ud83d\udca1 Prefix sums give 'count of numbers <= i'."
        ],
        "testCases": [{"input":"[8,1,2,2,3]", "output":"[4,0,1,1,3]"}],
        "steps": [
             {"step":1, "title":"Count", "visual":"Freq array of size 101.", "explanation":"Constraints say nums[i] <= 100."},
             {"step":2, "title":"Prefix Sum", "visual":"freq[i] += freq[i-1].", "explanation":"Cumulative count."},
             {"step":3, "title":"Map", "visual":"Res[i] = freq[nums[i]-1].", "explanation":"Get numbers strictly smaller."}
        ],
        "code": "def smallerNumbersThanCurrent(nums):\\n    count = [0] * 102\\n    for n in nums: count[n+1] += 1\\n    for i in range(1, 102): count[i] += count[i-1]\\n    return [count[n] for n in nums]",
        "keyInsight": "Using the input constraints (0-100) allows faster-than-sorting O(n) solution using counting sort ideas.",
        "visualizationType":"array",
        "initialState": [8,1,2,2,3],
        "animationSteps": []
    },
    "valid-parentheses": {
        "title": "Valid Parentheses",
        "pattern": "Stack",
        "patternEmoji": "(\ufe0f)\ufe0f",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Push open brackets; pop and match close brackets.",
        "intuition": [
             "\ud83c\udfaf Last Opened must be First Closed (LIFO).",
             "\ud83e\udde0 Stack tracks open brackets.",
             "\ud83d\udca1 Mismatch or empty stack on close? Invalid."
        ],
        "testCases": [{"input":"s=\"()[]{}\"", "output":"true"}, {"input":"s=\"(]\"", "output":"false"}],
        "steps": [
             {"step":1, "title":"Open", "visual":"Push '(', '[', '{'.", "explanation":"Await closing."},
             {"step":2, "title":"Close", "visual":"Pop top. Matches current? () [] {}", "explanation":"Verify pairing."},
             {"step":3, "title":"End", "visual":"Stack empty? Valid.", "explanation":"No unclosed brackets left."}
        ],
        "code": "def isValid(s):\\n    stack = []\\n    closeToOpen = {')': '(', ']': '[', '}': '{'}\\n    for c in s:\\n        if c in closeToOpen:\\n            if stack and stack[-1] == closeToOpen[c]:\\n                stack.pop()\\n            else:\\n                return False\\n        else:\\n            stack.append(c)\\n    return not stack",
        "keyInsight": "Map only the closing brackets allows clean logic: \"Is it a closer? Check stack. Else, it must be an opener.\"",
        "visualizationType":"string",
        "initialState": "()[]{}",
        "animationSteps": []
    },
    "simplify-path": {
        "title": "Simplify Path",
        "pattern": "Stack",
        "patternEmoji": "\ud83d\udcc2",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Split by '/'. Stack keeps directories. '..' pops, '.' ignores.",
        "intuition": [
             "\ud83c\udfaf Canonical path logic.",
             "\ud83e\udde0 '..' means go up (pop).",
             "\ud83d\udca1 '.' or empty means stay (ignore)."
        ],
        "testCases": [{"input":"/a/./b/../../c/", "output":"/c"}],
        "steps": [
             {"step":1, "title":"Split", "visual":"['a', '.', 'b', '..', '..', 'c']", "explanation":"Tokenize."},
             {"step":2, "title":"Process", "visual":"'a': push. '.': skip. 'b': push. '..': pop(b). '..': pop(a). 'c': push.", "explanation":"Stack operations."},
             {"step":3, "title":"Join", "visual":"'/' + join(stack)", "explanation":"Rebuild."}
        ],
        "code": "def simplifyPath(path):\\n    stack = []\\n    for portion in path.split('/'):\\n        if portion == '..':\\n            if stack: stack.pop()\\n        elif portion == '.' or not portion:\\n            continue\\n        else:\\n            stack.append(portion)\\n    return '/' + '/'.join(stack)",
        "keyInsight": "Splitting by slash handles multiple slashes `//` automatically (producing empty strings to ignore).",
        "visualizationType":"string",
        "initialState": "/a/./b/../../c/",
        "animationSteps": []
    },
    "min-stack": {
        "title": "Min Stack",
        "pattern": "Stack (Two Stacks)",
        "patternEmoji": "\u2b07\ufe0f",
        "timeComplexity": "O(1)",
        "spaceComplexity": "O(n)",
        "oneliner": "Maintain a second stack tracking the minimum value at each depth.",
        "intuition": [
             "\ud83c\udfaf Get Min in O(1).",
             "\ud83e\udde0 Normal stack holds values.",
             "\ud83d\udca1 MinStack holds min_so_far. Push? min(val, top). Pop? Pop both."
        ],
        "testCases": [{"input":"push(-2),push(0),push(-3),getMin(),pop(),getMin()", "output":"-3, -2"}],
        "steps": [
             {"step":1, "title":"Push", "visual":"Main: [-2]. MinStack: [-2].", "explanation":"Init."},
             {"step":2, "title":"Push Smaller", "visual":"Main: [-2, -3]. MinStack: [-2, -3].", "explanation":"New min found."},
             {"step":3, "title":"Pop", "visual":"Pop both. Min reverts to -2.", "explanation":"Sync."}
        ],
        "code": "class MinStack:\\n    def __init__(self):\\n        self.stack = []\\n        self.minStack = []\\n    def push(self, val):\\n        self.stack.append(val)\\n        val = min(val, self.minStack[-1] if self.minStack else val)\\n        self.minStack.append(val)\\n    def pop(self):\\n        self.stack.pop()\\n        self.minStack.pop()\\n    def top(self): return self.stack[-1]\\n    def getMin(self): return self.minStack[-1]",
        "keyInsight": "The minimum history needs to be stacked because when we pop the minimum, we need to know what the *previous* minimum was.",
        "visualizationType":"array",
        "initialState": [],
        "animationSteps": []
    },
    "evaluate-reverse-polish-notation": {
        "title": "Eval RPN",
        "pattern": "Stack",
        "patternEmoji": "\u2797\u2796",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Push numbers. Operator? Pop two, apply, push result.",
        "intuition": [
             "\ud83c\udfaf Postfix notation (3 4 +) eliminates parenthesis ambiguity.",
             "\ud83e\udde0 Stack holds operands waiting for an operator.",
             "\ud83d\udca1 Saw '+'? Pop 4, Pop 3. Do 3+4=7. Push 7."
        ],
        "testCases": [{"input":"[\"2\",\"1\",\"+\",\"3\",\"*\"]", "output":"9"}],
        "steps": [
             {"step":1, "title":"Push", "visual":"Stack: [2, 1]", "explanation":"Operands."},
             {"step":2, "title":"Op +", "visual":"Pop 1, 2. Add -> 3. Stack: [3].", "explanation":"Execute."},
             {"step":3, "title":"Continue", "visual":"Push 3. Op *. 3 * 3 = 9.", "explanation":"Chain."}
        ],
        "code": "def evalRPN(tokens):\\n    stack = []\\n    for t in tokens:\\n        if t not in \"+-*/\":\\n            stack.append(int(t))\\n        else:\\n            b, a = stack.pop(), stack.pop()\\n            if t == \"+\": stack.append(a + b)\\n            elif t == \"-\": stack.append(a - b)\\n            elif t == \"*\": stack.append(a * b)\\n            else: stack.append(int(a / b))\\n    return stack[0]",
        "keyInsight": "Careful with division: 'int(a / b)' truncates toward zero in Python, unlike '//' which floors.",
        "visualizationType":"array",
        "initialState": ["2","1","+","3","*"],
        "animationSteps": []
    },
    "basic-calculator": {
        "title": "Basic Calculator",
        "pattern": "Stack (Signs)",
        "patternEmoji": "\ud83d\udc22",
        "timeComplexity": "O(n)",
        "spaceComplexity": "O(n)",
        "oneliner": "Track result and sign. Parenthesis? Push current result & sign, reset.",
        "intuition": [
             "\ud83c\udfaf Linear scan with recursion simulated by stack.",
             "\ud83e\udde0 '(': Stash current state. Start fresh sub-problem.",
             "\ud83d\udca1 ')': Finish sub-problem, multiply by stashed sign, add stashed result."
        ],
        "testCases": [{"input":"(1+(4+5+2)-3)+(6+8)", "output":"23"}],
        "steps": [
             {"step":1, "title":"Scan", "visual":"Update 'res' with num*sign.", "explanation":"Accumulate."},
             {"step":2, "title":"Open (", "visual":"Push res, sign. Res=0, Sign=1.", "explanation":"Context switch."},
             {"step":3, "title":"Close )", "visual":"Res = Res * pop_sign + pop_res.", "explanation":"Resolve scope."}
        ],
        "code": "def calculate(s):\\n    res, num, sign, stack = 0, 0, 1, []\\n    for c in s:\\n        if c.isdigit():\\n            num = num * 10 + int(c)\\n        elif c in '+-':\\n            res += sign * num\\n            num = 0\\n            sign = 1 if c == '+' else -1\\n        elif c == '(': \\n            stack.append(res)\\n            stack.append(sign)\\n            sign = 1\\n            res = 0\\n        elif c == ')':\\n            res += sign * num\\n            res *= stack.pop()\\n            res += stack.pop()\\n            num = 0\\n    return res + num * sign",
        "keyInsight": "Only one 'sign' variable is needed to handle +/-, applying it lazily when a number ends.",
        "visualizationType":"string",
        "initialState": "(1+(4+5+2)-3)+(6+8)",
        "animationSteps": []
    },
    "implement-stack-using-queues": {
        "title": "Stack using Queues",
        "pattern": "Queue Rotation",
        "patternEmoji": "\ud83d\udd04",
        "timeComplexity": "Push O(n), Pop O(1)",
        "spaceComplexity": "O(n)",
        "oneliner": "Push to queue, then rotate (pop & push back) all previous elements to keep new element at front.",
        "intuition": [
             "\ud83c\udfaf Queue is FIFO. Stack is LIFO.",
             "\ud83e\udde0 To make Queue look LIFO, the 'newest' item must be at the head.",
             "\ud83d\udca1 After appending X, rotate all other N items behind X."
        ],
        "testCases": [{"input":"push(1), push(2), pop(), top()", "output":"2, 1"}],
        "steps": [
             {"step":1, "title":"Push X", "visual":"Q appends X. Q: [1, 2, X].", "explanation":"Wrong order."},
             {"step":2, "title":"Rotate", "visual":"Pop 1, Push 1. Pop 2, Push 2. Q: [X, 1, 2].", "explanation":"X is now front."},
             {"step":3, "title":"Pop", "visual":"Q.popleft() returns X.", "explanation":"LIFO behavior achieved."}
        ],
        "code": "from collections import deque\\nclass MyStack:\\n    def __init__(self):\\n        self.q = deque()\\n    def push(self, x):\\n        self.q.append(x)\\n        for _ in range(len(self.q) - 1):\\n            self.q.append(self.q.popleft())\\n    def pop(self): return self.q.popleft()\\n    def top(self): return self.q[0]\\n    def empty(self): return not self.q",
        "keyInsight": "Single queue is sufficient if we rotate it!",
        "visualizationType":"array",
        "initialState": [],
        "animationSteps": []
    }
}

print("Loading current solutions...")
with open(SOLUTIONS_FILE, "r") as f:
    data = json.load(f)

print("Injecting Batch 4 solutions...")
for slug, sol in batch_4_solutions.items():
    data["solutions"][slug] = sol
    print(f" -> Updated {slug}")

with open(SOLUTIONS_FILE, "w") as f:
    json.dump(data, f, indent=4)

print("Batch 4 completed successfully.")
