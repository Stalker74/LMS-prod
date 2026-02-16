# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "IDs of public subnets"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "IDs of private subnets"
  value       = module.vpc.private_subnet_ids
}

# ALB Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "application_url" {
  description = "URL to access the application"
  value       = "http://${module.alb.alb_dns_name}"
}

# S3 Outputs
output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = module.s3.bucket_name
}

# Database Outputs
output "database_endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = module.rds.cluster_endpoint
  sensitive   = true
}

# Redis Outputs
output "redis_endpoint" {
  description = "ElastiCache Redis primary endpoint"
  value       = module.elasticache.primary_endpoint_address
  sensitive   = true
}

# EC2 Outputs
output "autoscaling_group_name" {
  description = "Name of the Auto Scaling Group"
  value       = module.ec2.autoscaling_group_name
}

# CloudWatch Outputs
output "log_groups" {
  description = "CloudWatch log group names"
  value       = module.cloudwatch.all_log_groups
}

# Connection Information
output "connection_info" {
  description = "Information for connecting to the infrastructure"
  value = {
    application_url    = "http://${module.alb.alb_dns_name}"
    backend_api_url    = "http://${module.alb.alb_dns_name}/api"
    database_endpoint  = module.rds.cluster_endpoint
    redis_endpoint     = module.elasticache.primary_endpoint_address
    s3_bucket          = module.s3.bucket_name
  }
  sensitive = true
}
