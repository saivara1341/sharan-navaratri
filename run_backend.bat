@echo off
echo Building Siddhi Dynamics Nexus (Strong Java Backend)...
cd backend

if exist "mvnw.cmd" (
    echo [INFO] Using Maven Wrapper...
    call mvnw.cmd clean package
) else (
    echo [WARNING] Maven Wrapper not found. Trying system 'mvn'...
    call mvn clean package
)

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Build failed. Please ensure Java 21 is installed and reachable.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [SUCCESS] Backend built successfully.
echo Starting Java Backend on http://localhost:8080 (SNI Suppression Active)...
java -Djsse.enableSNIExtension=false -jar target\nexus-backend-0.0.1-SNAPSHOT.jar
pause
