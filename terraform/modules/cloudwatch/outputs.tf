output "backend_log_group_name" {
  description = "Name of the backend log group"
  value       = aws_cloudwatch_log_group.backend.name
}

output "backend_log_group_arn" {
  description = "ARN of the backend log group"
  value       = aws_cloudwatch_log_group.backend.arn
}

output "frontend_log_group_name" {
  description = "Name of the frontend log group"
  value       = aws_cloudwatch_log_group.frontend.name
}

output "frontend_log_group_arn" {
  description = "ARN of the frontend log group"
  value       = aws_cloudwatch_log_group.frontend.arn
}

output "system_log_group_name" {
  description = "Name of the system log group"
  value       = aws_cloudwatch_log_group.system.name
}

output "system_log_group_arn" {
  description = "ARN of the system log group"
  value       = aws_cloudwatch_log_group.system.arn
}

output "application_log_group_name" {
  description = "Name of the application log group"
  value       = aws_cloudwatch_log_group.application.name
}

output "application_log_group_arn" {
  description = "ARN of the application log group"
  value       = aws_cloudwatch_log_group.application.arn
}

output "all_log_groups" {
  description = "Map of all log group names"
  value = {
    backend     = aws_cloudwatch_log_group.backend.name
    frontend    = aws_cloudwatch_log_group.frontend.name
    system      = aws_cloudwatch_log_group.system.name
    application = aws_cloudwatch_log_group.application.name
  }
}
