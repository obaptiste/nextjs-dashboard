import { Suspense } from "react";
import CustomerForm from "@/app/ui/customers/CustomerForm"; // Client-side form for customer creation
import Breadcrumbs from "@/app/ui/components/breadcrumbs";

export default function CreateCustomerPage() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Create Customer",
            href: "/dashboard/customers/create",
            active: true,
          },
        ]}
      />
      <Suspense fallback={<p>Loading form...</p>}>
        <CustomerForm mode="create" />
      </Suspense>
    </main>
  );
}
