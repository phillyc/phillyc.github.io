# Project Dashboard

Auto-generated overview of all tracked project repos. Data refreshed every 6 hours.

**Source:** `/home/ubuntu/projects/repo-dashboard/deploy/` on the EC2 instance running Hermes Agent.

## Local dev

```bash
python3 /home/ubuntu/projects/repo-dashboard/deploy/generate.py
cp /home/ubuntu/sites/dashboard/index.html dashboard/
git add -A && git commit -m "dashboard: update" && git push
```
