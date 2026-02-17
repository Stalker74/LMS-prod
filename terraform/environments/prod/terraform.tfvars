# General Configuration
environment = "prod"
aws_region  = "us-east-1"

# VPC Configuration
vpc_cidr             = "10.1.0.0/16"
public_subnet_cidrs  = ["10.1.1.0/24", "10.1.2.0/24", "10.1.3.0/24"]
private_subnet_cidrs = ["10.1.10.0/24", "10.1.11.0/24", "10.1.12.0/24"]
availability_zones   = ["us-east-1a", "us-east-1b", "us-east-1c"]
enable_nat_gateway   = true

# Security Configuration
ssh_cidr_blocks = ["0.0.0.0/0"] # CHANGE THIS to your IP or bastion host

# S3 Configuration
bucket_suffix          = "prod-67890" # Change to a unique suffix
s3_log_retention_days  = 90

# CloudWatch Configuration
cloudwatch_log_retention_days = 30
error_threshold                = 20
cpu_threshold                  = 75
memory_threshold               = 75
disk_threshold                 = 80
enable_cpu_alarm               = true
enable_memory_alarm            = true
enable_disk_alarm              = true

# Database Configuration
db_username                = "admin"
db_password                = "ChangeMe456!" # CHANGE THIS - Use AWS Secrets Manager
db_instance_class          = "db.r5.large"
db_instance_count          = 3
db_backup_retention_period = 30
db_skip_final_snapshot     = false

# Redis Configuration
redis_node_type                = "cache.r5.large"
redis_num_cache_nodes          = 3
redis_snapshot_retention_limit = 30

# ALB Configuration
enable_alb_access_logs         = true
enable_alb_deletion_protection = true
certificate_arn                = "" # Add ACM certificate ARN for HTTPS

# EC2 Configuration
instance_type        = "t3.medium"
key_name             = "lms-prod-key" # CHANGE THIS to your key pair name
root_volume_size     = 50
asg_min_size         = 2
asg_max_size         = 6
asg_desired_capacity = 2
enable_autoscaling   = true
