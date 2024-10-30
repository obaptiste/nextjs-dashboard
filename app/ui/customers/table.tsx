import { Suspense } from "react";
import { CustomerTableSkeleton } from "@/app/ui/skeletons"; // Your skeleton loader component
import Image from "next/legacy/image";
import { fetchFilteredCustomers } from "@/app/lib/data";
import Link from "next/link"; // Import the Next.js Link component
export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  console.log(query, currentPage);
  const customers = await fetchFilteredCustomers(query, currentPage);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="min-w-full rounded-md text-gray-900">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Invoices
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Total Pending
                    </th>
                    <th scope="col" className="px-4 py-5 font-medium">
                      Total Paid
                    </th>
                  </tr>
                </thead>
                {/* Wrap the table body in Suspense */}
                <Suspense fallback={<CustomerTableSkeleton />}>
                  <tbody className="divide-y divide-gray-200 text-gray-900">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-gray-500">
                          No customers found.
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer.id} className="group">
                          <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black sm:pl-6">
                            <div className="flex items-center gap-3">
                              <Image
                                src={customer.image_url}
                                className="rounded-full"
                                alt={`${customer.name}'s profile picture`}
                                width={28}
                                height={28}
                              />
                              {/* Wrap the customer name with a Next.js Link */}
                              <Link
                                href={`/dashboard/customers/${customer.id}`}
                                className="text-blue-600 hover:underline"
                              >
                                {customer.name}
                              </Link>
                            </div>
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.email}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.total_invoices}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.total_pending}
                          </td>
                          <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                            {customer.total_paid}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Suspense>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
