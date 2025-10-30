"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import {
  FaHistory,
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

interface OrderHistory {
  id: number;
  orderNumber: string;
  gameName: string;
  gameImage: string;
  price: number;
  status: "completed" | "pending" | "cancelled";
  orderDate: string;
  platform: string;
}

export default function HistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // ตรวจสอบการ login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  // ตัวอย่างข้อมูล (ในอนาคตจะดึงจาก API)
  const orderHistory: OrderHistory[] = [
    // ตัวอย่างว่าง - จะมีข้อมูลเมื่อมีการซื้อ
  ];

  const filteredOrders =
    filterStatus === "all"
      ? orderHistory
      : orderHistory.filter((order) => order.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            <FaCheckCircle className="mr-1" />
            สำเร็จ
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
            <FaClock className="mr-1" />
            รอดำเนินการ
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
            ยกเลิกแล้ว
          </span>
        );
      default:
        return null;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 min-h-screen bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span className="font-medium">กลับ</span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                <FaHistory className="inline mr-3" />
                ประวัติการซื้อ
              </h1>
              <p className="text-gray-600">รายการคำสั่งซื้อทั้งหมดของคุณ</p>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ทั้งหมด
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === "completed"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  สำเร็จ
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === "pending"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  รอดำเนินการ
                </button>
                <button
                  onClick={() => setFilterStatus("cancelled")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    filterStatus === "cancelled"
                      ? "bg-red-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  ยกเลิก
                </button>
              </div>
            </div>

            {/* Order List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  ยังไม่มีประวัติการซื้อ
                </h2>
                <p className="text-gray-600 mb-6">
                  เมื่อคุณสั่งซื้อเกม ประวัติจะปรากฏที่นี่
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  เลือกซื้อเกม
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          คำสั่งซื้อ #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          วันที่: {order.orderDate}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex items-center space-x-6">
                      {/* Game Image */}
                      <img
                        src={order.gameImage}
                        alt={order.gameName}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      {/* Game Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {order.gameName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          แพลตฟอร์ม: {order.platform}
                        </p>
                        <p className="text-2xl font-bold text-blue-600">
                          {order.price.toFixed(2)} ฿
                        </p>
                      </div>

                      {/* Actions */}
                      {order.status === "completed" && (
                        <button
                          onClick={() => router.push("/inventory")}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          ดู CD-Key
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">ข้อมูลเพิ่มเติม</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• CD-Key จะถูกส่งทันทีหลังการชำระเงินสำเร็จ</li>
                <li>• คำสั่งซื้อที่รอดำเนินการจะใช้เวลาประมาณ 5-30 นาที</li>
                <li>• สามารถดู CD-Key ได้ที่เมนู &quot;ช่องเก็บของ&quot;</li>
                <li>• หากมีปัญหากรุณาติดต่อฝ่ายสนับสนุนลูกค้า</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
