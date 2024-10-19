import { ReactNode } from "react";
import Link from "next/link";

type GenericButtonProps = {
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  formId?: string;
  type?: "submit" | "button";
  hoverClassName?: string;
};

export default function GenericButton({
  href,
  onClick,
  icon,
  children,
  className,
  formId,
  type = "button",
  hoverClassName,
}: GenericButtonProps) {
  const baseClasses =
    "flex items-center rounded-md p-2 transition-colors focus-visible:outline focus-visible:outline-2";
  const combinedHoverClasses =
    hoverClassName || "hover:bg-gray-100 hover:text-blue-500";
  const combinedClasses = `${baseClasses} ${combinedHoverClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      form={formId}
      onClick={onClick}
      className={combinedClasses}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
