import { clsx } from "clsx";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: Breadcrumb[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol
        className={clsx(
          lusitana.className,
          "flex items-center text-xl md:text-2xl"
        )}
      >
        {breadcrumbs.map((breadcrumb, index) => (
          <li
            key={breadcrumb.href}
            className={clsx(
              "flex items-center",
              breadcrumb.active
                ? "text-gray-900 font-semibold"
                : "text-gray-500"
            )}
            aria-current={breadcrumb.active ? "page" : undefined}
          >
            {breadcrumb.active ? (
              <span>{breadcrumb.label}</span>
            ) : (
              <Link href={breadcrumb.href} className="hover:text-blue-600">
                {breadcrumb.label}
              </Link>
            )}
            {/* Divider */}
            {index < breadcrumbs.length - 1 && (
              <span className="mx-3 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
