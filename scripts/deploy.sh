#!/bin/bash
set -e

# Deployment script for LMS application
# This script packages and deploys the application to S3

ENVIRONMENT=${1:-dev}
S3_BUCKET="${ENVIRONMENT}-lms-app-${2}"
APP_VERSION=$(date +%Y%m%d-%H%M%S)

echo "=== LMS Application Deployment Script ==="
echo "Environment: $ENVIRONMENT"
echo "S3 Bucket: $S3_BUCKET"
echo "Version: $APP_VERSION"

# Navigate to project root
cd "$(dirname "$0")/.."

# Create temporary build directory
BUILD_DIR="./build-${APP_VERSION}"
mkdir -p "$BUILD_DIR"

echo "=== Copying application files ==="
cp -r LMS/Backend "$BUILD_DIR/"
cp -r LMS/frontend "$BUILD_DIR/"
cp -r LMS/tsconfig.json "$BUILD_DIR/" 2>/dev/null || true

# Remove node_modules and other unnecessary files
echo "=== Cleaning up unnecessary files ==="
find "$BUILD_DIR" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find "$BUILD_DIR" -name ".git" -type d -exec rm -rf {} + 2>/dev/null || true
find "$BUILD_DIR" -name "*.log" -type f -delete 2>/dev/null || true

# Create tarball
echo "=== Creating application package ==="
tar -czf "lms-app-${APP_VERSION}.tar.gz" -C "$BUILD_DIR" .

# Upload to S3
echo "=== Uploading to S3 ==="
aws s3 cp "lms-app-${APP_VERSION}.tar.gz" "s3://${S3_BUCKET}/app/lms-app.tar.gz"
aws s3 cp "lms-app-${APP_VERSION}.tar.gz" "s3://${S3_BUCKET}/app/versions/lms-app-${APP_VERSION}.tar.gz"

# Cleanup
echo "=== Cleaning up build artifacts ==="
rm -rf "$BUILD_DIR"
rm -f "lms-app-${APP_VERSION}.tar.gz"

echo "=== Deployment package uploaded successfully! ==="
echo "Package location: s3://${S3_BUCKET}/app/lms-app.tar.gz"
echo "Versioned backup: s3://${S3_BUCKET}/app/versions/lms-app-${APP_VERSION}.tar.gz"

# Trigger instance refresh (optional - requires AWS CLI and proper permissions)
if [ "$3" == "--refresh-instances" ]; then
    echo "=== Triggering Auto Scaling Group instance refresh ==="
    ASG_NAME="${ENVIRONMENT}-lms-asg"
    aws autoscaling start-instance-refresh \
        --auto-scaling-group-name "$ASG_NAME" \
        --preferences '{"MinHealthyPercentage": 50, "InstanceWarmup": 300}' \
        --region us-east-1
    echo "Instance refresh initiated for $ASG_NAME"
fi

echo "=== Deployment completed successfully! ==="
