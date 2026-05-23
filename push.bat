@echo off
echo Initializing Git repository...
git init

echo.
echo Adding files...
git add .

echo.
echo Committing files...
git commit -m "Initial commit: Auth and Grammar Test UI complete"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Adding remote repository...
git remote add origin https://github.com/RashidR18/purplezone.git

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ============================================================
echo DONE! Your code has been successfully pushed to GitHub.
echo ============================================================
pause
