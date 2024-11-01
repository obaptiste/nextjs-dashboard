import { UpdateCustomerButton } from "@/app/ui/customers/buttons";
import { getCustomerById, getInvoicesByCustomerId } from "@/app/lib/data";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image"; // Import Next.js Image component
import styles from "@/app/dashboard/customers/customers.module.css"; // Import CSS module

// Server Component to display customer details
export default async function CustomerDetailsPage(props: {
  params: { id: string };
}) {
  // Fetch customer details by ID
  const { params } = props;
  const { id } = params;

  const customer = await getCustomerById(id); // Type allows for null
  const invoices = await getInvoicesByCustomerId(id);

  // Handle case where the customer is not found
  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-md rounded-md">
        <p className="text-red-600 text-center">Customer not found</p>
        <Link
          href="/dashboard/customers"
          className="text-blue-600 hover:underline"
        >
          ← Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white shadow-md rounded-md">
      {/* Header section with customer's name and update button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{customer.name}</h1>
        <UpdateCustomerButton id={customer.id} />
      </div>

      {/* Profile section with picture on the right */}
      <section className={styles.customerProfileContainer}>
        <div className={styles.profileDetails}>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile</h2>
          <p>
            <span className="font-medium text-gray-800">Name:</span>{" "}
            {customer.name}
          </p>
          <p>
            <span className="font-medium text-gray-800">Email:</span>{" "}
            {customer.email}
          </p>
        </div>

        {/* Profile picture with shimmer hover effect using Next/Image */}
        <div className={styles.profilePicture}>
          <Image
            src={customer.image_url} // Image URL
            alt={`${customer.name}'s profile picture`} // Alt text for accessibility
            width={150} // Set an appropriate width
            height={150} // Set an appropriate height
            className={styles.shimmer} // Add shimmer effect
            objectFit="cover" // Ensure the image covers the area without distortion
            placeholder="blur" // Optionally use a blur-up placeholder
            blurDataURL="/placeholder.webp" // A low-quality image for the blur placeholder (optional)
          />
        </div>
      </section>

      {/* Invoices section */}
      <section className={styles.invoicesContainer}>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Invoices</h2>
        {invoices.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <li key={invoice.id} className={styles.invoiceListItem}>
                <span className="text-gray-600">
                  {format(new Date(invoice.date), "MM/dd/yyyy")}
                </span>
                <span className="text-gray-800 font-medium">
                  £{invoice.amount / 100}
                </span>
                <span
                  className={
                    invoice.status === "paid"
                      ? "text-green-600 font-semibold"
                      : "text-yellow-600 font-semibold"
                  }
                >
                  {invoice.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No invoices found for this customer.</p>
        )}
      </section>

      {/* Back to customers link */}
      <div className="mt-6">
        <Link
          href="/dashboard/customers"
          className="text-blue-600 hover:underline"
        >
          ← Back to Customers
        </Link>
      </div>
    </div>
  );
}
