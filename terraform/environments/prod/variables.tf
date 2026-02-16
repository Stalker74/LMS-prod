# General Configuration
variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

# Security Configuration
variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed for SSH access"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

# S3 Configuration
variable "bucket_suffix" {
  description = "Unique suffix for S3 bucket name"
  type        = string
}

variable "s3_log_retention_days" {
  description = "Number of days to retain S3 logs"
  type        = number
  default     = 30
}

# CloudWatch Configuration
variable "cloudwatch_log_retention_days" {
  description = "Number of days to retain CloudWatch logs"
  type        = number
  default     = 7
}

variable "error_threshold" {
  description = "Threshold for error count alarm"
  type        = number
  default     = 10
}

variable "cpu_threshold" {
  description = "CPU utilization threshold percentage"
  type        = number
  default     = 80
}

variable "memory_threshold" {
  description = "Memory utilization threshold percentage"
  type        = number
  default     = 80
}

variable "disk_threshold" {
  description = "Disk utilization threshold percentage"
  type        = number
  default     = 85
}

variable "enable_cpu_alarm" {
  description = "Enable CPU utilization alarm"
  type        = bool
  default     = true
}

variable "enable_memory_alarm" {
  description = "Enable memory utilization alarm"
  type        = bool
  default     = true
}

variable "enable_disk_alarm" {
  description = "Enable disk utilization alarm"
  type        = bool
  default     = true
}

# Database Configuration
variable "db_username" {
  description = "Database master username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "db_instance_count" {
  description = "Number of database instances"
  type        = number
  default     = 1
}

variable "db_backup_retention_period" {
  description = "Database backup retention period in days"
  type        = number
  default     = 7
}

variable "db_skip_final_snapshot" {
  description = "Skip final snapshot when destroying database"
  type        = bool
  default     = true
}

# Redis Configuration
variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "redis_snapshot_retention_limit" {
  description = "Number of days to retain Redis snapshots"
  type        = number
  default     = 5
}

# ALB Configuration
variable "enable_alb_access_logs" {
  description = "Enable ALB access logs"
  type        = bool
  default     = false
}

variable "enable_alb_deletion_protection" {
  description = "Enable ALB deletion protection"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ARN of ACM certificate for HTTPS"
  type        = string
  default     = ""
}

# EC2 Configuration
variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.small"
}

variable "key_name" {
  description = "EC2 key pair name"
  type        = string
}

variable "root_volume_size" {
  description = "Size of root EBS volume in GB"
  type        = number
  default     = 30
}

variable "asg_min_size" {
  description = "Minimum number of instances in ASG"
  type        = number
  default     = 1
}

variable "asg_max_size" {
  description = "Maximum number of instances in ASG"
  type        = number
  default     = 2
}

variable "asg_desired_capacity" {
  description = "Desired number of instances in ASG"
  type        = number
  default     = 1
}

variable "enable_autoscaling" {
  description = "Enable auto scaling"
  type        = bool
  default     = false
}
