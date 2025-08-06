import { useEffect, useState } from 'react';
import { getModules, trackAnalytics } from '@/lib/api';

interface Module {
  moduleId: string;
  title: string;
  description: string;
  language: string;
  views: string;
  completions: string;
}

export default function Modules() {
  const [modules, setModules] = useState<Module[]>([]);

  useEffect(() => {
    getModules().then((data) => setModules(data));
  }, []);

  const handleView = (moduleId: string) => {
    trackAnalytics(moduleId, 'view').then(() => alert('View tracked!'));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Modules</h1>
      {modules.length === 0 ? (
        <p>No modules found.</p>
      ) : (
        modules.map((module) => (
          <div key={module.moduleId} style={{ marginBottom: '1rem' }}>
            <h2>{module.title}</h2>
            <p>{module.description}</p>
            <p>Language: {module.language}</p>
            <p>Views: {module.views}</p>
            <p>Completions: {module.completions}</p>
            <button
              onClick={() => handleView(module.moduleId)}
              style={{ padding: '0.5rem 1rem', marginRight: '1rem' }}
            >
              View Module
            </button>
            <button
              onClick={() => trackAnalytics(module.moduleId, 'complete').then(() => alert('Completion tracked!'))}
              style={{ padding: '0.5rem 1rem' }}
            >
              Complete Module
            </button>
          </div>
        ))
      )}
    </div>
  );
}
