"use client";

import React, { ReactNode } from "react";
import Link from "next/link";

interface GenericButtonProps {
  href?: string; // Optional href for links
  onClick?: () => void; // Optional click handler
  icon?: ReactNode; // Icon element
  className?: string; // Custom class for styling
  hoverClassName?: string; // Custom hover class for styling
  type?: "button" | "submit"; // Button type for form submission
  children?: ReactNode; // Any additional children inside the button
  disabled?: boolean;
}

const GenericButton: React.FC<GenericButtonProps> = ({
  href,
  onClick,
  icon,
  className,
  hoverClassName,
  disabled,
  type = "button",
  children,
}) => {
  const buttonClasses = `${className} ${hoverClassName} flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium rounded-md focus:outline-none`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {icon}
      {children}
    </button>
  );
};

export default GenericButton;
