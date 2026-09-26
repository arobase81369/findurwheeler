export function CarGridSkeleton({ count = 4 }) {
  return (
    <ul className="car-grid" aria-busy="true" aria-label="Loading cars">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <div className="car-card car-card--skeleton" aria-hidden="true">
            <div className="car-card__media skeleton" />
            <div className="car-card__body">
              <div className="skeleton skeleton--line skeleton--short" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
