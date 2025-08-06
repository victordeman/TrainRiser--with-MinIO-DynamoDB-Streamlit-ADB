import express from 'express';
import serverlessHttp from 'serverless-http';
import { uploadVideo, saveMetadata, getModules, trackAnalytics } from './handler';

const app = express();
app.use(express.json());

// Error handling middleware for JSON parsing errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'Invalid JSON' });
  } else {
    next(err);
  }
});

app.post('/modules/upload', async (req, res) => {
  const result = await uploadVideo({ body: JSON.stringify(req.body) } as any);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/modules', async (req, res) => {
  const result = await saveMetadata({ body: JSON.stringify(req.body) } as any);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.get('/modules', async (req, res) => {
  const result = await getModules();
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.post('/modules/:id/analytics', async (req, res) => {
  const result = await trackAnalytics({ pathParameters: { id: req.params.id }, body: JSON.stringify(req.body) } as any);
  res.status(result.statusCode).json(JSON.parse(result.body));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// General error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

export const handler = serverlessHttp(app);

if (require.main === module) {
  app.listen(3000, () => console.log('Mock API running on http://localhost:3000'));
}
