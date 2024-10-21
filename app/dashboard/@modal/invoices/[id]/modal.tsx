"use client";

import { useRouter } from "next/router";

export default function InvoicePage() {
  const router = useRouter();

  const { id } = router.query;

  return (
    <div className="modal-overlay">
      <h2>Invoice Details (Modal View) - {id}</h2>
      <button onClick={() => router.back()}>Close</button>
    </div>
  );
}
