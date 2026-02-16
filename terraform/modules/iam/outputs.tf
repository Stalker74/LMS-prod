output "ec2_role_arn" {
  description = "EC2 IAM role ARN"
  value       = aws_iam_role.ec2_role.arn
}

output "ec2_instance_profile_name" {
  description = "EC2 instance profile name"
  value       = aws_iam_instance_profile.ec2_profile.name
}

# Alias for backward compatibility
output "instance_profile_name" {
  description = "EC2 instance profile name (alias)"
  value       = aws_iam_instance_profile.ec2_profile.name
}
