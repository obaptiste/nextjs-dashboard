import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GenericModal from "@/app/ui/components/GenericModal"; // Your shared modal component
import { fetchDetailedInvoice } from "@/app/lib/data"; // Function to fetch the invoice details from your backend
import InvoiceDetails from "@/app/ui/invoices/InvoiceDetails"; // A component that shows the details of an invoice
import { Invoice } from "@/app/lib/definitions";

export default function InvoiceModal() {
  const router = useRouter();
  const { id } = router.query; // Get the dynamic ID from the router

  const [invoice, setInvoice] = useState<Invoice | null>(null); // Define the invoice state
  const [loading, setLoading] = useState(true); // Set loading state

  useEffect(() => {
    if (id) {
      // Fetch the invoice details if an ID is provided
      fetchDetailedInvoice(id as string)
        .then((data) => {
          setInvoice(data); // Update the state with fetched data
          setLoading(false); // Stop loading when data is fetched
        })
        .catch((error) => {
          console.error("Failed to fetch invoice details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleCloseModal = () => {
    // Handle closing the modal and returning to the previous page
    router.back();
  };

  return (
    <GenericModal isOpen={!!id} onClose={handleCloseModal}>
      {/* If the data is still loading, display a loading message */}
      {loading ? (
        <p>Loading invoice details...</p>
      ) : invoice ? (
        // Pass the invoice details to the InvoiceDetails component
        <InvoiceDetails invoice={invoice} />
      ) : (
        <p>No invoice found.</p>
      )}
    </GenericModal>
  );
}
