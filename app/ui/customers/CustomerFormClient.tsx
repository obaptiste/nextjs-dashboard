"use client";

import { useState } from "react";
import { Customer } from "@/app/lib/definitions";
import { createCustomer, updateCustomer } from "@/app/lib/actions";
import { CustomerSubmitBtn } from "./buttons";

interface CustomerFormClientProps {
  customer?: Customer;
  mode: "create" | "edit";
}

export default function CustomerFormClient({
  customer,
  mode,
}: CustomerFormClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSuccessMessage("");
    setErrorMessage("");

    const emailInput = form.email;
    if (!emailInput.value.includes("@")) {
      emailInput.setCustomValidity("Yo, we need your email address innit?");
      emailInput.reportValidity();
      return;
    } else {
      emailInput.checkValidity();
      emailInput.setCustomValidity("wtf");
    }

    const formData = new FormData(form);
    try {
      if (mode === "create") {
        const result = await createCustomer(formData);
        if (result.errors) {
          setErrorMessage(
            "Failed to create customer. Please check your inputs."
          );
        } else {
          setSuccessMessage("Customer created successfully!");
        }
      } else {
        if (customer?.id) {
          const result = await updateCustomer(customer.id, formData);
          if (result.errors) {
            setErrorMessage(
              "Failed to update customer. Please check your inputs."
            );
          } else {
            setSuccessMessage("Customer updated successfully!");
          }
        }
      }
    } catch (error) {
      setErrorMessage(
        `An unexpected error occurred. Please try again. Error:${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-6 bg-white shadow p-6 rounded-md"
    >
      <h1 className="text-xl font-bold mb-4">
        {mode === "edit" ? "Edit Customer" : "Create New Customer"}
      </h1>

      {successMessage && (
        <div className="bg-green-100 text-green-800 border border-green-200 p-2 rounded">
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 text-red-800 border border-red-200 p-2 rounded">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={customer?.name || ""}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            defaultValue={customer?.email ?? ""}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            defaultValue={customer?.image_url ?? ""}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <CustomerSubmitBtn
          isSubmitting={isSubmitting}
          className="bg-blue-600 text-white"
          hoverClassName=""
        >
          {mode === "edit" ? "Update" : "Create"}
        </CustomerSubmitBtn>
      </div>
    </form>
  );
}
