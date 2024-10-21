import GenericButton from "@/app/ui/components/GenericButton";

interface OpenModalButtonProps {
  onClick: () => void;
}

export default function OpenModalButton({ onClick }: OpenModalButtonProps) {
  return (
    <GenericButton
      onClick={onClick}
      className="bg-blue-600 text-white hover:bg-blue-500"
    >
      Open Invoice Modal
    </GenericButton>
  );
}
