import { getCustomerById } from "@/app/lib/data";
import CustomerForm from "@/app/ui/customers/CustomerForm";
import { Suspense } from "react";

// Use the exact Next.js App Router page props type
export default async function Page(props: { params: { id: string } }) {
  const { params } = props;
  const { id } = params;

  const customer = await getCustomerById(id); // Fetch the customer data using the ID from the URL

  if (!customer) {
    return (
      <div className="p-4">
        <p>Customer not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Customer</h1>
      {/* Render the form inside a Suspense boundary for streaming */}
      <Suspense fallback={<p>Loading form...</p>}>
        <CustomerForm mode="edit" customer={customer} />
      </Suspense>
    </div>
  );
}
