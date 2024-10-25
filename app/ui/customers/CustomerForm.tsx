// app/components/CustomerForm.tsx
"use server";

import { Customer } from "@/app/lib/definitions";
import { createCustomer, updateCustomer } from "@/app/lib/actions"; // Import your server actions
import { CustomerSubmitBtn } from "./buttons"; // Reusable submit button

interface CustomerFormProps {
  customer?: Customer; // Optional for Edit mode
  mode: "create" | "edit"; // Create or Edit mode
}

export default async function CustomerForm({
  customer,
  mode = "edit",
}: CustomerFormProps) {
  console.log("customer", customer);

  const handleUpdate = async (formData: FormData) => {
    "use server";
    if (customer?.id) {
      console.log("customer", customer);
      await updateCustomer(customer.id, formData);
    } else {
      throw new Error("Customer ID is missing");
    }
  };

  return (
    <form
      // Directly pass the server action function for form submission
      action={mode === "edit" ? handleUpdate : createCustomer}
      method="post"
      className="max-w-2xl mx-auto space-y-6 bg-white shadow p-6 rounded-md"
    >
      <h1 className="text-xl font-bold mb-4">
        {mode === "edit" ? "Edit Customer" : "Create New Customer"}
      </h1>

      {/* Display form fields */}
      <div className="space-y-4">
        {/* Name Field */}
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

        {/* Email Field */}
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

        {/* Image URL Field */}
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

      {/* Submit Button */}
      <div className="mt-6 flex justify-end space-x-3">
        <CustomerSubmitBtn
          isSubmitting={false} // Pass dynamic state when handling async form submission
          className="bg-blue-600 text-white"
          hoverClassName="hover:bg-blue-500"
        >
          {mode === "edit" ? "Update" : "Create"}
        </CustomerSubmitBtn>
      </div>
    </form>
  );
}
