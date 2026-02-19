"""
Deep verification script for git repository state.
"""
import subprocess

print("Starting deep verification...")

try:
    with open("git_deep_verify_output.txt", "w", encoding="utf-8") as f:
        try:
            # Check the specific commit
            cmd = [
                "git", "show", "dcd2fa0badf166ac92c56aba07bf027fb8ed2a6c",
                "--stat"
            ]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual",
                check=False
            )
            f.write(f"COMMIT SHOW STDOUT:\n{result.stdout}\n")
            f.write(f"COMMIT SHOW STDERR:\n{result.stderr}\n")

            # Check the log graph to see where it fits
            cmd = ["git", "log", "--oneline", "--graph", "--all", "-n", "20"]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual",
                check=False
            )
            f.write(f"LOG GRAPH STDOUT:\n{result.stdout}\n")
            f.write(f"LOG GRAPH STDERR:\n{result.stderr}\n")

            # Check local HEAD
            cmd = ["git", "rev-parse", "HEAD"]
            print(f"Running: {' '.join(cmd)}")
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd="/Users/nileshchakraborty/workspace/study/leetcode-visual",
                check=False
            )
            f.write(f"HEAD STDOUT:\n{result.stdout}\n")

        except Exception as e:  # pylint: disable=broad-except
            f.write(f"Exception verifying git: {str(e)}\n")

except Exception as main_e:  # pylint: disable=broad-except
    print(f"Main exception: {main_e}")
