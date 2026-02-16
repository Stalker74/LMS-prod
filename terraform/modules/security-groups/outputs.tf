output "alb_sg_id" {
  description = "ALB security group ID"
  value       = aws_security_group.alb.id
}

output "ec2_sg_id" {
  description = "EC2 security group ID"
  value       = aws_security_group.ec2.id
}

output "rds_sg_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds.id
}

output "elasticache_sg_id" {
  description = "ElastiCache security group ID"
  value       = aws_security_group.elasticache.id
}

# Aliases for backward compatibility
output "alb_security_group_id" {
  description = "ALB security group ID (alias)"
  value       = aws_security_group.alb.id
}

output "ec2_security_group_id" {
  description = "EC2 security group ID (alias)"
  value       = aws_security_group.ec2.id
}

output "rds_security_group_id" {
  description = "RDS security group ID (alias)"
  value       = aws_security_group.rds.id
}

output "elasticache_security_group_id" {
  description = "ElastiCache security group ID (alias)"
  value       = aws_security_group.elasticache.id
}
