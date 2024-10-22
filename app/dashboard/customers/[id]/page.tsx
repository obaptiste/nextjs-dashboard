import { UpdateCustomerButton } from "@/app/ui/customers/buttons";
import { getCustomerById, getInvoicesByCustomerId } from "@/app/lib/data"; // Import functions to fetch data
import Link from "next/link";
import { format } from "date-fns";

// Server Component to display customer details
export default async function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  // Fetch customer details by ID
  const customer = await getCustomerById(params.id); // Type allows for null
  const invoices = await getInvoicesByCustomerId(params.id);

  // Handle case where the customer is not found
  if (!customer) {
    return <p>Customer not found</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>{customer.name}</h1>
        {/* Button to update customer */}
        <UpdateCustomerButton id={customer.id} />
      </div>

      {/* Customer profile section */}
      <section>
        <h2>Profile</h2>
        <p>Name: {customer.name}</p>
        <p>Email: {customer.email}</p>
        <p>Image URL: {customer.image_url}</p>
      </section>

      {/* Render invoices */}
      <section>
        <h2>Invoices</h2>
        {invoices.length > 0 ? (
          <ul>
            {invoices.map((invoice) => (
              <li key={invoice.id}>
                {format(new Date(invoice.date), "MM/dd/yyyy")} -{" "}
                {invoice.amount} - {invoice.status}
              </li>
            ))}
          </ul>
        ) : (
          <p>No invoices found for this customer.</p>
        )}
      </section>

      <Link href="/dashboard/customers">← Back to Customers</Link>
    </div>
  );
}
