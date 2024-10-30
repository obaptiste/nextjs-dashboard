// app/dashboard/customers/layout.tsx
import { Suspense } from "react";

export default function CustomersLayout({
  children, // This will render the main content
  modal, // This will render the modal content when intercepted
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <Suspense fallback={null}>
        {modal} {/* Render modal here when modal route is intercepted */}
      </Suspense>
    </div>
  );
}
