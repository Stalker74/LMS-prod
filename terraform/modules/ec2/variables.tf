variable "environment" {
  description = "Environment name"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "EC2 key pair name for SSH access"
  type        = string
}

variable "subnet_ids" {
  description = "List of subnet IDs for EC2 instances"
  type        = list(string)
}

variable "ec2_security_group_id" {
  description = "Security group ID for EC2 instances"
  type        = string
}

variable "iam_instance_profile" {
  description = "IAM instance profile name"
  type        = string
}

variable "target_group_arns" {
  description = "List of target group ARNs for ALB"
  type        = list(string)
}

variable "s3_bucket_name" {
  description = "S3 bucket name for application artifacts"
  type        = string
}

variable "mongodb_uri" {
  description = "MongoDB connection URI"
  type        = string
}

variable "redis_host" {
  description = "Redis host endpoint"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "backend_log_group" {
  description = "CloudWatch log group for backend logs"
  type        = string
}

variable "frontend_log_group" {
  description = "CloudWatch log group for frontend logs"
  type        = string
}

variable "system_log_group" {
  description = "CloudWatch log group for system logs"
  type        = string
}

variable "root_volume_size" {
  description = "Size of root EBS volume in GB"
  type        = number
  default     = 30
}

variable "min_size" {
  description = "Minimum number of instances in ASG"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of instances in ASG"
  type        = number
  default     = 4
}

variable "desired_capacity" {
  description = "Desired number of instances in ASG"
  type        = number
  default     = 1
}

variable "enable_autoscaling" {
  description = "Enable auto scaling based on CPU metrics"
  type        = bool
  default     = false
}
