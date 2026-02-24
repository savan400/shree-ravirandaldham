// wasabiClient.js  (CommonJS)
// Requires: npm install @aws-sdk/client-s3 @aws-sdk/lib-storage

const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const fs = require('fs');
require("dotenv").config();

const WASABI_REGION = process.env.WASABI_REGION || 'us-east-1';
const WASABI_ENDPOINT = process.env.WASABI_ENDPOINT || `https://s3.${WASABI_REGION}.wasabisys.com`;
const WASABI_BUCKET = process.env.WASABI_BUCKET;
const DEFAULT_PRESIGN_EXPIRES = Number(process.env.DEFAULT_PRESIGN_EXPIRES || 3600);

if (!process.env.WASABI_ACCESS_KEY || !process.env.WASABI_SECRET_KEY) {
  console.warn('[wasabiClient] WASABI_ACCESS_KEY or WASABI_SECRET_KEY not set in env');
}

const wasabiClient = new S3Client({
  region: WASABI_REGION,
  endpoint: WASABI_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY,
    secretAccessKey: process.env.WASABI_SECRET_KEY,
  },
  forcePathStyle: true,
  // Wasabi doesn't support AWS SDK v3 flexible checksums.
  // Without these flags, the SDK injects `x-amz-checksum-mode=ENABLED`
  // into pre-signed URLs, which Wasabi rejects causing 403/400 on every image.
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});


/**
 * Generate presigned GET URL for a given key
 */
async function presignGetUrl(key, { expiresIn } = {}) {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  const ttl = Number(expiresIn || DEFAULT_PRESIGN_EXPIRES) || DEFAULT_PRESIGN_EXPIRES;

  const cmd = new GetObjectCommand({
    Bucket: WASABI_BUCKET,
    Key: key,
  });

  return getSignedUrl(wasabiClient, cmd, { expiresIn: ttl });
}

/**
 * Upload object
 */
async function uploadObject(key, body, contentType = 'application/octet-stream') {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  const upload = new Upload({
    client: wasabiClient,
    params: {
      Bucket: WASABI_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    },
    queueSize: 10,
    partSize: 64 * 1024 * 1024,
  });
  return upload.done();
}

/**
 * GetObject wrapper
 */
async function getObject(key) {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  const cmd = new GetObjectCommand({ Bucket: WASABI_BUCKET, Key: key });
  return wasabiClient.send(cmd);
}

/**
 * HeadObject wrapper
 */
async function headObject(key) {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  const cmd = new HeadObjectCommand({ Bucket: WASABI_BUCKET, Key: key });
  return wasabiClient.send(cmd);
}

/**
 * List objects under prefix (with metadata)
 */
async function listObjects(prefix = '', maxKeys = Infinity) {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  const results = [];
  let continuationToken = undefined;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket: WASABI_BUCKET,
      Prefix: prefix || undefined,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });
    const resp = await wasabiClient.send(cmd);
    const items = resp.Contents || [];
    for (const o of items) {
      results.push({
        Key: o.Key,
        Size: o.Size,
        LastModified: o.LastModified,
        StorageClass: o.StorageClass,
      });
      if (results.length >= maxKeys) break;
    }
    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    if (results.length >= maxKeys) break;
  } while (continuationToken);
  return results;
}

/**
 * 👉 NEW: List all object keys only (for deletion use)
 */
async function listAllObjectsWithPrefix(prefix = '') {
  const objs = await listObjects(prefix);
  return objs.map(o => o.Key);
}

/**
 * Delete multiple objects (accepts array of keys).
 * Returns { deleted: number, failed: [] }
 */
async function deleteObjects(keys = []) {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  let deletedCount = 0;
  const failed = [];
  const chunkSize = 1000;

  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);
    const params = {
      Bucket: WASABI_BUCKET,
      Delete: {
        Objects: chunk.map(k => ({ Key: k })),
        Quiet: false,
      },
    };
    const cmd = new DeleteObjectsCommand(params);
    try {
      const resp = await wasabiClient.send(cmd);
      if (resp.Deleted) deletedCount += resp.Deleted.length;
      if (resp.Errors) failed.push(...resp.Errors);
    } catch (err) {
      console.error('[wasabiClient] deleteObjects chunk failed', err.message);
      failed.push({ message: err.message, chunk });
    }
  }
  return { deleted: deletedCount, failed };
}

async function getBucketSize(prefix = '') {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');
  let continuationToken = undefined;
  let total = 0n; // BigInt accumulator
  let count = 0;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: WASABI_BUCKET,
      Prefix: prefix || undefined,
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });

    const resp = await wasabiClient.send(cmd);
    const contents = resp.Contents || [];

    for (const obj of contents) {
      // Size is a Number; convert to BigInt
      const s = BigInt(obj.Size || 0);
      total += s;
      count++;
    }

    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  // return size as string to avoid precision loss for huge buckets
  return { sizeBytes: total.toString(), objectCount: count };
}

async function getBucketSizeAsNumber(prefix = '') {
  const res = await getBucketSize(prefix);
  const n = BigInt(res.sizeBytes);
  if (n > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('Bucket size exceeds Number.MAX_SAFE_INTEGER; use getBucketSize and handle BigInt string');
  }
  return { sizeBytes: Number(n), objectCount: res.objectCount };
}

async function listFolders(prefix = '') {
  if (!WASABI_BUCKET) throw new Error('WASABI_BUCKET not configured');

  // Ensure prefix is '' or ends with '/'
  if (prefix && !prefix.endsWith('/')) prefix = prefix + '/';

  const folders = new Set();
  let continuationToken = undefined;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: WASABI_BUCKET,
      Prefix: prefix || undefined,
      Delimiter: '/', // ask S3 for folder-style common prefixes
      ContinuationToken: continuationToken,
      MaxKeys: 1000,
    });

    const resp = await wasabiClient.send(cmd);

    // 1) Preferred: use CommonPrefixes if present
    if (Array.isArray(resp.CommonPrefixes) && resp.CommonPrefixes.length) {
      for (const cp of resp.CommonPrefixes) {
        if (!cp || !cp.Prefix) continue;
        // remove the requested prefix from the returned prefix to get immediate folder name
        let name = cp.Prefix;
        if (prefix) {
          name = name.slice(prefix.length);
        }
        // strip any trailing slash
        name = name.replace(/^\/+|\/+$/g, '');
        if (name) folders.add(name);
      }
    } else if (Array.isArray(resp.Contents) && resp.Contents.length) {
      // 2) Fallback: scan keys and extract first path segment after prefix
      for (const o of resp.Contents) {
        if (!o || !o.Key) continue;
        let rest = prefix ? o.Key.slice(prefix.length) : o.Key;
        if (!rest) continue;
        const parts = rest.split('/');
        if (parts.length > 1) {
          folders.add(parts[0]);
        }
      }
    }

    continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
  } while (continuationToken);

  return Array.from(folders);
}


/**
 * Helper: construct public-ish URL
 */
function objectUrl(key) {
  const endpoint = (WASABI_ENDPOINT || '').replace(/\/+$/, '');
  return `${endpoint}/${encodeURIComponent(WASABI_BUCKET)}/${encodeURIComponent(key)}`;
}

module.exports = {
  wasabiClient,
  uploadObject,
  listFolders,
  getObject,
  headObject,
  listObjects,
  listAllObjectsWithPrefix, // <-- added
  deleteObjects,            // now returns { deleted, failed }
  objectUrl,
  presignGetUrl,
  getBucketSize,
  getBucketSizeAsNumber
};
