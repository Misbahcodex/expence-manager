@echo off
echo.
echo =============================================
echo Running all security checks...
echo =============================================
echo.

REM Run security scan
echo.
echo [1/4] Running security scan...
call npm run security:scan

REM Check environment variables
echo.
echo [2/4] Checking environment variables...
call npm run security:check-env

REM Test secure email implementation
echo.
echo [3/4] Testing secure email implementation...
pushd backend
call npm run test:email
popd

REM Run linting
echo.
echo [4/4] Running linting...
call npm run lint

echo.
echo =============================================
echo Security checks completed!
echo =============================================
echo.