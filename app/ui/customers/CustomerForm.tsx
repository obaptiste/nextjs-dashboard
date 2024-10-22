"use client"; // Client-side component

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCustomer, updateCustomer } from "@/app/lib/actions"; // Import both actions
import { Customer } from "@/app/lib/definitions"; // Assuming you have a Customer type

// Props for the form to handle both Create and Edit modes
interface CustomerFormProps {
  customer?: Customer; // Optional, used only in Edit mode
  mode: "create" | "edit"; // To differentiate between modes
}

function CustomerForm({ customer, mode }: CustomerFormProps) {
  const router = useRouter(); // For redirecting after form submission
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(event.currentTarget);

    try {
      let result;
      if (mode === "create") {
        // Create a new customer
        result = await createCustomer(formData);
      } else if (customer) {
        // Update an existing customer
        result = await updateCustomer(customer.id, formData);
      }

      if (result && result.errors) {
        setError("Failed to submit the form. Please fix the errors.");
      } else {
        // Redirect to customers list after successful submission
        router.push("/dashboard/customers");
      }
    } catch (err) {
      setError(`An error occurred while updating the customer. Error: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={customer?.name ?? ""} // Pre-fill for edit, empty for create
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          defaultValue={customer?.email ?? ""} // Pre-fill for edit, empty for create
          required
        />
      </div>
      <div>
        <label htmlFor="image_url">Image URL (optional):</label>
        <input
          type="url"
          id="image_url"
          name="image_url"
          defaultValue={customer?.image_url ?? ""} // Pre-fill for edit, empty for create
        />
      </div>
      <button type="submit">
        {mode === "create" ? "Create Customer" : "Save Changes"}
      </button>
    </form>
  );
}

export default CustomerForm;
