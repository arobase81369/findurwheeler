/** Shared empty / error / notice panel. */
export function StateMessage({ title, text, action }) {
  return (
    <div className="empty-state">
      <h2 className="empty-state__title">{title}</h2>
      {text ? <p className="empty-state__text">{text}</p> : null}
      {action}
    </div>
  );
}
