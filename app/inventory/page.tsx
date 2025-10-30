"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import {
  FaBox,
  FaKey,
  FaCopy,
  FaCheckCircle,
  FaGamepad,
  FaArrowLeft,
} from "react-icons/fa";

interface InventoryItem {
  id: number;
  gameName: string;
  gameImage: string;
  cdKey: string;
  purchaseDate: string;
  platform: string;
}

type StoredInventoryItem = {
  id?: unknown;
  gameName?: unknown;
  gameImage?: unknown;
  cdKey?: unknown;
  purchaseDate?: unknown;
  platform?: unknown;
};

export default function InventoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // ตรวจสอบการ login
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;
    const stored = localStorage.getItem("inventory");
    if (!stored) {
      setInventoryItems([]);
      return;
    }
    try {
      const parsed: unknown = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const mapped: InventoryItem[] = (parsed as unknown[]).map((raw) => {
          const e = raw as StoredInventoryItem;
          return {
            id: Number((e.id as number | string) ?? 0),
            gameName: String(e.gameName ?? ""),
            gameImage: String(e.gameImage ?? ""),
            cdKey: String(e.cdKey ?? ""),
            purchaseDate: String(e.purchaseDate ?? ""),
            platform: String(e.platform ?? ""),
          };
        });
        setInventoryItems(mapped);
      } else {
        setInventoryItems([]);
      }
    } catch {
      setInventoryItems([]);
    }
  }, [loading, user]);

  if (loading || !user) {
    return null;
  }

  const copyToClipboard = (cdKey: string, itemId: number) => {
    navigator.clipboard.writeText(cdKey);
    setCopiedKey(itemId);
    setTimeout(() => setCopiedKey(null), 2000);
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
                <FaBox className="inline mr-3" />
                ช่องเก็บของ
              </h1>
              <p className="text-gray-600">
                รายการเกมและ CD-Key ทั้งหมดที่คุณซื้อ
              </p>
            </div>

            {/* Items */}
            {inventoryItems.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FaGamepad className="text-6xl text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-700 mb-2">
                  ยังไม่มีรายการในคลัง
                </h2>
                <p className="text-gray-600 mb-6">
                  เมื่อคุณซื้อเกม CD-Key จะปรากฏที่นี่
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
                {inventoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start space-x-6">
                      {/* Game Image */}
                      <img
                        src={item.gameImage}
                        alt={item.gameName}
                        className="w-32 h-32 object-cover rounded-lg"
                      />

                      {/* Game Info */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {item.gameName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          แพลตฟอร์ม: {item.platform} | วันที่ซื้อ:{" "}
                          {item.purchaseDate}
                        </p>

                        {/* CD Key */}
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <FaKey className="text-yellow-600" />
                              <span className="font-mono text-lg font-semibold">
                                {item.cdKey}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(item.cdKey, item.id)
                              }
                              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              {copiedKey === item.id ? (
                                <>
                                  <FaCheckCircle />
                                  <span>คัดลอกแล้ว!</span>
                                </>
                              ) : (
                                <>
                                  <FaCopy />
                                  <span>คัดลอก</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Info */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">
                คำแนะนำการใช้งาน
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• CD-Key จะส่งให้ทันทีหลังชำระเงินสำเร็จ</li>
                <li>
                  • กดปุ่ม &quot;คัดลอก&quot; เพื่อคัดลอก Key
                  ไปใช้งานบนแพลตฟอร์มต่างๆ
                </li>
                <li>• หาก Key ใช้งานไม่ได้ กรุณาติดต่อฝ่ายสนับสนุนลูกค้า</li>
                <li>• CD-Key ที่ซื้อไปแล้วไม่สามารถคืนเงินได้</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
