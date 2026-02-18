@echo off
echo ==========================================
echo      KMCE ATTENDANCE GITHUB SYNC
echo ==========================================
echo.

set "commitMsg="
set /p commitMsg="Enter commit message (Press Enter for 'Auto Update'): "

if not defined commitMsg set "commitMsg=Auto Update"

echo.
echo [1/3] Adding files...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "%commitMsg%"

echo.
echo [3/3] Pushing to remote...
git push

echo.
echo ==========================================
echo           SYNC COMPLETE
echo ==========================================
pause
