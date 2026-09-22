const STATUS_LABELS = {
  PENDING: "En attente",
  ACCEPTED: "Accepté",
  DECLINED: "Refusé",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
};

const STATUS_STYLES = {
  PENDING: "bg-amber-100 text-amber-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  DECLINED: "bg-red-100 text-red-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
