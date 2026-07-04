export default function Loader({ fullPage = false }) {
  if (fullPage) {
    return (
      <div className="loader-container" style={{ minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div className="spinner" />
          <p style={{ color: 'var(--text-muted)', fontWeight: 700, fontSize: '0.9375rem' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loader-container">
      <div className="spinner" />
    </div>
  );
}
