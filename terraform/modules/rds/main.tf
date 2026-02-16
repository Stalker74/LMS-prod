resource "aws_docdb_subnet_group" "main" {
  name       = "${var.environment}-docdb-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "${var.environment}-docdb-subnet-group"
    Environment = var.environment
  }
}

resource "aws_docdb_cluster_parameter_group" "main" {
  family = "docdb5.0"
  name   = "${var.environment}-docdb-params"

  parameter {
    name  = "tls"
    value = "disabled"
  }

  tags = {
    Name        = "${var.environment}-docdb-params"
    Environment = var.environment
  }
}

resource "aws_docdb_cluster" "main" {
  cluster_identifier              = "${var.environment}-lms-docdb"
  engine                          = "docdb"
  master_username                 = var.db_username
  master_password                 = var.db_password
  backup_retention_period         = var.backup_retention_period
  preferred_backup_window         = "03:00-04:00"
  preferred_maintenance_window    = "mon:04:00-mon:05:00"
  skip_final_snapshot             = var.skip_final_snapshot
  db_subnet_group_name            = aws_docdb_subnet_group.main.name
  vpc_security_group_ids          = [var.security_group_id]
  db_cluster_parameter_group_name = aws_docdb_cluster_parameter_group.main.name
  enabled_cloudwatch_logs_exports = ["audit", "profiler"]

  tags = {
    Name        = "${var.environment}-lms-docdb"
    Environment = var.environment
  }
}

resource "aws_docdb_cluster_instance" "main" {
  count              = var.instance_count
  identifier         = "${var.environment}-lms-docdb-${count.index}"
  cluster_identifier = aws_docdb_cluster.main.id
  instance_class     = var.instance_class

  tags = {
    Name        = "${var.environment}-lms-docdb-${count.index}"
    Environment = var.environment
  }
}
