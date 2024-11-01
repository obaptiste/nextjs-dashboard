import { Customer } from "@/app/lib/definitions";
import CustomerFormClient from "./CustomerFormClient";

interface CustomerFormProps {
  customer?: Customer;
  mode: "create" | "edit";
}

export default async function CustomerForm({
  customer,
  mode = "edit",
}: CustomerFormProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 bg-white shadow p-6 rounded-md">
      <h1 className="text-xl font-bold mb-4">
        {mode === "edit" ? "Edit Customer" : "Create New Customer"}
      </h1>

      <CustomerFormClient customer={customer} mode={mode} />
    </div>
  );
}
