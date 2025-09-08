import { FaStar, FaPlus } from "react-icons/fa";
import { PopularGameCardProps } from "../types";
import Dropdown from "./Dropdown";

export default function PopularGameCard({
  id,
  title,
  image,
  rating,
  price,
}: PopularGameCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover object-center rounded-lg mb-4 shadow-sm"
      />
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="flex items-center mb-2">
        <FaStar className="text-yellow-400 mr-1" />
        <span className="text-sm text-gray-600">{rating}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-gray-800">{price}</span>
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
    </div>
  );
}
