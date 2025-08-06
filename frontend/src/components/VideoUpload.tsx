import { useState } from 'react';

export default function VideoUpload({ onUpload }: { onUpload: (file: File) => void }) {
  const [progress, setProgress] = useState(0);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024) { // 100MB limit
      onUpload(file);
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = Math.min(prev + 10, 100);
          if (next === 100) clearInterval(interval);
          return next;
        });
      }, 500);
    } else {
      alert(file.type.startsWith('video/') ? 'File size exceeds 100MB limit' : 'Invalid file type. Please upload a video.');
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        border: '2px dashed #ccc',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer'
      }}
    >
      <p>Drop video here (MP4, AVI, etc., max 100MB)</p>
      {progress > 0 && (
        <progress value={progress} max="100">
          {progress}%
        </progress>
      )}
    </div>
  );
}
