export interface SearchParams {
  query?: string;
  page?: string;
}

export type PageProps = {
  searchParams: SearchParams;
};
export interface TableProps {
  query: string;
  currentPage: number;
}
export interface InvoicesPageProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}
