// lib/api.ts

import { Customer } from "./definitions";

export const getCustomerById = async (id: string) => {
    // Fetch customer data from your database or external API
    const response = await fetch(`/api/customers/${id}`, {
        method: 'GET',
    });

    if (!response.ok) {
        throw new Error('Failed to fetch customer');
    }

    return response.json();
};

export const updateCustomer = async (id: string, customerData: Customer) => {
    // Update customer data in your database or external API
    const response = await fetch(`/api/customers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });

    if (!response.ok) {
        throw new Error('Failed to update customer');
    }

    return response.json();
};