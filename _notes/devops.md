
# DevOps

## Commit and sync from CL
git add .
git commit -m "Some test change..."
git push origin development
OR
git commit -am "Some test change..."


## Merge development to production (without ruleset) NOTE Only works, if ruleset disabled!
Ensure that everything from development has been committed (and works!)
Switch to production
Open the Command Palette (Ctrl+Shift+P).
Type/select: 'Git: Merge...'
Select 'development'
Sync Changes (message: development into production)
Switch back to development


## Merge development to production (with ruleset 'Production rules')
Ensure that everything from development has been committed (and works!)
Go to GitHub, the repo's PR page
Click 'Compare & pull request'
Select base: production; compare: development (production <- development)
Click 'Create pull request'
Click 'Merge pull request'
Create message, e.g. 'development into production'
Click 'Confirm merge'

## Merge development to production (with ruleset 'Production rules'), CLI version
gh pr create --base production --head development --title "development to production" --body "Tested and ready."
gh pr merge --merge

## gitignore a dir, previously not gitignored (untrack)
git rm -r --cached my_dir
git rm -r --cached .venv











