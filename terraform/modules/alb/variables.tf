variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ALB will be created"
  type        = string
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs for ALB"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID for ALB"
  type        = string
}

variable "access_logs_bucket" {
  description = "S3 bucket name for ALB access logs"
  type        = string
}

variable "enable_access_logs" {
  description = "Enable ALB access logs"
  type        = bool
  default     = false
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for ALB"
  type        = bool
  default     = false
}

variable "certificate_arn" {
  description = "ARN of ACM certificate for HTTPS listener (optional)"
  type        = string
  default     = ""
}
