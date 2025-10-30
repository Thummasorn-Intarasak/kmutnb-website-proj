"use client";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  closeCart,
} from "../store/slices/cartSlice";
import { FaTimes, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { userApi } from "@/lib/api-client";
import { generateCdKey } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function Cart() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, refreshBalance } = useAuth();
  const { items, totalItems, totalPrice, isOpen } = useAppSelector(
    (state) => state.cart
  );

  const handleRemoveItem = (gameId: number) => {
    dispatch(removeFromCart(gameId));
  };

  const handleUpdateQuantity = (gameId: number, quantity: number) => {
    dispatch(updateQuantity({ gameId, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCloseCart = () => {
    dispatch(closeCart());
  };

  const handleCheckout = async () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      dispatch(closeCart());
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      alert("ตะกร้าสินค้าว่างเปล่า");
      return;
    }

    // เช็คยอดเงินเพียงพอหรือไม่
    const total = totalPrice;
    const currentBalance = Number(user.balance) || 0;
    if (currentBalance < total) {
      alert("ยอดเงินไม่เพียงพอ กรุณาเติมเงิน");
      return;
    }

    try {
      // 1) หักยอดเงินผ่าน API ผู้ใช้
      await userApi.updateUser(user.id, { balance: currentBalance - total });

      // 2) อัปเดตยอดเงินใน context
      await refreshBalance();

      // 3) สร้างรายการไปยังช่องเก็บของ (localStorage)
      const stored = localStorage.getItem("inventory");
      const inventory: Array<{
        id: number;
        gameId: number;
        gameName: string;
        gameImage: string;
        platform: string;
        cdKey: string;
        purchaseDate: string;
      }> = stored ? JSON.parse(stored) : [];

      const now = new Date().toISOString();
      const newEntries: Array<{
        id: number;
        gameId: number;
        gameName: string;
        gameImage: string;
        platform: string;
        cdKey: string;
        purchaseDate: string;
      }> = [];
      items.forEach((cartItem) => {
        for (let i = 0; i < cartItem.quantity; i++) {
          newEntries.push({
            id: Date.now() + Math.random(),
            gameId: cartItem.game.id,
            gameName: cartItem.game.title,
            gameImage: cartItem.game.image,
            platform: cartItem.game.platform,
            cdKey: generateCdKey(),
            purchaseDate: now,
          });
        }
      });

      localStorage.setItem(
        "inventory",
        JSON.stringify([...inventory, ...newEntries])
      );

      // 4) เคลียร์ตะกร้า ปิด และไปหน้าช่องเก็บของ
      dispatch(clearCart());
      dispatch(closeCart());
      alert("ชำระเงินสำเร็จ! ส่งสินค้าไปยังช่องเก็บของแล้ว");
      router.push("/inventory");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-opacity-50"
        onClick={handleCloseCart}
      />

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              ตะกร้าสินค้า ({totalItems})
            </h2>
            <button
              onClick={handleCloseCart}
              className="text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FaShoppingCart className="h-16 w-16 mb-4" />
                <p className="text-lg font-medium">ตะกร้าสินค้าว่างเปล่า</p>
                <p className="text-sm">เพิ่มเกมลงตะกร้าเพื่อเริ่มต้น</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 border-b pb-4"
                  >
                    <img
                      src={item.game.image}
                      alt={item.game.title}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.game.title}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {item.game.platform}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ฿{item.game.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.game.id, item.quantity - 1)
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                        disabled={item.quantity <= 1}
                      >
                        <FaMinus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.game.id, item.quantity + 1)
                        }
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <FaPlus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.game.id)}
                        className="p-1 text-red-400 hover:text-red-600 ml-2"
                      >
                        <FaTimes className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">
                  รวม: ฿{totalPrice.toFixed(2)}
                </span>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  ล้างตะกร้า
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  ชำระเงิน
                </button>
                <button
                  onClick={handleCloseCart}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  เลือกซื้อสินค้าต่อ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
