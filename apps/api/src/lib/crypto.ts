import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

const ALGORITHM = 'aes-256-gcm';

const getKey = (secret: string) => createHash('sha256').update(secret).digest();

export const encryptSecret = (value: string, secret: string) => {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, getKey(secret), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString('base64url');
};

export const decryptSecret = (value: string, secret: string) => {
  const buffer = Buffer.from(value, 'base64url');
  const iv = buffer.subarray(0, 12);
  const tag = buffer.subarray(12, 28);
  const encrypted = buffer.subarray(28);
  const decipher = createDecipheriv(ALGORITHM, getKey(secret), iv);

  decipher.setAuthTag(tag);

  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
};
