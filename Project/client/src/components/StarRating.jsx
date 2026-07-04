export default function StarRating({ rating = 0, numReviews = 0, size = 16 }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="star-rating">
      {stars.map((star) => (
        <span
          key={star}
          className={`star ${star <= Math.round(rating) ? 'filled' : ''}`}
          style={{ fontSize: size }}
        >
          ★
        </span>
      ))}
      {numReviews > 0 && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: 4 }}>
          ({numReviews})
        </span>
      )}
    </div>
  );
}
