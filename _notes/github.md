Create the production branch (from current main)
In VS Code:

Open the Branch menu (lower-left corner where your current branch name is shown).

Click Create Branch.

Name it exactly:
production

When prompted, "Create branch from main" — YES, that’s exactly what we want.

You now have a production branch locally.

In VS Code Source Control panel, click "Publish Branch".

You don't have to write any new commit message here.

Publishing a branch is not creating a new commit — it’s just pushing your current commits to GitHub under a new branch name.

(The current "Backup before branching" commit you made earlier is already in place — so everything is clean.)

✅ So simply click "Publish Branch".

No commit message needed.
No danger.



Step 3: Push the production branch to GitHub
Still in VS Code:

After creating the production branch, it will usually ask you to publish (push) it.

If not, go to Source Control → 3-dot menu → Push.

✅ Now your production branch is visible on GitHub.

You can confirm by visiting your GitHub repo in the browser:
It should show a dropdown with both main and production.


Create the development branch (same method)
Repeat the exact same process:

Open the Branch menu.

Click Create Branch.

Name it exactly:


development
Create from main (again fine — no changes made yet).

Push it to GitHub.

✅ Now you have:

development

production

(and main temporarily still exists, but that's OK for now)



Step 5: Tell Vercel to recognize the new branches
You don’t even have to manually do anything.
✅ Vercel auto-detects new branches and builds Preview deployments from them.

✅ Vercel will deploy:

production → Production URL (yourapp.vercel.app)

development → Preview URL (something-like-yourapp-git-development-youruser.vercel.app)

You will see these in the Vercel dashboard automatically.




# Branch rule
Add brach ruleset
Name: 'Production rules'
'Enforcement status': Enabled
'Bypass list': Leave empty
'Target branches' -> 'Include by pattern' -> 'production'
Select Rules:
- 'Require a pull request before merging':  'Required approvals' : 0
- 'Restrict deletions'
- 'Block force pushes'




