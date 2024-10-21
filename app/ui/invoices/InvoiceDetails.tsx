import React from "react";
import { Invoice } from "@/app/lib/definitions"; // Import your Invoice type for TypeScript checks
import { updateInvoice, deleteInvoice } from "@/app/lib/actions";

export default function InvoiceDetails({ invoice }: { invoice: Invoice }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium">Customer Name:</span>
          <span>{invoice.name}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Email:</span>
          <span>{invoice.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Amount:</span>
          <span>£{invoice.amount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Status:</span>
          <span>{invoice.status === "paid" ? "Paid" : "Pending"}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium">Date:</span>
          <span>{new Date(invoice.date).toLocaleDateString("en-GB")}</span>
        </div>
      </div>
      <div className="mt-4">
        <updateInvoice id={invoice.id} />
        <deleteInvoice id={invoice.id} />
      </div>
      {/* You could add actions or buttons for updating or deleting the invoice here */}
    </div>
  );
}
