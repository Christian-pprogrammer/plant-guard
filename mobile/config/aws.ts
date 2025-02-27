import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
  region: 'us-east-2',
  credentials: {
    accessKeyId: 'AKIA2UC3BXLS7IRD4HXD',
    secretAccessKey: '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',
  },
});