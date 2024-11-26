import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { config } from '../config';
import { v4 as uuid } from 'uuid';

const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
});

export const uploadFileToS3 = async (
  buffer: Buffer,
  fileName: string
): Promise<string> => {
  const fileKey = `${uuid()}-${fileName}`;
  
  await s3Client.send(new PutObjectCommand({
    Bucket: config.aws.bucketName,
    Key: fileKey,
    Body: buffer,
    ContentType: getContentType(fileName)
  }));

  return `https://${config.aws.bucketName}.s3.${config.aws.region}.amazonaws.com/${fileKey}`;
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