"""
Basic verification script for git repository state.
"""
import subprocess

print("Starting verification...")

try:
    with open("git_verification_output.txt", "w", encoding="utf-8") as f:
        try:
            cmd = ["git", "status"]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual",
                check=False
            )
            f.write(f"STATUS STDOUT:\n{result.stdout}\n")
            f.write(f"STATUS STDERR:\n{result.stderr}\n")

            cmd = ["git", "log", "--oneline", "-n", "10"]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual",
                check=False
            )
            f.write(f"LOG STDOUT:\n{result.stdout}\n")
            f.write(f"LOG STDERR:\n{result.stderr}\n")

        except Exception as e:  # pylint: disable=broad-except
            f.write(f"Exception verifying git: {str(e)}\n")

except Exception as main_e:  # pylint: disable=broad-except
    print(f"Main exception: {main_e}")
