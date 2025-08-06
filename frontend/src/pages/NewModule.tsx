import { useState } from 'react';
import { z } from 'zod';
import VideoUpload from '@/components/VideoUpload';
import { uploadVideo, saveMetadata } from '@/lib/api';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  language: z.enum(['en', 'es', 'fr'])
});

export default function NewModule() {
  const [formData, setFormData] = useState({ title: '', description: '', language: 'en' });
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [moduleId, setModuleId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(formData);
    if (!result.success) {
      const newErrors: { title?: string; description?: string } = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0] === 'title' || issue.path[0] === 'description') {
          newErrors[issue.path[0] as 'title' | 'description'] = issue.message;
        }
      });
      setErrors(newErrors);
    } else {
      setErrors({});
      try {
        if (moduleId) {
          await saveMetadata({ ...formData, moduleId });
          alert('Form submitted and metadata saved successfully!');
        } else {
          alert('Please upload a video first.');
        }
      } catch (error) {
        alert('Failed to save metadata: ' + (error as Error).message);
      }
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const newModuleId = crypto.randomUUID();
      setModuleId(newModuleId);
      const response = await uploadVideo(file, newModuleId);
      if (response.presignedUrl) {
        await fetch(response.presignedUrl, { method: 'PUT', body: file });
        alert('Video uploaded successfully!');
      }
    } catch (error) {
      alert('Upload failed: ' + (error as Error).message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <VideoUpload onUpload={handleUpload} />
      <label style={{ display: 'block', margin: '1rem 0' }}>
        Title: <input type="text" name="title" value={formData.title} onChange={handleChange} />
        {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
      </label>
      <label style={{ display: 'block', margin: '1rem 0' }}>
        Description: <textarea name="description" value={formData.description} onChange={handleChange} />
        {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
      </label>
      <label style={{ display: 'block', margin: '1rem 0' }}>
        Language:
        <select name="language" value={formData.language} onChange={handleChange}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </label>
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        Save
      </button>
    </form>
  );
}
