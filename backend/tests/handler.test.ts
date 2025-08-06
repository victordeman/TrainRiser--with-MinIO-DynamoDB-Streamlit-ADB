import { uploadVideo } from '../functions/handler';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

vi.mock('@aws-sdk/client-s3');
vi.mock('@aws-sdk/s3-request-presigner');

test('uploadVideo returns presigned URL', async () => {
  const mockSignedUrl = 'http://localhost:9000/training-module-videos/123.mp4';
  vi.mocked(getSignedUrl).mockResolvedValue(mockSignedUrl);
  const event = { body: JSON.stringify({ moduleId: '123' }) };
  const response = await uploadVideo(event);
  expect(response.statusCode).toBe(200);
  expect(JSON.parse(response.body).presignedUrl).toBe(mockSignedUrl);
});

test('uploadVideo returns 400 for missing moduleId', async () => {
  const event = { body: JSON.stringify({}) };
  const response = await uploadVideo(event);
  expect(response.statusCode).toBe(400);
  expect(JSON.parse(response.body).error).toBe('moduleId is required');
});
