import GenericButton from "../components/GenericButton";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteCustomer } from "@/app/lib/actions";

export function CreateCustomerButton() {
  return (
    <GenericButton
      href="/dashboard/customers/create"
      icon={<PlusIcon className="w-5" />}
      className="bg-green-600 text-white focus-visible:outline-green-600"
      hoverClassName="hover:bg-green-500"
    >
      <span className="hidden md:block">Create Customer</span>
    </GenericButton>
  );
}

export function UpdateCustomerButton({ id }: { id: string }) {
  return (
    <GenericButton
      href={`/dashboard/customers/${id}/edit`}
      icon={<PencilIcon className="w-5" />}
      className="border border-gray-300"
      hoverClassName="hover:bg-gray-100"
    />
  );
}

export function DeleteCustomerButton({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id);
  return (
    <form action={deleteCustomerWithId}>
      <GenericButton
        icon={<TrashIcon className="w-5" />}
        className="border border-gray-300"
        hoverClassName="hover:bg-gray-100"
        type="submit"
      >
        <span className="sr-only">Delete</span>
      </GenericButton>
    </form>
  );
}
