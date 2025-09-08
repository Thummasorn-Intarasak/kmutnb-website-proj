import { DailyDealCardProps } from "../types";

export default function DailyDealCard({
  id,
  title,
  image,
  reviews,
  orders,
  price,
}: DailyDealCardProps) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <img
        src={image}
        alt={title}
        className="w-12 h-16 object-cover object-center rounded shadow-sm"
      />
      <div className="flex-1">
        <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
        <p className="text-xs text-gray-600">
          {reviews} • {orders}
        </p>
        <p className="text-sm font-bold text-gray-800">{price}</p>
      </div>
    </div>
  );
}
