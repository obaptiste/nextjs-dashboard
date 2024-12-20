import Pagination from "@/app/ui/components/pagination";
import Table from "@/app/ui/customers/table";
import { CustomerTableSkeleton } from "@/app/ui/skeletons";
import { Suspense } from "react";
import { fetchCustomersPages } from "@/app/lib/data";
import Search from "@/app/ui/search";
import { lusitana } from "@/app/ui/fonts";
import { CreateCustomerButton } from "@/app/ui/customers/buttons";

export default async function CustomersPage(props: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const { searchParams } = props;
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCustomersPages(query);
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Customers</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomerButton />
      </div>
      <Suspense key={query + currentPage} fallback={<CustomerTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
