import Link from "next/link";
import { Icon } from "./Icon";

export function TileLink({ href, icon, label, count }) {
  return (
    <Link href={href} className="tile">
      <span className="tile__icon">
        <Icon name={icon} size={22} />
      </span>
      <span className="tile__label">{label}</span>
      {typeof count === "number" ? (
        <span className="tile__count">
          {count} {count === 1 ? "car" : "cars"}
        </span>
      ) : null}
    </Link>
  );
}
