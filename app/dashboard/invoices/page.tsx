import Pagination from "@/app/ui/components/pagination";
import Search from "@/app/ui/search";
import InvoicesTable from "@/app/ui/invoices/table";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { lusitana } from "@/app/ui/fonts";
import { InvoicesTableSkeleton } from "@/app/ui/skeletons";

import { Suspense } from "react";
import {
  fetchInvoicesPage,
  fetchInvoicesCount,
  ITEMS_PER_PAGE,
} from "@/app/lib/data";
import { InvoicesPageProps } from "../customers/PageProps";

export default async function InvoicesPage({
  searchParams = {},
}: {
  searchParams?: InvoicesPageProps["searchParams"];
}) {
  const query = (await searchParams?.query) ?? "";
  const currentPage = Number(searchParams?.page) ?? 1;

  const totalCount = await fetchInvoicesCount(query);
  const invoices = await fetchInvoicesPage(query, currentPage);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <InvoicesTable invoices={invoices} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
}
