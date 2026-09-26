import Link from "next/link";
import { Icon } from "./Icon";

export function SectionHeader({ id, title, text, href, linkLabel, as: Heading = "h2", light = false }) {
  return (
    <div className={`section-header section-header--row${light ? " section-header--light" : ""}`}>
      <div>
        <Heading id={id} className="section-header__title">
          {title}
        </Heading>
        {text ? <p className="section-header__text">{text}</p> : null}
      </div>
      {href ? (
        <Link href={href} className="text-link">
          {linkLabel} <Icon name="arrow" size={16} />
        </Link>
      ) : null}
    </div>
  );
}
