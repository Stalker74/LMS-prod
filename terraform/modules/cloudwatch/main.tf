resource "aws_cloudwatch_log_group" "backend" {
  name              = "/aws/ec2/${var.environment}/lms/backend"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.environment}-backend-logs"
    Environment = var.environment
    Application = "LMS-Backend"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/aws/ec2/${var.environment}/lms/frontend"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.environment}-frontend-logs"
    Environment = var.environment
    Application = "LMS-Frontend"
  }
}

resource "aws_cloudwatch_log_group" "system" {
  name              = "/aws/ec2/${var.environment}/lms/system"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.environment}-system-logs"
    Environment = var.environment
    Application = "LMS-System"
  }
}

resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/ec2/${var.environment}/lms/application"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.environment}-application-logs"
    Environment = var.environment
    Application = "LMS-Application"
  }
}

# Metric filter for application errors
resource "aws_cloudwatch_log_metric_filter" "error_count" {
  name           = "${var.environment}-error-count"
  log_group_name = aws_cloudwatch_log_group.application.name
  pattern        = "[ERROR]"

  metric_transformation {
    name      = "ErrorCount"
    namespace = "LMS/${var.environment}"
    value     = "1"
  }
}

# Alarm for high error rate
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${var.environment}-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "ErrorCount"
  namespace           = "LMS/${var.environment}"
  period              = "300"
  statistic           = "Sum"
  threshold           = var.error_threshold
  alarm_description   = "This metric monitors application error rate"
  treat_missing_data  = "notBreaching"

  tags = {
    Name        = "${var.environment}-high-error-rate-alarm"
    Environment = var.environment
  }
}

# CPU utilization alarm
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  count               = var.enable_cpu_alarm ? 1 : 0
  alarm_name          = "${var.environment}-high-cpu-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "300"
  statistic           = "Average"
  threshold           = var.cpu_threshold
  alarm_description   = "This metric monitors EC2 CPU utilization"
  treat_missing_data  = "notBreaching"

  dimensions = {
    AutoScalingGroupName = var.asg_name
  }

  tags = {
    Name        = "${var.environment}-high-cpu-alarm"
    Environment = var.environment
  }
}

# Memory utilization alarm (requires CloudWatch agent)
resource "aws_cloudwatch_metric_alarm" "high_memory" {
  count               = var.enable_memory_alarm ? 1 : 0
  alarm_name          = "${var.environment}-high-memory-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "mem_used_percent"
  namespace           = "CWAgent"
  period              = "300"
  statistic           = "Average"
  threshold           = var.memory_threshold
  alarm_description   = "This metric monitors EC2 memory utilization"
  treat_missing_data  = "notBreaching"

  tags = {
    Name        = "${var.environment}-high-memory-alarm"
    Environment = var.environment
  }
}

# Disk utilization alarm
resource "aws_cloudwatch_metric_alarm" "high_disk" {
  count               = var.enable_disk_alarm ? 1 : 0
  alarm_name          = "${var.environment}-high-disk-utilization"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "disk_used_percent"
  namespace           = "CWAgent"
  period              = "300"
  statistic           = "Average"
  threshold           = var.disk_threshold
  alarm_description   = "This metric monitors EC2 disk utilization"
  treat_missing_data  = "notBreaching"

  dimensions = {
    path   = "/"
    fstype = "ext4"
  }

  tags = {
    Name        = "${var.environment}-high-disk-alarm"
    Environment = var.environment
  }
}
