import { sql } from '@vercel/postgres';
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  Invoice,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import cache from "./cache";


export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

export const ITEMS_PER_PAGE = 6;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {

  const cacheKey = `invoices:${query}:${currentPage}`;

  // Check if data is in cache
  const cachedInvoices = cache.get<InvoicesTable[]>(cacheKey);
  if (cachedInvoices) {
    return cachedInvoices;
  }
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    cache.set(cacheKey, invoices.rows);

    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}


export async function fetchInvoicesPage(query: string, currentPage: number): Promise<Invoice[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const { rows } = await sql<Invoice>`
  SEELCT *
  FROM invoices
  WHERE customers.name ILIKE ${`%${query}%`} OR invoices.status ILIKE ${`%${query}%`}
  ORDER BY ${ITEMS_PER_PAGE} OFFSET ${offset};
  `;
  return rows;
}

export async function fetchInvoicesCount(query: string): Promise<number> {
  const { rows } = await sql`
  SELECT COUNT(*)
  FROM invoices
  WHERE customers.name ILIKE ${`%${query}%`} OR invoices.status ILIKE ${`%${query}%`}
  `;
  return Number(rows[0].count);
}


export async function fetchInvoiceById(id: string) {
  const cacheKey = `invoice: ${id}`;

  const cachedInvoice = cache.get<InvoiceForm>(cacheKey);

  if (cachedInvoice) {
    return cachedInvoice;
  }


  try {
    const data = await sql<InvoiceForm>`
    SELECT
    invoices.id,
      invoices.customer_id,
      invoices.amount,
      invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    if (!data.rows.length) {
      return null;
    }
    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));
    cache.set(cacheKey, invoice);

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchDetailedInvoice(id: string): Promise<Invoice | null> {
  const cacheKey = `invoice:${id} `;

  // Attempt to retrieve from cache
  const cachedInvoice = cache.get<Invoice>(cacheKey);
  if (cachedInvoice) {
    return cachedInvoice;
  }

  try {
    const data = await sql<InvoicesTable>`
    SELECT
    invoices.id,
      invoices.customer_id,
      invoices.amount,
      invoices.date,
      invoices.status,
      customers.name, customers.email, customers.image_url FROM invoices JOIN customers ON invoices.customer_id = customers.id WHERE invoices.id = ${id}
    `;

    // Check if an invoice was returned
    if (data.rows.length === 0) {
      return Promise.resolve(null); // Fix 1: Properly wrap `null` in a Promise
    }

    const invoice: Invoice = {
      id: data.rows[0].id,
      customer_id: data.rows[0].customer_id,
      amount: data.rows[0].amount,
      date: data.rows[0].date,
      status: data.rows[0].status as 'pending' | 'paid',
      name: data.rows[0].name,
      email: data.rows[0].email,
      image_url: data.rows[0].image_url,
    };

    // Cache the result for future use
    cache.set(cacheKey, invoice);

    console.log(invoice)

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}


export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
    SELECT
    id,
      name
      FROM customers
      ORDER BY name ASC
      `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const data = await sql<CustomersTableType>`
    SELECT
    customers.id,
      customers.name,
      customers.email,
      customers.image_url,
      COUNT(invoices.id) AS total_invoices,
        SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
          SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
    WHERE
    customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    //Query to get the total number of customers that match the search query
    const count = await sql`
      SELECT COUNT(*)
      FROM customers
    WHERE
    customers.name ILIKE ${`%${query}%`} OR
    customers.email ILIKE ${`%${query}%`}
    `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }

}