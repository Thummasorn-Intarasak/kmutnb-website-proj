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
import { useRouter } from "next/navigation";

export default function Cart() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();
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

  const handleCheckout = () => {
    // เช็คว่า login แล้วหรือยัง
    if (!user) {
      dispatch(closeCart());
      router.push("/login");
      return;
    }

    // TODO: ไปหน้า checkout
    alert("ฟังก์ชันชำระเงินยังไม่เสร็จสมบูรณ์");
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
              Shopping Cart ({totalItems})
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
                <p className="text-lg font-medium">Your cart is empty</p>
                <p className="text-sm">Add some games to get started!</p>
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
                  Total: ฿{totalPrice.toFixed(2)}
                </span>
                <button
                  onClick={handleClearCart}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear Cart
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={handleCloseCart}
                  className="w-full bg-gray-100 text-gray-900 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
