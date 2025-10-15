import {
  BestSellerCardProps,
  BestSellerCardFromApiProps,
  ApiItem,
} from "../types";
import Dropdown from "./Dropdown";
import { useAppDispatch, useItems, useAppSelector } from "../hooks";
import { addToCart } from "../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Component เดิมที่ใช้ props
export function BestSellerCard({
  id,
  title,
  image,
  platform,
  discount,
  originalPrice,
  price,
}: BestSellerCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === id);

  const handleAddToCart = () => {
    // Convert price string to number (remove ฿ and convert)
    const numericPrice = parseFloat(price.replace("฿", ""));
    const numericOriginalPrice = originalPrice
      ? parseFloat(originalPrice.replace("฿", ""))
      : undefined;

    const game = {
      id,
      title,
      image,
      platform,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      discount,
    };

    dispatch(addToCart(game));
  };

  const handleToggleWishlist = () => {
    const numericPrice = parseFloat(price.replace("฿", ""));
    const numericOriginalPrice = originalPrice
      ? parseFloat(originalPrice.replace("฿", ""))
      : undefined;

    const game = {
      id,
      title,
      image,
      platform,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      discount,
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
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
            {discount}
          </span>
        </div>
      </div>

      <Link href={`/game/${id}`}>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow cursor-pointer hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </Link>

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
              action: handleAddToCart,
            },
            {
              id: "add-to-wishlist",
              label: isInWishlist ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด",
              action: handleToggleWishlist,
            },
          ]}
        />
      </div>

      <button
        onClick={() => router.push(`/game/${id}`)}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium mt-auto"
      >
        สั่งซื้อ
      </button>
    </div>
  );
}

// Component ใหม่ที่ใช้ข้อมูลจาก API
export function BestSellerCardFromApi({
  item,
  platform = "Steam",
  discount,
  originalPrice,
}: BestSellerCardFromApiProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("/placeholder-game.jpg");
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // แปลงข้อมูลจาก API ให้เป็นรูปแบบที่ component ใช้
  const id = item.id;
  const title = item.game_name;
  const price = `฿${parseFloat(item.price).toFixed(2)}`;
  const isInWishlist = wishlistItems.some((wishItem) => wishItem.id === id);

  // จัดการรูปภาพจาก URL
  useEffect(() => {
    if (item.game_image) {
      // ถ้า game_image เป็น URL string ให้ใช้โดยตรง
      if (typeof item.game_image === "string") {
        // ถ้าเป็น path จาก backend ให้เติม backend URL
        if (item.game_image.startsWith("uploads/")) {
          setImageUrl(`http://localhost:3002/${item.game_image}`);
        } else {
          setImageUrl(item.game_image);
        }
      } else {
        // ถ้าเป็น Buffer ให้แปลงเป็น Blob
        try {
          const uint8Array = new Uint8Array(item.game_image);
          const blob = new Blob([uint8Array], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } catch (error) {
          console.error("Error creating image URL:", error);
          setImageUrl("/placeholder-game.jpg");
        }
      }
    }
  }, [item.game_image]);

  const handleAddToCart = () => {
    const game = {
      id,
      title,
      image: imageUrl,
      platform,
      price: parseFloat(item.price), // แปลง string เป็น number
      originalPrice: originalPrice
        ? parseFloat(originalPrice.replace("฿", ""))
        : undefined,
      discount,
    };

    dispatch(addToCart(game));
  };

  const handleToggleWishlist = () => {
    const game = {
      id,
      title,
      image: imageUrl,
      platform,
      price: parseFloat(item.price),
      originalPrice: originalPrice
        ? parseFloat(originalPrice.replace("฿", ""))
        : undefined,
      discount,
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
            src={imageUrl}
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
        {discount && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
              {discount}
            </span>
          </div>
        )}
      </div>

      <Link href={`/game/${id}`}>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow cursor-pointer hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </Link>

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">{price}</span>
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {originalPrice}
            </span>
          )}
        </div>
        <Dropdown
          items={[
            {
              id: "add-to-cart",
              label: "เพิ่มในตะกร้า",
              action: handleAddToCart,
            },
            {
              id: "add-to-wishlist",
              label: isInWishlist ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด",
              action: handleToggleWishlist,
            },
          ]}
        />
      </div>

      <button
        onClick={() => router.push(`/game/${id}`)}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium mt-auto"
      >
        สั่งซื้อ
      </button>
    </div>
  );
}

// Component หลักที่ใช้ข้อมูลจาก API
export function BestSellerCardWithApi() {
  const { items, loading, error } = useItems();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-gray-500">No items found</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item: ApiItem) => (
        <BestSellerCardFromApi
          key={item.id}
          item={item}
          platform="Steam"
          discount="20%"
          originalPrice="฿99.99"
        />
      ))}
    </div>
  );
}

// Default export สำหรับ backward compatibility
export default BestSellerCard;
