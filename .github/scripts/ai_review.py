import os
import subprocess
import requests
from github import Github

GITHUB_TOKEN = os.environ['GITHUB_TOKEN']
AI_API_KEY = os.environ.get('AI_API_KEY')

github_ref = os.environ.get('GITHUB_REF')

pr_number = None
if github_ref and 'refs/pull/' in github_ref:
  pr_number = int(github_ref.split('/')[2])

diff_cmd = ["git", "diff", "origin/main...HEAD"]
diff_proc = subprocess.run(diff_cmd, capture_output = True, text = True)
diff_text = diff_proc.stdout

if not diff_text.strip():
  print("No diff found. Exiting.")
  exit(0)

def ask_ai_to_review(diff):
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {AI_API_KEY}",
        "Content-Type": "application/json"
    }
    prompt = (
        "You are a code review assistant. Given the following git diff, "
        "list up to 10 issues or improvement suggestions with filename and line context.\n\nDIFF:\n"
        + diff
    )
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role":"user","content":prompt}],
        "max_tokens": 800
    }
    r = requests.post(url, headers=headers, json=payload, timeout=60)
    r.raise_for_status()
    result = r.json()
    text = result["choices"][0]["message"]["content"]
    return text

review_text = ask_ai_to_review(diff_text)
print("AI review received")

g = Github(GITHUB_TOKEN)
repo_name = os.environ['GITHUB_REPOSITORY']
repo = g.get_repo(repo_name)
pr = repo.get_pull(pr_number)
pr.create_issue_comment(f"**Automated AI review**:\n\n{review_text}")
print("Comment posted")
