'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { InvoicesTable, Invoice } from '@/app/lib/definitions';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }

}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),

    amount: z.coerce.number({
        invalid_type_error: 'Please enter a valid amount.',
    }).min(0.01, 'Amount must be greater than zero.'),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.',
    }),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};


export async function createInvoice(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    // Insert data into the database
    try {
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: `Database Error: Failed to Create Invoice. Details: ${error} `,
        };
    }

    // Revalidate the cache for the invoices page and redirect the user.
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;

    try {

        await sql`
    UPDATE invoices
    SET customer_id = ${customerId},
        amount = ${amountInCents},
        status = ${status}
    WHERE id = ${id}
`;

    } catch (error) {
        return { message: `Database Error: Failed to Update Invoice. Details: ${error} ` };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}


export async function fetchInvoices(): Promise<InvoicesTable[]> {
    try {
        const invoices = await sql<Invoice>`
        SELECT * FROM invoices ORDER BY date DESC;
        `;
        return invoices.rows;
    } catch (error) {
        throw new Error(`Database Error: Failed to Fetch Invoices. Details: ${error}`);
    }
}




export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        return { message: `Database Error: Failed to Delete Invoice. Details: ${error}` };
    }

}


const CreateCustomer = z.object({
    name: z.string().min(1, 'Please enter a customer name.'),
    email: z.string().email('Please enter a valid email address.'),
    image_url: z.string().url().optional(),
});


export async function createCustomer(prevState: State, formData: FormData) {
    //Validate form using Zod
    const validatedFields = CreateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    //if validation fails, return errors early
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Customer.',
        };
    }

    const { name, email, image_url } = validatedFields.data;


    //insert customer data into database
    try {
        await sql`
        INSERT INTO customers (name, email, image_url)
        VALUES (${name}, ${email}, ${image_url ?? null})
      `;
    } catch (error) {
        // If a database error occurs, return a more specific error.
        return {
            message: `Database Error: Failed to Create Customer. Details: ${error} `,
        };
    }

    //Revalidate cache for the customers page ( if needed ) and redirect
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');

}

const UpdateCustomer = z.object({
    id: z.string(),
    name: z.string().min(1, 'Please enter a customer name.'),
    email: z.string().email('Please enter a valid email address.'),
    image_url: z.string().url().optional(),
});

export async function updateCustomer(id: string, formData: FormData) {
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Customer.',
        };
    }

    const { name, email, image_url } = validatedFields.data;

    try {
        await sql`
    UPDATE customers
    SET name = ${name},
        email = ${email},
        image_url = ${image_url ?? null}
    WHERE id = ${id}
`;
    } catch (error) {
        return { message: `Database Error: Failed to Update Customer. Details: ${error}` };
    }

    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}


export async function deleteCustomer(id: string) {
    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        revalidatePath('/dashboard/customers');
    } catch (error) {
        return { message: `Database Error: Failed to Delete Customer. Details: ${error}` };
    }

}