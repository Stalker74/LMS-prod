output "replication_group_id" {
  description = "ID of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.main.id
}

output "replication_group_arn" {
  description = "ARN of the ElastiCache replication group"
  value       = aws_elasticache_replication_group.main.arn
}

output "primary_endpoint_address" {
  description = "Address of the primary endpoint"
  value       = aws_elasticache_replication_group.main.primary_endpoint_address
}

output "reader_endpoint_address" {
  description = "Address of the reader endpoint"
  value       = aws_elasticache_replication_group.main.reader_endpoint_address
}

output "port" {
  description = "Port number for Redis connection"
  value       = aws_elasticache_replication_group.main.port
}

output "configuration_endpoint_address" {
  description = "Configuration endpoint address (for cluster mode)"
  value       = aws_elasticache_replication_group.main.configuration_endpoint_address
}
