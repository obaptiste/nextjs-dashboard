"use client";

import React from "react";
import GenericButton from "../components/GenericButton";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteCustomer } from "@/app/lib/actions";
import clsx from "clsx";

export function CreateCustomerButton() {
  return (
    <GenericButton
      href="/dashboard/customers/create"
      icon={<PlusIcon className="w-5" />}
      className="bg-green-600 text-white focus-visible:outline-green-600"
      hoverClassName="hover:bg-green-500"
    >
      <span className="hidden md:block">Create Customer</span>
    </GenericButton>
  );
}

export function UpdateCustomerButton({ id }: { id: string }) {
  return (
    <GenericButton
      href={`/dashboard/customers/${id}/edit`}
      icon={<PencilIcon className="w-5" />}
      className="border border-gray-300"
      hoverClassName="hover:bg-gray-100"
    />
  );
}

interface CustomerSubmitBtnProps {
  isSubmitting: boolean;
  className?: string;
  hoverClassName?: string;
  type?: "button" | "submit";
  children?: React.ReactNode;
}

export const CustomerSubmitBtn: React.FC<CustomerSubmitBtnProps> = ({
  isSubmitting,
  className = "bg-blue-600 text-white",
  hoverClassName = "hover:bg-blue-500 hover:shadow-lg",
  children,
  type = "submit", // type="submit", Defaulted to submit as it's a form button
}) => {
  return (
    <GenericButton
      type={type}
      disabled={isSubmitting} // Disable the button while submitting
      className={clsx(
        "relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-md shadow transition-all duration-300 ease-in-out transform",
        className,
        hoverClassName,
        {
          "opacity-50 cursor-not-allowed": isSubmitting,
        }
      )}
    >
      {isSubmitting ? (
        <span className="animate-pulse">Submitting</span>
      ) : (
        children
      )}
    </GenericButton>
  );
};

export function DeleteCustomerButton({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id);
  return (
    <form action={deleteCustomerWithId}>
      <GenericButton
        icon={<TrashIcon className="w-5" />}
        className="border border-gray-300"
        hoverClassName="hover:bg-gray-100"
        type="submit"
      >
        <span className="sr-only">Delete</span>
      </GenericButton>
    </form>
  );
}
