import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2AccountId = process.env.R2_ACCOUNT_ID as string | undefined;
const r2AccessKeyId = process.env.R2_ACCESS_KEY_ID as string | undefined;
const r2SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY as string | undefined;
const r2Bucket = process.env.R2_BUCKET as string | undefined;

export const isR2Configured = () => !!(r2AccountId && r2AccessKeyId && r2SecretAccessKey && r2Bucket);

export const r2Client = (() => {
  if (!isR2Configured()) return null as unknown as S3Client;
  return new S3Client({
    region: 'auto',
    endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: r2AccessKeyId!,
      secretAccessKey: r2SecretAccessKey!,
    },
  });
})();

export const createR2SignedDownloadUrl = async (key: string, expiresInSeconds = 60 * 60 * 24) => {
  if (!isR2Configured()) throw new Error('R2 not configured');
  const client = r2Client as S3Client;
  const cmd = new GetObjectCommand({ Bucket: r2Bucket, Key: key });
  return await getSignedUrl(client, cmd, { expiresIn: expiresInSeconds });
};

export const putR2Object = async (key: string, body: Buffer | Uint8Array | string, contentType?: string) => {
  if (!isR2Configured()) throw new Error('R2 not configured');
  const client = r2Client as S3Client;
  const cmd = new PutObjectCommand({ Bucket: r2Bucket, Key: key, Body: body, ContentType: contentType });
  await client.send(cmd);
};


