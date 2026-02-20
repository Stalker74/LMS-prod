@echo off
echo Emptying S3 bucket: dev-lms-app-dev-12345

REM Delete all versions
for /f "tokens=*" %%i in ('aws s3api list-object-versions --bucket dev-lms-app-dev-12345 --query "Versions[].{Key:Key,VersionId:VersionId}" --output text') do (
    aws s3api delete-object --bucket dev-lms-app-dev-12345 --key %%i
)

REM Delete all delete markers
for /f "tokens=*" %%i in ('aws s3api list-object-versions --bucket dev-lms-app-dev-12345 --query "DeleteMarkers[].{Key:Key,VersionId:VersionId}" --output text') do (
    aws s3api delete-object --bucket dev-lms-app-dev-12345 --key %%i
)

echo Deleting bucket...
aws s3api delete-bucket --bucket dev-lms-app-dev-12345

echo Done!
