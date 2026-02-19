import subprocess
import os

print("Starting checks...")

try:
    with open("git_status_output.txt", "w") as f:
        try:
            cmd = ["git", "status"]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual")
            f.write(f"STDOUT:\n{result.stdout}\n")
            f.write(f"STDERR:\n{result.stderr}\n")
            f.write(f"EXIT CODE: {result.returncode}\n")
        except Exception as e:
            f.write(f"Exception running git status: {str(e)}\n")

    with open("git_pull_output.txt", "w") as f:
        try:
            cmd = ["git", "pull", "--tags", "--no-edit", "origin", "main"]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(cmd, capture_output=True, text=True, cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual")
            f.write(f"STDOUT:\n{result.stdout}\n")
            f.write(f"STDERR:\n{result.stderr}\n")
            f.write(f"EXIT CODE: {result.returncode}\n")
        except Exception as e:
            f.write(f"Exception running git pull: {str(e)}\n")

except Exception as main_e:
    print(f"Main exception: {main_e}")
