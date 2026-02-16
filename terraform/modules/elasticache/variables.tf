variable "environment" {
  description = "Environment name"
  type        = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs for ElastiCache"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group ID for ElastiCache"
  type        = string
}

variable "node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "snapshot_retention_limit" {
  description = "Number of days to retain snapshots"
  type        = number
  default     = 5
}

variable "cloudwatch_log_group" {
  description = "CloudWatch log group for Redis logs"
  type        = string
}
