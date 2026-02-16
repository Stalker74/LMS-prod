output "endpoint" {
  description = "DocumentDB cluster endpoint"
  value       = aws_docdb_cluster.main.endpoint
}

output "reader_endpoint" {
  description = "DocumentDB cluster reader endpoint"
  value       = aws_docdb_cluster.main.reader_endpoint
}

output "port" {
  description = "DocumentDB port"
  value       = aws_docdb_cluster.main.port
}

output "cluster_id" {
  description = "DocumentDB cluster ID"
  value       = aws_docdb_cluster.main.id
}

# Alias for backward compatibility
output "cluster_endpoint" {
  description = "DocumentDB cluster endpoint (alias)"
  value       = aws_docdb_cluster.main.endpoint
}
