terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "lms-terraform-state-bucket"
    key            = "env/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "lms-terraform-state-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "LMS-Infrastructure"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  environment          = var.environment
  vpc_cidr             = var.vpc_cidr
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
  availability_zones   = var.availability_zones
  enable_nat_gateway   = var.enable_nat_gateway
}

# Security Groups Module
module "security_groups" {
  source = "../../modules/security-groups"

  environment      = var.environment
  vpc_id           = module.vpc.vpc_id
  ssh_cidr_blocks  = var.ssh_cidr_blocks
}

# S3 Module
module "s3" {
  source = "../../modules/s3"

  environment         = var.environment
  bucket_suffix       = var.bucket_suffix
  log_retention_days  = var.s3_log_retention_days
}

# CloudWatch Module
module "cloudwatch" {
  source = "../../modules/cloudwatch"

  environment         = var.environment
  log_retention_days  = var.cloudwatch_log_retention_days
  error_threshold     = var.error_threshold
  cpu_threshold       = var.cpu_threshold
  memory_threshold    = var.memory_threshold
  disk_threshold      = var.disk_threshold
  enable_cpu_alarm    = var.enable_cpu_alarm
  enable_memory_alarm = var.enable_memory_alarm
  enable_disk_alarm   = var.enable_disk_alarm
  asg_name            = module.ec2.autoscaling_group_name
}

# IAM Module
module "iam" {
  source = "../../modules/iam"

  environment   = var.environment
  s3_bucket_arn = module.s3.bucket_arn
}

# RDS (DocumentDB) Module
module "rds" {
  source = "../../modules/rds"

  environment             = var.environment
  private_subnet_ids      = module.vpc.private_subnet_ids
  security_group_id       = module.security_groups.rds_security_group_id
  db_username             = var.db_username
  db_password             = var.db_password
  instance_class          = var.db_instance_class
  instance_count          = var.db_instance_count
  backup_retention_period = var.db_backup_retention_period
  skip_final_snapshot     = var.db_skip_final_snapshot
}

# ElastiCache (Redis) Module
module "elasticache" {
  source = "../../modules/elasticache"

  environment              = var.environment
  private_subnet_ids       = module.vpc.private_subnet_ids
  security_group_id        = module.security_groups.elasticache_security_group_id
  node_type                = var.redis_node_type
  num_cache_nodes          = var.redis_num_cache_nodes
  snapshot_retention_limit = var.redis_snapshot_retention_limit
  cloudwatch_log_group     = module.cloudwatch.application_log_group_name
}

# ALB Module
module "alb" {
  source = "../../modules/alb"

  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  public_subnet_ids          = module.vpc.public_subnet_ids
  alb_security_group_id      = module.security_groups.alb_security_group_id
  access_logs_bucket         = module.s3.bucket_name
  enable_access_logs         = var.enable_alb_access_logs
  enable_deletion_protection = var.enable_alb_deletion_protection
  certificate_arn            = var.certificate_arn
}

# EC2 Module
module "ec2" {
  source = "../../modules/ec2"

  environment           = var.environment
  instance_type         = var.instance_type
  key_name              = var.key_name
  subnet_ids            = module.vpc.public_subnet_ids
  ec2_security_group_id = module.security_groups.ec2_security_group_id
  iam_instance_profile  = module.iam.instance_profile_name
  target_group_arns     = [
    module.alb.backend_target_group_arn,
    module.alb.frontend_target_group_arn
  ]
  s3_bucket_name        = module.s3.bucket_name
  mongodb_uri           = "mongodb://${var.db_username}:${var.db_password}@${module.rds.cluster_endpoint}:27017/lms?tls=false"
  redis_host            = module.elasticache.primary_endpoint_address
  aws_region            = var.aws_region
  backend_log_group     = module.cloudwatch.backend_log_group_name
  frontend_log_group    = module.cloudwatch.frontend_log_group_name
  system_log_group      = module.cloudwatch.system_log_group_name
  root_volume_size      = var.root_volume_size
  min_size              = var.asg_min_size
  max_size              = var.asg_max_size
  desired_capacity      = var.asg_desired_capacity
  enable_autoscaling    = var.enable_autoscaling
}
