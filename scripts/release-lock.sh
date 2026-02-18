#!/bin/bash
# Release Terraform State Lock

echo "Releasing Terraform state locks..."

# Release dev lock
aws dynamodb delete-item \
  --table-name lms-terraform-state-locks \
  --key '{"LockID": {"S": "lms-terraform-state-bucket/env/dev/terraform.tfstate-md5"}}' \
  --region us-east-1 2>/dev/null

echo "Dev lock released (if existed)"

# Release prod lock
aws dynamodb delete-item \
  --table-name lms-terraform-state-locks \
  --key '{"LockID": {"S": "lms-terraform-state-bucket/env/prod/terraform.tfstate-md5"}}' \
  --region us-east-1 2>/dev/null

echo "Prod lock released (if existed)"
echo "Done!"
