// app/api/customers/[id]/route.ts
import { NextResponse } from "next/server";
import { getCustomerById } from "@/app/lib/data";
import { Customer } from "@/app/lib/definitions";

export async function GET(request: Customer, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const customer = await getCustomerById(id);
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }
        return NextResponse.json(customer);
    } catch (error) {
        return NextResponse.json({ error: `Failed to fetch customer data, error: ${error}` }, { status: 500 });
    }
}