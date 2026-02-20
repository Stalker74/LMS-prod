#!/bin/bash
set -e

# Update system packages
sudo yum update -y

# Install Node.js 18.x
sudo yum install -y gcc-c++ make
curl -sL https://rpm.nodesource.com/setup_18.x | sudo -E bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm

# Create application directory
sudo mkdir -p /opt/lms
sudo chown ec2-user:ec2-user /opt/lms
cd /opt/lms

# Download application from S3
aws s3 cp s3://${S3_BUCKET}/app/lms-app.tar.gz /opt/lms/
tar -xzf lms-app.tar.gz
rm lms-app.tar.gz

# Install backend dependencies
cd /opt/lms/Backend
npm install --production

# Install frontend dependencies
cd /opt/lms/frontend
npm install --production
npm run build

# Create environment file for backend
cat > /opt/lms/Backend/.env << EOF
NODE_ENV=production
PORT=4000
MONGODB_URI=${MONGODB_URI}
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=6379
S3_BUCKET=${S3_BUCKET}
AWS_REGION=${AWS_REGION}
LOG_LEVEL=info
EOF

# Create environment file for frontend
cat > /opt/lms/frontend/.env.production << EOF
NEXT_PUBLIC_API_URL=http://localhost:4000
NODE_ENV=production
EOF

# Create systemd service for backend
sudo cat > /etc/systemd/system/lms-backend.service << EOF
[Unit]
Description=LMS Backend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/lms/Backend
ExecStart=/usr/bin/node server.ts
Restart=always
RestartSec=10
StandardOutput=append:/var/log/lms-backend.log
StandardError=append:/var/log/lms-backend-error.log

[Install]
WantedBy=multi-user.target
EOF

# Create systemd service for frontend
sudo cat > /etc/systemd/system/lms-frontend.service << EOF
[Unit]
Description=LMS Frontend Service
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/lms/frontend
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=append:/var/log/lms-frontend.log
StandardError=append:/var/log/lms-frontend-error.log
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Configure CloudWatch agent
sudo cat > /opt/aws/amazon-cloudwatch-agent/etc/config.json << EOF
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/lms-backend.log",
            "log_group_name": "${BACKEND_LOG_GROUP}",
            "log_stream_name": "{instance_id}/backend",
            "timezone": "UTC"
          },
          {
            "file_path": "/var/log/lms-backend-error.log",
            "log_group_name": "${BACKEND_LOG_GROUP}",
            "log_stream_name": "{instance_id}/backend-error",
            "timezone": "UTC"
          },
          {
            "file_path": "/var/log/lms-frontend.log",
            "log_group_name": "${FRONTEND_LOG_GROUP}",
            "log_stream_name": "{instance_id}/frontend",
            "timezone": "UTC"
          },
          {
            "file_path": "/var/log/lms-frontend-error.log",
            "log_group_name": "${FRONTEND_LOG_GROUP}",
            "log_stream_name": "{instance_id}/frontend-error",
            "timezone": "UTC"
          },
          {
            "file_path": "/var/log/messages",
            "log_group_name": "${SYSTEM_LOG_GROUP}",
            "log_stream_name": "{instance_id}/messages",
            "timezone": "UTC"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "LMS/EC2",
    "metrics_collected": {
      "cpu": {
        "measurement": [
          {
            "name": "cpu_usage_idle",
            "rename": "CPU_IDLE",
            "unit": "Percent"
          },
          "cpu_usage_iowait"
        ],
        "metrics_collection_interval": 60,
        "totalcpu": false
      },
      "disk": {
        "measurement": [
          {
            "name": "used_percent",
            "rename": "DISK_USED",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60,
        "resources": [
          "*"
        ]
      },
      "mem": {
        "measurement": [
          {
            "name": "mem_used_percent",
            "rename": "MEM_USED",
            "unit": "Percent"
          }
        ],
        "metrics_collection_interval": 60
      }
    }
  }
}
EOF

# Start and enable CloudWatch agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -s \
    -c file:/opt/aws/amazon-cloudwatch-agent/etc/config.json

# Reload systemd and start services
sudo systemctl daemon-reload
sudo systemctl enable lms-backend
sudo systemctl enable lms-frontend
sudo systemctl start lms-backend
sudo systemctl start lms-frontend

# Create health check endpoint verification
sleep 10
curl -f http://localhost:4000/health || echo "Backend health check failed"
curl -f http://localhost:3001/ || echo "Frontend health check failed"

echo "LMS application deployment completed successfully!"
