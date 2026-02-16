# Backend Setup for Terraform State Management

This directory contains the Terraform configuration to create the remote state backend infrastructure.

## Purpose

This setup creates:
- **S3 Bucket**: Stores Terraform state files with versioning and encryption
- **DynamoDB Table**: Provides state locking to prevent concurrent modifications

## Prerequisites

- AWS CLI configured with appropriate credentials
- Terraform >= 1.0 installed

## Usage

### 1. Initialize and Apply

```bash
cd terraform/backend-setup
terraform init
terraform plan
terraform apply
```

### 2. Note the Outputs

After applying, note the output values:
- `state_bucket_name`: Use this in backend configuration
- `dynamodb_table_name`: Use this for state locking

### 3. Configure Backend in Environments

Use the outputs to configure the backend in `dev` and `prod` environments.

## Important Notes

> **⚠️ This configuration uses local state**
> 
> The backend-setup itself uses local state storage. After creating the S3 bucket and DynamoDB table, you can optionally migrate this state to the remote backend as well.

> **🔒 Security**
> 
> - The S3 bucket has versioning enabled to track state history
> - Server-side encryption (AES256) is enabled
> - All public access is blocked
> - Old versions are automatically expired after 90 days

## Customization

Edit `variables.tf` or create a `terraform.tfvars` file to customize:

```hcl
aws_region          = "us-east-1"
state_bucket_name   = "your-unique-bucket-name"
dynamodb_table_name = "your-lock-table-name"
```

**Note**: S3 bucket names must be globally unique across all AWS accounts.
