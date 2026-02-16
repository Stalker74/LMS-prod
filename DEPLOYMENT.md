# Deployment Guide

This guide provides step-by-step instructions for deploying and managing the LMS infrastructure.

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Backend Infrastructure](#backend-infrastructure)
3. [Environment Deployment](#environment-deployment)
4. [Application Deployment](#application-deployment)
5. [Verification](#verification)
6. [Updates and Changes](#updates-and-changes)
7. [Rollback Procedures](#rollback-procedures)

## Initial Setup

### 1. Prerequisites Check

```bash
# Verify Terraform installation
terraform version  # Should be >= 1.0

# Verify AWS CLI
aws --version
aws sts get-caller-identity  # Verify credentials

# Verify Git
git --version
```

### 2. Configure AWS Credentials

```bash
# Option 1: Environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

# Option 2: AWS CLI configure
aws configure
```

### 3. Create EC2 Key Pair

```bash
# Create a new key pair
aws ec2 create-key-pair \
  --key-name lms-dev-key \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/lms-dev-key.pem

chmod 400 ~/.ssh/lms-dev-key.pem

# For production
aws ec2 create-key-pair \
  --key-name lms-prod-key \
  --query 'KeyMaterial' \
  --output text > ~/.ssh/lms-prod-key.pem

chmod 400 ~/.ssh/lms-prod-key.pem
```

## Backend Infrastructure

The backend infrastructure (S3 + DynamoDB) must be created first.

### 1. Deploy Backend

```bash
cd terraform/backend-setup

# Review configuration
cat variables.tf

# Initialize and apply
terraform init
terraform plan
terraform apply
```

### 2. Note the Outputs

```bash
terraform output

# You should see:
# state_bucket_name = "lms-terraform-state-bucket"
# dynamodb_table_name = "lms-terraform-state-locks"
```

### 3. Verify Backend Resources

```bash
# Check S3 bucket
aws s3 ls | grep lms-terraform-state

# Check DynamoDB table
aws dynamodb describe-table --table-name lms-terraform-state-locks
```

## Environment Deployment

### Development Environment

#### 1. Configure Variables

```bash
cd terraform/environments/dev

# Edit terraform.tfvars
nano terraform.tfvars
```

**Required Changes**:
```hcl
bucket_suffix = "dev-YOUR-UNIQUE-ID"  # Must be globally unique
key_name      = "lms-dev-key"         # Your EC2 key pair name
db_password   = "YourSecurePassword123!"  # Change this!
```

#### 2. Initialize Terraform

```bash
terraform init

# You should see:
# "Successfully configured the backend "s3"!"
```

#### 3. Review Plan

```bash
terraform plan

# Review the resources to be created:
# - VPC with subnets
# - Security groups
# - S3 bucket
# - CloudWatch log groups
# - IAM roles
# - DocumentDB cluster
# - ElastiCache Redis
# - ALB
# - EC2 Auto Scaling Group
```

#### 4. Apply Configuration

```bash
terraform apply

# Type 'yes' when prompted
# Deployment takes approximately 10-15 minutes
```

#### 5. Save Outputs

```bash
terraform output > deployment-info.txt

# View application URL
terraform output application_url
```

### Production Environment

Follow the same steps but use the `prod` directory:

```bash
cd terraform/environments/prod

# Update terraform.tfvars with production values
nano terraform.tfvars

terraform init
terraform plan
terraform apply
```

**Production Considerations**:
- Use stronger passwords
- Restrict SSH access (`ssh_cidr_blocks`)
- Enable deletion protection
- Review backup retention periods
- Consider using AWS Secrets Manager

## Application Deployment

### Prepare Application Package

```bash
cd /path/to/AWS-production

# Run deployment script
bash scripts/deploy.sh dev dev-12345

# This will:
# 1. Package the LMS application
# 2. Upload to S3
# 3. Trigger instance refresh (optional)
```

### Manual Deployment

If you prefer manual deployment:

```bash
# 1. Package application
cd LMS
tar -czf lms-app.tar.gz Backend/ frontend/

# 2. Upload to S3
aws s3 cp lms-app.tar.gz s3://dev-lms-app-12345/app/

# 3. Trigger instance refresh
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name dev-lms-asg \
  --preferences MinHealthyPercentage=50,InstanceWarmup=300
```

### Verify Deployment

```bash
# Check instance status
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names dev-lms-asg

# Check target health
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>

# Test application
curl http://<alb-dns-name>
curl http://<alb-dns-name>/api/health
```

## Verification

### 1. Infrastructure Verification

```bash
# VPC
aws ec2 describe-vpcs --filters "Name=tag:Environment,Values=dev"

# EC2 Instances
aws ec2 describe-instances --filters "Name=tag:Environment,Values=dev"

# Load Balancer
aws elbv2 describe-load-balancers --names dev-lms-alb

# Database
aws docdb describe-db-clusters --db-cluster-identifier dev-lms-docdb

# Redis
aws elasticache describe-replication-groups --replication-group-id dev-lms-redis
```

### 2. Application Verification

```bash
# Get ALB DNS
ALB_DNS=$(terraform output -raw alb_dns_name)

# Test frontend
curl -I http://$ALB_DNS

# Test backend API
curl http://$ALB_DNS/api/health

# Test in browser
open http://$ALB_DNS
```

### 3. Logging Verification

```bash
# List log groups
aws logs describe-log-groups --log-group-name-prefix "/aws/ec2/dev"

# View recent logs
aws logs tail /aws/ec2/dev/lms/backend --follow

# Check for errors
aws logs filter-log-events \
  --log-group-name /aws/ec2/dev/lms/application \
  --filter-pattern "ERROR"
```

### 4. Monitoring Verification

```bash
# List CloudWatch alarms
aws cloudwatch describe-alarms --alarm-name-prefix "dev-"

# Get metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=AutoScalingGroupName,Value=dev-lms-asg \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average
```

## Updates and Changes

### Infrastructure Updates

```bash
cd terraform/environments/dev

# 1. Make changes to terraform files or variables
nano terraform.tfvars

# 2. Review changes
terraform plan

# 3. Apply changes
terraform apply
```

### Application Updates

```bash
# 1. Update application code
cd LMS/Backend
# Make your changes

# 2. Deploy new version
cd ../..
bash scripts/deploy.sh dev dev-12345 --refresh-instances

# 3. Monitor deployment
aws autoscaling describe-instance-refreshes \
  --auto-scaling-group-name dev-lms-asg
```

### Scaling Adjustments

```bash
# Update ASG capacity
aws autoscaling set-desired-capacity \
  --auto-scaling-group-name dev-lms-asg \
  --desired-capacity 2

# Update min/max in Terraform
cd terraform/environments/dev
# Edit terraform.tfvars
# asg_min_size = 2
# asg_max_size = 4
terraform apply
```

## Rollback Procedures

### Application Rollback

```bash
# 1. List previous versions
aws s3 ls s3://dev-lms-app-12345/app/versions/

# 2. Copy previous version
aws s3 cp s3://dev-lms-app-12345/app/versions/lms-app-20240209-120000.tar.gz \
  s3://dev-lms-app-12345/app/lms-app.tar.gz

# 3. Trigger instance refresh
aws autoscaling start-instance-refresh \
  --auto-scaling-group-name dev-lms-asg
```

### Infrastructure Rollback

```bash
cd terraform/environments/dev

# Option 1: Revert to previous state
terraform state pull > current-state.json
# Restore from backup if needed

# Option 2: Destroy and recreate
terraform destroy -target=module.ec2
terraform apply

# Option 3: Use Terraform workspace
terraform workspace list
terraform workspace select previous-version
terraform apply
```

### Emergency Rollback

```bash
# Stop all traffic to ALB
aws elbv2 modify-listener \
  --listener-arn <listener-arn> \
  --default-actions Type=fixed-response,FixedResponseConfig={StatusCode=503}

# Scale down to zero
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name dev-lms-asg \
  --min-size 0 \
  --desired-capacity 0

# Investigate and fix issues

# Scale back up
aws autoscaling update-auto-scaling-group \
  --auto-scaling-group-name dev-lms-asg \
  --min-size 1 \
  --desired-capacity 1

# Restore listener
aws elbv2 modify-listener \
  --listener-arn <listener-arn> \
  --default-actions Type=forward,TargetGroupArn=<target-group-arn>
```

## Environment Promotion (Dev → Prod)

### 1. Test in Dev

```bash
# Ensure dev is stable
cd terraform/environments/dev
terraform plan  # Should show no changes

# Verify application
curl http://$(terraform output -raw alb_dns_name)
```

### 2. Update Prod Configuration

```bash
cd ../prod

# Update terraform.tfvars with tested values
nano terraform.tfvars

# Review changes
terraform plan
```

### 3. Deploy to Prod

```bash
# Apply during maintenance window
terraform apply

# Monitor deployment
watch -n 5 'aws elbv2 describe-target-health --target-group-arn <arn>'
```

### 4. Verify Prod

```bash
# Test application
curl http://$(terraform output -raw alb_dns_name)

# Check logs
aws logs tail /aws/ec2/prod/lms/application --follow

# Monitor metrics
# Check CloudWatch dashboard
```

## Cleanup

### Destroy Environment

```bash
cd terraform/environments/dev

# Destroy all resources
terraform destroy

# Verify deletion
aws ec2 describe-vpcs --filters "Name=tag:Environment,Values=dev"
```

### Destroy Backend (Last Step)

```bash
cd terraform/backend-setup

# Only do this if you're completely done
terraform destroy
```

---

**Note**: Always test changes in dev before applying to prod. Use Terraform workspaces or separate state files for complete isolation.
