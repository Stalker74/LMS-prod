import boto3

bucket_name = 'dev-lms-app-dev-12345'
s3 = boto3.resource('s3')
bucket = s3.Bucket(bucket_name)

print(f'Emptying bucket: {bucket_name}')
bucket.object_versions.all().delete()
print('All versions deleted')

bucket.delete()
print(f'Bucket {bucket_name} deleted successfully!')
