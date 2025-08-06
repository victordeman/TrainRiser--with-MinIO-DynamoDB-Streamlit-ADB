export async function uploadVideo(file: File, moduleId: string) {
  const response = await fetch('http://localhost:3000/modules/upload', {
    method: 'POST',
    body: JSON.stringify({ moduleId })
  });
  return response.json();
}

export async function saveMetadata(data: {
  moduleId: string;
  title: string;
  description: string;
  language: string;
}) {
  const response = await fetch('http://localhost:3000/modules', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  return response.json();
}

export async function getModules() {
  const response = await fetch('http://localhost:3000/modules');
  return response.json();
}

export async function trackAnalytics(moduleId: string, action: 'view' | 'complete') {
  const response = await fetch(`http://localhost:3000/modules/${moduleId}/analytics`, {
    method: 'POST',
    body: JSON.stringify({ action })
  });
  return response.json();
}
