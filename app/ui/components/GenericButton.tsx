"use client";

import React, { ElementType, ReactNode } from "react";
import Link from "next/link";

interface GenericButtonProps<C extends ElementType = "button"> {
  as?: C; // Specify the component type, default to "button"
  href?: string; // Optional href for links
  onClick?: () => void; // Optional click handler
  icon?: ReactNode; // Icon element
  className?: string; // Custom class for styling
  hoverClassName?: string; // Custom hover class for styling
  type?: "button" | "submit"; // Button type for form submission
  children?: ReactNode; // Any additional children inside the button
  disabled?: boolean;
}

// Use `GenericButton` component with generics
const GenericButton = <C extends ElementType = "button">({
  as,
  href,
  onClick,
  icon,
  className,
  hoverClassName,
  disabled,
  type = "button",
  children,
}: GenericButtonProps<C>) => {
  const Component = as || (href ? Link : "button"); // Determine the component type

  const buttonClasses = `${className} ${hoverClassName} flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md focus:outline-none`;

  if (Component === Link && href) {
    return (
      <Link href={href} className={buttonClasses}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <Component
      {...(Component === "button" ? { type } : {})}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {icon}
      {children}
    </Component>
  );
};

export default GenericButton;
