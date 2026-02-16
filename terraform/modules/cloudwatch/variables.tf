variable "environment" {
  description = "Environment name"
  type        = string
}

variable "log_retention_days" {
  description = "Number of days to retain logs in CloudWatch"
  type        = number
  default     = 30
}

variable "error_threshold" {
  description = "Threshold for error count alarm"
  type        = number
  default     = 10
}

variable "cpu_threshold" {
  description = "CPU utilization threshold percentage"
  type        = number
  default     = 80
}

variable "memory_threshold" {
  description = "Memory utilization threshold percentage"
  type        = number
  default     = 80
}

variable "disk_threshold" {
  description = "Disk utilization threshold percentage"
  type        = number
  default     = 85
}

variable "enable_cpu_alarm" {
  description = "Enable CPU utilization alarm"
  type        = bool
  default     = true
}

variable "enable_memory_alarm" {
  description = "Enable memory utilization alarm"
  type        = bool
  default     = true
}

variable "enable_disk_alarm" {
  description = "Enable disk utilization alarm"
  type        = bool
  default     = true
}

variable "asg_name" {
  description = "Auto Scaling Group name for CPU alarm (optional)"
  type        = string
  default     = ""
}
