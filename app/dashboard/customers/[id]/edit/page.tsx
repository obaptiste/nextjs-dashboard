import { getCustomerById } from "@/app/lib/data"; // Directly fetch customer data from your database
import { Suspense } from "react";
import CustomerForm from "@/app/ui/customers/CustomerForm"; // Client component that will render the form

// Server Component for editing a customer
export default async function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const customer = await getCustomerById(params.id); // Fetch the customer data using the ID from the URL

  if (!customer) {
    return <p>Customer not found</p>;
  }

  return (
    <div>
      <h1>Edit Customer</h1>
      {/* Render the form inside a Suspense boundary for streaming */}
      <Suspense fallback={<p>Loading form...</p>}>
        <CustomerForm mode="edit" />
      </Suspense>
    </div>
  );
}
