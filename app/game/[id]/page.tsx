"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useItemById } from "../../hooks";
import { addToCart } from "../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../store/slices/wishlistSlice";
import {
  FaHeart,
  FaShoppingCart,
  FaTruck,
  FaSteam,
  FaWifi,
  FaFileAlt,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import ContactButton from "../../components/ContactButton";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
import { useAppSelector } from "../../hooks";

export default function GameDetailPage() {
  const params = useParams();
  const gameId = params.id as string;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageUrls, setImageUrls] = useState<string[]>([
    "/placeholder-game.jpg",
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ดึงข้อมูลจาก API
  const { item, loading, error } = useItemById(parseInt(gameId));

  // เช็คว่าเกมนี้อยู่ใน wishlist หรือไม่
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some(
    (wishItem) => wishItem.id === parseInt(gameId)
  );

  // แปลง Buffer เป็น Image URL และจัดการหลายรูป
  useEffect(() => {
    if (item?.game_image) {
      if (typeof item.game_image === "string") {
        try {
          // ลอง parse เป็น JSON array (กรณีหลายรูป)
          const parsed = JSON.parse(item.game_image);
          if (Array.isArray(parsed)) {
            // มีหลายรูป
            const urls = parsed.map((img: string) =>
              img.startsWith("uploads/") ? `http://localhost:3002/${img}` : img
            );
            setImageUrls(urls);
          } else {
            // parse ได้แต่ไม่ใช่ array
            const singleUrl = item.game_image.startsWith("uploads/")
              ? `http://localhost:3002/${item.game_image}`
              : item.game_image;
            setImageUrls([singleUrl]);
          }
        } catch {
          // parse ไม่ได้ แสดงว่าเป็น string เดียว (รูปเดียว)
          const singleUrl = item.game_image.startsWith("uploads/")
            ? `http://localhost:3002/${item.game_image}`
            : item.game_image;
          setImageUrls([singleUrl]);
        }
      } else {
        // กรณี Buffer
        try {
          const uint8Array = new Uint8Array(item.game_image);
          const blob = new Blob([uint8Array], { type: "image/jpeg" });
          const url = URL.createObjectURL(blob);
          setImageUrls([url]);
          return () => URL.revokeObjectURL(url);
        } catch (error) {
          console.error("Error creating image URL:", error);
          setImageUrls(["/placeholder-game.jpg"]);
        }
      }
    }
  }, [item?.game_image]);

  // Default features สำหรับเกมทุกเกม
  const defaultFeatures = [
    "เป็น Key Steam (บางรายการอาจจะเป็น Gift)",
    "หากเป็น Gift จะมีลิงค์ให้กดรับกรุณาทำตามขั้นตอนอย่างละเอียด",
    "Key / Gift Global สามารถเติมได้ทุกโซน",
    "ซื้อแล้วไม่สามารถคืนเงินได้",
    "เมื่อสั่งซื้อและจัดส่งสำเร็จจะได้รับ CDKEY ในเมนูช่องเก็บของ",
    "แนะนำให้ใส่ Email เพื่อรับการแจ้งเตือนการจัดส่งสินค้า",
    "หากสินค้าหมดทางร้านจะทำการคืนเงินให้ในระบบ",
  ];

  // แปลงข้อมูลจาก API
  const gameData = item
    ? {
        id: item.game_id,
        title: item.game_name,
        platform: "Steam",
        price: parseFloat(item.game_price),
        originalPrice: parseFloat(item.game_price) * 1.3, // คำนวณราคาเดิม (สมมติส่วนลด 30%)
        discount: "30% Off",
        sku: `GAME_${item.game_id}`,
        views: 0,
        sold: 0,
        description:
          item.game_description ||
          `คีย์เกมแท้ ${item.game_name} - พร้อมสั่งซื้อในราคา ฿${parseFloat(
            item.game_price
          ).toFixed(
            2
          )} เท่านั้น! เกมนี้สามารถใช้งานได้บนแพลตฟอร์ม Steam ทั่วโลก สินค้าพร้อมใช้งาน เติมเข้าไอดี Steam ของคุณได้ทันที`,
        fullDescription:
          item.game_description ||
          `${item.game_name} เป็นเกมที่น่าสนใจและได้รับความนิยม พร้อมประสบการณ์การเล่นเกมที่น่าตื่นเต้น`,
        images: imageUrls,
        features: defaultFeatures,
        gameplay: "ออนไลน์",
        shipping: "พร้อมจัดส่งใน 30 นาที",
        steamStoreUrl: "#",
      }
    : null;

  const handleAddToCart = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      router.push("/login");
      return;
    }

    if (!gameData) return;

    const game = {
      id: gameData.id,
      title: gameData.title,
      image: gameData.images[0],
      platform: gameData.platform.toLowerCase(),
      price: gameData.price,
      originalPrice: gameData.originalPrice,
      discount: gameData.discount,
    };

    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(game));
    }
  };

  const handleWishlist = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      router.push("/login");
      return;
    }

    if (!gameData) return;

    const game = {
      id: gameData.id,
      title: gameData.title,
      image: gameData.images[0],
      platform: gameData.platform.toLowerCase(),
      price: gameData.price,
      originalPrice: gameData.originalPrice,
      discount: gameData.discount,
    };

    if (isWishlisted) {
      dispatch(removeFromWishlist(gameData.id));
    } else {
      dispatch(addToWishlist(game));
    }
  };

  const nextImage = () => {
    if (!gameData) return;
    setCurrentImageIndex((prev) =>
      prev === gameData.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!gameData) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? gameData.images.length - 1 : prev - 1
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลเกม...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                เกิดข้อผิดพลาด
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                กลับสู่หน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!gameData) {
    return (
      <div className="bg-gray-100 min-h-screen">
        <Navbar onToggleSidebar={toggleSidebar} />
        <div className="flex">
          <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
          <div className="flex-1 min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="text-gray-400 text-6xl mb-4">🎮</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                ไม่พบข้อมูลเกม
              </h2>
              <p className="text-gray-600 mb-4">ขออภัย ไม่พบเกมที่คุณต้องการ</p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                กลับสู่หน้าหลัก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">กลับ</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Game Images */}
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={gameData.images[currentImageIndex]}
                    alt={gameData.title}
                    width={1200}
                    height={800}
                    quality={100}
                    unoptimized={true}
                    className="w-full h-auto object-contain rounded-lg shadow-lg"
                  />

                  {/* Navigation arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                {/* Image thumbnails */}
                <div className="flex space-x-2">
                  {gameData.images.map((image: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden ${
                        currentImageIndex === index
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${gameData.title} ${index + 1}`}
                        width={160}
                        height={160}
                        quality={100}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Info */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {gameData.title}
                  </h1>

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <span>รหัสสินค้า (SKU): {gameData.sku}</span>
                    <span>ผู้เข้าชม: {gameData.views}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {gameData.description}
                  </p>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FaTruck className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">การจัดส่ง</p>
                        <p className="text-sm text-gray-600">
                          {gameData.shipping}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FaFileAlt className="text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">ขายไปแล้ว</p>
                        <p className="text-sm text-gray-600">{gameData.sold}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FaSteam className="text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          หน้าร้านค้า Steam
                        </p>
                        <a
                          href={gameData.steamStoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {gameData.title}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FaWifi className="text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">การเล่น</p>
                        <p className="text-sm text-gray-600">
                          {gameData.gameplay}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Purchase */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">
                        ราคา {gameData.price}฿
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleWishlist}
                        className={`p-2 rounded-lg ${
                          isWishlisted
                            ? "text-red-500 bg-red-50"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                        } transition-colors`}
                      >
                        <FaHeart />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      จำนวน:
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300 min-w-[60px] text-center text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 text-gray-600 hover:text-gray-800"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <FaShoppingCart className="mr-2" />
                    สั่งซื้อสินค้า
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                รายละเอียดสินค้า - {gameData.title}
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  {gameData.fullDescription}
                </p>

                <ul className="space-y-2">
                  {gameData.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Button */}
          <ContactButton />
        </div>
      </div>
    </div>
  );
}
