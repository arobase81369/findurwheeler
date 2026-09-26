import { Icon } from "./Icon";

export function SpecGroups({ groups }) {
  return (
    <div className="spec-grid">
      {groups.map((group) => (
        <section key={group.name} className="spec-card">
          <h3 className="spec-card__title">{group.name}</h3>
          <dl>
            {group.rows.map(([label, value]) => (
              <div key={label} className="spec-card__row">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

export function FeatureGroups({ groups }) {
  return (
    <div className="spec-grid">
      {groups.map((group) => (
        <section key={group.name} className="spec-card">
          <h3 className="spec-card__title">{group.name}</h3>
          <ul className="feature-list">
            {group.items.map((item) => (
              <li key={item}>
                <Icon name="check" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function FaqList({ faqs }) {
  return (
    <div className="faq">
      {faqs.map((faq) => (
        <details key={faq.question} className="faq__item">
          <summary>
            <span>{faq.question}</span>
            <Icon name="chevron" size={18} />
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
