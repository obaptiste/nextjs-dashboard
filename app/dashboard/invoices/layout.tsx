"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import GenericModal from "@/app/ui/components/GenericModal";
import OpenModalButton from "@/app/ui/invoices/OpenModalButton";
import InvoiceDetails from "@/app/ui/invoices/InvoiceDetails";
import { Invoice } from "@/app/lib/definitions";
import { fetchInvoicesPage } from "@/app/lib/data";

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get("invoiceId");

  // Add console logs for debugging purposes
  console.log("Invoices State:", invoices);
  console.log("Current Invoice ID:", currentInvoice);

  // Fetch invoices once component mounts
  useEffect(() => {
    async function fetchInvoices() {
      try {
        const fetchedInvoices = await fetchInvoicesPage("", 1); // Fetch first page for example
        setInvoices(fetchedInvoices); // Store fetched invoices in state
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    }

    fetchInvoices();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // If invoiceId exists in URL, open the modal for that invoice
  useEffect(() => {
    if (invoiceId && invoices.length > 0) {
      const selectedInvoice = invoices.find(
        (invoice) => invoice.id === invoiceId
      );
      if (selectedInvoice) {
        setCurrentInvoice(selectedInvoice);
        setIsModalOpen(true);
      }
    }
  }, [invoiceId, invoices]);

  // Handle opening modal when invoice ID is passed
  const handleOpenModal = (id: string) => {
    const selectedInvoice = invoices.find((invoice) => invoice.id === id); // Find invoice by ID
    if (selectedInvoice) {
      setCurrentInvoice(selectedInvoice); // Set the current invoice in state
      router.replace(`/dashboard/invoices?invoiceId=${id}`); // Update URL without reloading
      setIsModalOpen(true);
    } else {
      console.warn("Invoice not found:", id); // Add warning if invoice is not found
    }
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
    setCurrentInvoice(null); // Reset the current invoice
    router.replace(`/dashboard/invoices`); // Reset the URL
  };

  return (
    <div>
      {/* Render OpenModalButton and pass the handler */}
      <OpenModalButton onClick={() => handleOpenModal("123")} />

      {/* Render children component */}
      <div>{children}</div>

      {/* Render modal if open with dynamic invoice details */}
      {isModalOpen && currentInvoice && (
        <GenericModal isOpen={isModalOpen} onClose={handleCloseModal}>
          <InvoiceDetails invoice={currentInvoice} />{" "}
          {/* Ensure invoice details are passed */}
        </GenericModal>
      )}
    </div>
  );
}
