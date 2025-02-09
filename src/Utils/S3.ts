import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { configs } from '../Configs/ENV.config';
import { v4 as uuid } from 'uuid';

const s3Client = new S3Client({
  region: configs.aws.AWS_REGION,
  credentials: {
    accessKeyId: configs.aws.AWS_ACCESS_KEY_ID,
    secretAccessKey: configs.aws.AWS_SECRET_ACCESS_KEY,
  }
});

export const uploadFileToS3 = async (
  buffer: Buffer,
  fileName: string
): Promise<string> => {
  const fileKey = `${uuid()}-${fileName}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: configs.aws.BUCKET_NAME,
    Key: fileKey,
    Body: buffer,
    ContentType: getContentType(fileName)
  }));

  return `https://${configs.aws.BUCKET_NAME}.s3.${configs.aws.AWS_REGION}.amazonaws.com/${fileKey}`;
};

const getContentType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const contentTypes: { [key: string]: string } = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif'
  };
  return contentTypes[ext || ''] || 'application/octet-stream';
};