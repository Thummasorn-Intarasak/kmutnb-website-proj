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
import { useRouter } from "next/navigation";
import { transformGameData, formatPrice } from "../../lib/utils";
import { useAuth } from "../contexts/AuthContext";

// Component เดิมที่ใช้ props
export function BestSellerCard({
  game_id,
  game_title,
  game_image,
  platform,
  game_discount,
  game_originalPrice,
  game_price,
}: BestSellerCardProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item.id === game_id);

  const handleAddToCart = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      router.push("/login");
      return;
    }
    // Convert price string to number (remove ฿ and convert)
    const numericPrice = parseFloat(game_price.replace("฿", ""));
    const numericOriginalPrice = game_originalPrice
      ? parseFloat(game_originalPrice.replace("฿", ""))
      : undefined;

    const game = {
      id: game_id,
      title: game_title,
      image: game_image,
      platform,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      discount: game_discount,
    };

    dispatch(addToCart(game));
  };

  const handleToggleWishlist = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      router.push("/login");
      return;
    }

    const numericPrice = parseFloat(game_price.replace("฿", ""));
    const numericOriginalPrice = game_originalPrice
      ? parseFloat(game_originalPrice.replace("฿", ""))
      : undefined;

    const game = {
      id: game_id,
      title: game_title,
      image: game_image,
      platform,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      discount: game_discount,
    };

    if (isInWishlist) {
      dispatch(removeFromWishlist(game_id));
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
        <Link href={`/game/${game_id}`}>
          <img
            src={game_image}
            alt={game_title}
            className="w-full h-48 object-cover object-center rounded-lg mb-4 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
      </div>

      <Link href={`/game/${game_id}`}>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow cursor-pointer hover:text-blue-600 transition-colors">
          {game_title}
        </h4>
      </Link>

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">{game_price}</span>
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
        onClick={() => router.push(`/game/${game_id}`)}
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
  const { user } = useAuth();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // แปลงข้อมูลจาก API ให้เป็นรูปแบบที่ component ใช้ด้วย transformGameData
  const transformedGame = transformGameData(item);

  const id = transformedGame.id;
  const title = transformedGame.title;
  const imageUrl = transformedGame.image;
  const price = formatPrice(transformedGame.price);
  const isInWishlist = wishlistItems.some((wishItem) => wishItem.id === id);

  const handleAddToCart = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      router.push("/login");
      return;
    }
    const game = {
      id,
      title,
      image: imageUrl,
      platform,
      price: transformedGame.price, // ใช้ราคาที่แปลงแล้ว
      originalPrice: originalPrice
        ? parseFloat(originalPrice.replace("฿", ""))
        : transformedGame.originalPrice,
      discount,
    };

    dispatch(addToCart(game));
  };

  const handleToggleWishlist = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      router.push("/login");
      return;
    }

    const game = {
      id,
      title,
      image: imageUrl,
      platform,
      price: transformedGame.price,
      originalPrice: originalPrice
        ? parseFloat(originalPrice.replace("฿", ""))
        : transformedGame.originalPrice,
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
      </div>

      <Link href={`/game/${id}`}>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow cursor-pointer hover:text-blue-600 transition-colors">
          {title}
        </h4>
      </Link>

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-800">{price}</span>
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
        <BestSellerCardFromApi key={item.game_id} item={item} />
      ))}
    </div>
  );
}

// Default export สำหรับ backward compatibility
export default BestSellerCard;
