import { Suspense } from "react";
import CustomerForm from "@/app/ui/customers/CustomerForm"; // Client-side form for customer creation

export default function CreateCustomerPage() {
  return (
    <div>
      <h1>Create a New Customer</h1>
      <Suspense fallback={<p>Loading form...</p>}>
        <CustomerForm mode="create" /> {/* Pass 'create' as the mode */}
      </Suspense>
    </div>
  );
}
