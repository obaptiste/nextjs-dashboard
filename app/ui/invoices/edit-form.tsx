"use client";

import { CustomerField, InvoiceForm } from "@/app/lib/definitions";
import {
  CheckIcon,
  ClockIcon,
  CurrencyPoundIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Button } from "@/app/ui/button";
import { updateInvoice } from "@/app/lib/actions";

export default function EditInvoiceForm({
  invoice,
  customers,
}: {
  invoice: InvoiceForm;
  customers: CustomerField[];
}) {
  const updateInvoiceWithId = updateInvoice.bind(null, invoice.id);

  return (
    <form action={updateInvoiceWithId}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6 transition-all duration-300 ease-in-out hover:shadow-lg">
        {/* Customer Name */}
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose customer
          </label>
          <div className="relative">
            <select
              required
              id="customer"
              name="customerId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 transition duration-200 ease-in-out focus:border-blue-400 focus:ring-blue-400"
              defaultValue={invoice.customer_id}
            >
              <option value="" disabled>
                Select a customer
              </option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 transition duration-200 ease-in-out peer-focus:text-blue-400" />
          </div>
        </div>

        {/* Invoice Amount */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Enter amount (GBP)
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                defaultValue={invoice.amount}
                placeholder="Enter GBP amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 transition duration-200 ease-in-out focus:border-blue-400 focus:ring-blue-400"
                required
                aria-describedby="amount-error"
              />
              <CurrencyPoundIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 transition duration-200 ease-in-out peer-focus:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Invoice Status */}
        <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Set the invoice status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3 transition-all duration-300 ease-in-out hover:shadow-sm">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="pending"
                  name="status"
                  type="radio"
                  value="pending"
                  defaultChecked={invoice.status === "pending"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 transition-all duration-200 ease-in-out checked:bg-yellow-400"
                  required
                  aria-describedby="pending-error"
                />
                <label
                  htmlFor="pending"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-yellow-400 hover:text-white"
                >
                  Pending <ClockIcon className="h-4 w-4" />
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paid"
                  name="status"
                  type="radio"
                  value="paid"
                  defaultChecked={invoice.status === "paid"}
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2 transition-all duration-200 ease-in-out checked:bg-green-400"
                  required
                  aria-describedby="paid-error"
                />
                <label
                  htmlFor="paid"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white transition-all duration-200 ease-in-out hover:bg-green-600"
                >
                  Paid <CheckIcon className="h-4 w-4" />
                </label>
              </div>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          className="bg-blue-600 text-white rounded-md px-6 py-2 transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105 hover:shadow-lg"
        >
          Edit Invoice
        </Button>
      </div>
    </form>
  );
}
