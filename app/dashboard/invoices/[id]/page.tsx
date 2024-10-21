import { useRouter } from "next/router";

export default function InvoicePage() {
  const router = useRouter();
  const { id } = router.query;

  //fetch and display invoice
  return (
    <div>
      <h1>Invoice Details - {id}</h1>
      {/* Other invoice content */}
    </div>
  );
}
