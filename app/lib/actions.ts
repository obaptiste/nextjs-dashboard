'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { Customer } from './definitions';

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

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        return { message: `Database Error: Failed to Delete Invoice. Details: ${error}` };
    }

}


// Define the Zod schema for customer creation
const CreateCustomerSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    image_url: z.string().url().optional(),
});

// Server Action for creating a new customer
export async function createCustomer(formData: FormData) {
    const validatedData = CreateCustomerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        image_url: formData.get("image_url"),
    });

    if (!validatedData.success) {
        return { errors: validatedData.error.flatten().fieldErrors };
    }

    const { name, email, image_url } = validatedData.data;

    try {
        await sql`INSERT INTO customers (name, email, image_url) VALUES (${name}, ${email}, ${image_url ?? null})`;
        revalidatePath("/dashboard/customers");
        redirect("/dashboard/customers");
    } catch (error) {
        console.error("Database Error:", error);
        return { errors: { message: "Failed to create customer due to a database error." } };
    }
}

const UpdateCustomer = z.object({
    id: z.string(),
    name: z.string().min(1, 'Please enter a customer name.'),
    email: z.string().email('Please enter a valid email address.'),
    image_url: z.string().url().optional(),
});

export async function updateCustomer(id: string, formData: FormData) {
    // Validate the form data using zod
    const validatedFields = UpdateCustomer.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        image_url: formData.get('image_url'),
    });

    // If validation fails, return the errors
    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Customer.',
        };
    }

    const { name, email, image_url } = validatedFields.data;

    try {
        // Perform the database update
        await sql<Customer>`
        UPDATE customers
        SET name = ${name},
            email = ${email},
            image_url = ${image_url ?? null}
        WHERE id = ${id}
        `;
    } catch (error) {
        // Log the error and return a more specific message
        console.error('Database Error:', error);
        return { message: `Database Error: Failed to Update Customer. Details: ${error}` };
    }

    // Revalidate the customers path to show the updated data
    revalidatePath('/dashboard/customers');

    // Redirect back to the customer list after a successful update
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
