import os
import subprocess
import shutil

def run_cmd(args, cwd=None):
    print(f"Running: {' '.join(args)}")
    res = subprocess.run(args, cwd=cwd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr)
    return res.returncode

def main():
    repo_path = r"c:\Bengali Shadi.com"
    os.chdir(repo_path)
    
    # 1. Remove .git folder if exists
    git_dir = os.path.join(repo_path, ".git")
    if os.path.exists(git_dir):
        print("Removing existing .git folder...")
        # Try to remove readonly attributes first if shutil fails
        shutil.rmtree(git_dir, ignore_errors=True)
        
    # 2. git init
    if run_cmd(["git", "init"]) != 0:
        print("Failed git init")
        return
        
    # 3. git add .
    if run_cmd(["git", "add", "."]) != 0:
        print("Failed git add")
        return
        
    # 4. git commit
    if run_cmd(["git", "commit", "-m", "Initial commit - Bengali Shadi matrimony app"]) != 0:
        print("Failed git commit")
        return
        
    # 5. git remote add origin
    if run_cmd(["git", "remote", "add", "origin", "https://github.com/lokojitcoder123/Cokh-tule-dekhona-ke-eseche.git"]) != 0:
        print("Failed git remote add")
        return
        
    # 6. git branch -M main
    run_cmd(["git", "branch", "-M", "main"])
    
    # 7. git push main
    print("Attempting to push to main...")
    ret = run_cmd(["git", "push", "-u", "origin", "main", "--force"])
    
    if ret != 0:
        print("Push to main failed. Trying to push to setup branch...")
        run_cmd(["git", "checkout", "-b", "setup"])
        ret_setup = run_cmd(["git", "push", "-u", "origin", "setup", "--force"])
        if ret_setup == 0:
            print("Successfully pushed to setup branch!")
        else:
            print("Failed to push to setup branch.")
    else:
        print("Successfully pushed to main branch!")

if __name__ == "__main__":
    main()
