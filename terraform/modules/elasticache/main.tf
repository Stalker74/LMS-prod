resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.environment}-redis-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.environment}-redis-subnet-group"
    Environment = var.environment
  }
}

resource "aws_elasticache_parameter_group" "main" {
  name   = "${var.environment}-redis-params"
  family = "redis7"

  tags = {
    Name        = "${var.environment}-redis-params"
    Environment = var.environment
  }
}

resource "aws_elasticache_replication_group" "main" {
  replication_group_id       = "${var.environment}-lms-redis"
  description                = "Redis cluster for LMS application"
  engine                     = "redis"
  engine_version             = "7.0"
  node_type                  = var.node_type
  num_cache_clusters         = var.num_cache_nodes
  parameter_group_name       = aws_elasticache_parameter_group.main.name
  port                       = 6379
  subnet_group_name          = aws_elasticache_subnet_group.main.name
  security_group_ids         = [var.security_group_id]
  automatic_failover_enabled = var.num_cache_nodes > 1 ? true : false
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false
  snapshot_retention_limit   = var.snapshot_retention_limit
  snapshot_window            = "03:00-05:00"
  maintenance_window         = "mon:05:00-mon:07:00"

  log_delivery_configuration {
    destination      = var.cloudwatch_log_group
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "slow-log"
  }

  tags = {
    Name        = "${var.environment}-lms-redis"
    Environment = var.environment
  }
}
