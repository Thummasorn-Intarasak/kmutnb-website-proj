import { FaPlus } from "react-icons/fa";
import { DealCardProps } from "../types";
import Dropdown from "./Dropdown";

export default function DealCard({
  id,
  title,
  image,
  platform,
  discount,
  originalPrice,
  price,
}: DealCardProps) {
  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "steam":
        return "bg-blue-600";
      case "xbox":
        return "bg-green-600";
      case "playstation":
        return "bg-blue-500";
      case "gog":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover object-center rounded-lg mb-4 shadow-sm"
        />
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-semibold text-white rounded ${getPlatformColor(
              platform
            )}`}
          >
            {platform}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
            {discount}
          </span>
        </div>
      </div>

      <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow">
        {title}
      </h4>

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">{price}</span>
          <span className="text-sm text-gray-500 line-through">
            {originalPrice}
          </span>
        </div>
        <Dropdown
          items={[
            {
              id: "add-to-cart",
              label: "เพิ่มในตะกร้า",
              action: () => console.log("เพิ่มในตะกร้า:", title),
            },
            {
              id: "add-to-wishlist",
              label: "เพิ่มในรายการโปรด",
              action: () => console.log("เพิ่มในรายการโปรด:", title),
            },
            {
              id: "compare",
              label: "เปรียบเทียบ",
              action: () => console.log("เปรียบเทียบ:", title),
            },
            {
              id: "share",
              label: "แชร์",
              action: () => console.log("แชร์:", title),
            },
          ]}
        />
      </div>

      <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium mt-auto">
        Buy
      </button>
    </div>
  );
}
