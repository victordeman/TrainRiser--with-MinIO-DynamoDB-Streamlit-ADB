import { useNavigate } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Serverless Training Module Generator
      </h1>
      <p>Welcome to the training module generator. Create and manage video-based training modules.</p>
      <button
        onClick={() => navigate('/modules/new')}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          marginRight: '1rem'
        }}
      >
        Create New Module
      </button>
      <button
        onClick={() => navigate('/modules')}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px'
        }}
      >
        View Modules
      </button>
    </main>
  );
}
