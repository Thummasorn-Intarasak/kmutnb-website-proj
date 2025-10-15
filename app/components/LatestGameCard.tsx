import { LatestGameCardProps } from "../types";
import Dropdown from "./Dropdown";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";

export default function LatestGameCard({
  id,
  title,
  image,
  platform,
  price,
}: LatestGameCardProps) {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === id);

  const handleToggleWishlist = () => {
    const numericPrice = parseFloat(price.replace("฿", ""));
    const game = {
      id,
      title,
      image,
      platform,
      price: numericPrice,
    };

    if (isInWishlist) {
      dispatch(removeFromWishlist(id));
    } else {
      dispatch(addToWishlist(game));
    }
  };

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
        <Link href={`/game/${id}`}>
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover object-center rounded-lg mb-4 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-semibold text-white rounded ${getPlatformColor(
              platform
            )}`}
          >
            {platform}
          </span>
        </div>
      </div>

      <Link href={`/game/${id}`}>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow cursor-pointer hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </Link>

      <div className="flex items-center justify-between mb-3">
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
              label: isInWishlist ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด",
              action: handleToggleWishlist,
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
