"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CustomerForm from "@/app/ui/customers/CustomerForm"; // Client component that will render the form
import { Customer } from "@/app/lib/definitions";
import styles from "@/app/dashboard/customers/modal.module.css";

// Server Component for editing a customer
export default function EditCustomerPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/customers/${params.id}`);
        if (!response.ok)
          throw new Error(
            `Failed to fetch customer data, status: ${response.status}`
          );

        const fetchedCustomer = await response.json();

        setCustomer(fetchedCustomer);
      } catch (error) {
        setError(`Failed to fetch customer data, error: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

  return (
    <div className={styles.modal}>
      <div className={styles.modal_content}>
        <h1>Edit Customer</h1>
        <button onClick={handleClose} className={styles.close_button}>
          Close
        </button>
        {loading && <p>Loading customer data...</p>}
        {error && <p className="error">{error}</p>}
        {customer && <CustomerForm mode="edit" customer={customer} />}
      </div>
    </div>
  );
}
