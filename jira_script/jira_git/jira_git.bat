@echo off
cd ..\..
if exist .git (
goto init
) else (
goto error
)


:init
copy /Y jira_script\jira_git\rely\commit-msg .git\hooks
goto over

:error
echo "请检查运行路径中是否包含.git文件"

:over
echo "完成"

pause
