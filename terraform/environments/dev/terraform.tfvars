# General Configuration
environment = "dev"
aws_region  = "us-east-1"

# VPC Configuration
vpc_cidr             = "10.0.0.0/16"
public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
availability_zones   = ["us-east-1a", "us-east-1b"]
enable_nat_gateway   = true

# Security Configuration
ssh_cidr_blocks = ["0.0.0.0/0"] # CHANGE THIS to your IP for production

# S3 Configuration
bucket_suffix          = "dev-12345" # Change to a unique suffix
s3_log_retention_days  = 30

# CloudWatch Configuration
cloudwatch_log_retention_days = 7
error_threshold                = 10
cpu_threshold                  = 80
memory_threshold               = 80
disk_threshold                 = 85
enable_cpu_alarm               = true
enable_memory_alarm            = true
enable_disk_alarm              = true

# Database Configuration
db_username                = "admin"
db_password                = "ChangeMe123!" # CHANGE THIS - Use AWS Secrets Manager in production
db_instance_class          = "db.t3.medium"
db_instance_count          = 1
db_backup_retention_period = 7
db_skip_final_snapshot     = true

# Redis Configuration
redis_node_type                = "cache.t3.micro"
redis_num_cache_nodes          = 1
redis_snapshot_retention_limit = 5

# ALB Configuration
enable_alb_access_logs         = false
enable_alb_deletion_protection = false
certificate_arn                = "" # Add ACM certificate ARN for HTTPS

# EC2 Configuration
instance_type        = "t3.small"
key_name             = "lms-dev-key" # CHANGE THIS to your key pair name
root_volume_size     = 30
asg_min_size         = 1
asg_max_size         = 2
asg_desired_capacity = 1
enable_autoscaling   = false
