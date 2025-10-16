"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  removeFromWishlist,
  clearWishlist,
} from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ContactButton from "../components/ContactButton";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function WishlistPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, loading } = useAuth();
  const wishlistItems = useAppSelector((state) => state.wishlist.items);

  // เช็คว่า login หรือยัง ถ้ายังไม่ login ให้ redirect ไปหน้า login
  // ใช้ replace แทน push เพื่อไม่ให้ user กดกลับแล้วกลับมาหน้านี้อีก
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleRemoveItem = (id: number) => {
    dispatch(removeFromWishlist(id));
  };

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    dispatch(addToCart(item));
  };

  const handleClearWishlist = () => {
    if (confirm("คุณต้องการลบรายการโปรดทั้งหมดหรือไม่?")) {
      dispatch(clearWishlist());
    }
  };

  // แสดง loading ขณะเช็ค auth
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่ login ให้แสดง null (จะ redirect ไปหน้า login)
  if (!user) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1">
          <main className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <FaHeart className="text-red-500 mr-3" />
                    รายการโปรด
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {wishlistItems.length} รายการ
                  </p>
                </div>
              </div>

              {wishlistItems.length > 0 && (
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                  <FaTrash />
                  <span>ล้างทั้งหมด</span>
                </button>
              )}
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FaHeart className="text-gray-300 text-6xl mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  ยังไม่มีรายการโปรด
                </h2>
                <p className="text-gray-600 mb-6">
                  เพิ่มเกมที่คุณชื่นชอบเข้าสู่รายการโปรดของคุณ
                </p>
                <Link
                  href="/"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  เรียกดูเกม
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Game Image */}
                    <Link href={`/game/${item.id}`}>
                      <div className="relative mb-4">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded">
                            {item.platform}
                          </span>
                        </div>
                        {item.discount && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">
                              {item.discount}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Game Info */}
                    <Link href={`/game/${item.id}`}>
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm leading-tight cursor-pointer hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-lg font-bold text-gray-800">
                        ฿{item.price.toFixed(2)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ฿{item.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 mt-auto">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                      >
                        <FaShoppingCart />
                        <span>ใส่ตะกร้า</span>
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="ลบออกจากรายการโปรด"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Contact Button */}
      <ContactButton />
    </div>
  );
}
