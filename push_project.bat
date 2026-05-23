@echo off
echo ============================================================
echo Adding all changes...
git add .

echo.
echo Committing changes...
git commit -m "Update grammar test: dynamic sentences, scoring validation logic, and UI spacing"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ============================================================
echo DONE! Your changes have been successfully pushed to GitHub.
echo ============================================================
pause
