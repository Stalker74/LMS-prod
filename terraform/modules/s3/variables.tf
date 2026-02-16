variable "environment" {
  description = "Environment name"
  type        = string
}

variable "bucket_suffix" {
  description = "Unique suffix for bucket name"
  type        = string
}

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 30
}
