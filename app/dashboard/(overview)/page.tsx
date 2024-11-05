import LatestInvoices from "../../ui/dashboard/latest-invoices";
import { lusitana } from "../../ui/fonts";
import { Suspense } from "react";
import CardWrapper from "@/app/ui/dashboard/cards";
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardSkeleton,
} from "@/app/ui/skeletons";
import CustomerContributionsChart from "@/app/ui/components/chart";

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        <div className="w-full p-4 bg-white shadow rounded-md">
          <Suspense fallback={<RevenueChartSkeleton />}>
            <CustomerContributionsChart />
          </Suspense>
        </div>

        <div className="w-full p-4 bg-white shadow rounded-md">
          <Suspense fallback={<LatestInvoicesSkeleton />}>
            <LatestInvoices />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
