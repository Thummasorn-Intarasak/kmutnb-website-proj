"use client";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Link from "next/link";
import {
  FaWallet,
  FaCreditCard,
  FaMobileAlt,
  FaQrcode,
  FaArrowLeft,
} from "react-icons/fa";

export default function TopUpPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  // ตรวจสอบการ login
  if (!user) {
    router.push("/login");
    return null;
  }

  const quickAmounts = [100, 300, 500, 1000, 2000, 5000];

  const paymentMethods = [
    {
      id: "credit-card",
      name: "บัตรเครดิต/เดบิต",
      icon: FaCreditCard,
      description: "Visa, Mastercard, JCB",
    },
    {
      id: "promptpay",
      name: "พร้อมเพย์",
      icon: FaQrcode,
      description: "สแกน QR Code",
    },
    {
      id: "truemoney",
      name: "TrueMoney Wallet",
      icon: FaMobileAlt,
      description: "เติมผ่าน TrueMoney",
    },
  ];

  const handleTopUp = () => {
    if (!amount || parseFloat(amount) < 50) {
      alert("กรุณากรอกจำนวนเงินอย่างน้อย 50 บาท");
      return;
    }
    if (!selectedMethod) {
      alert("กรุณาเลือกช่องทางการชำระเงิน");
      return;
    }

    // TODO: Implement payment gateway
    alert(`กำลังดำเนินการเติมเงิน ${amount} บาท ผ่าน ${selectedMethod}`);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
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
                <FaWallet className="inline mr-3" />
                เติมเงินเข้ากระเป๋า
              </h1>
              <p className="text-gray-600">
                ยอดคงเหลือปัจจุบัน:{" "}
                <span className="text-2xl font-bold text-green-600">
                  0.00 ฿
                </span>
              </p>
            </div>

            {/* Amount Input */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                จำนวนเงินที่ต้องการเติม
              </h2>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="กรอกจำนวนเงิน (ขั้นต่ำ 50 บาท)"
                className="w-full px-4 py-3 text-2xl text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                min="50"
              />

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt.toString())}
                    className="px-4 py-3 bg-gray-100 hover:bg-blue-100 text-gray-800 font-semibold rounded-lg transition-colors"
                  >
                    {amt} ฿
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                เลือกช่องทางการชำระเงิน
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 border-2 rounded-lg transition-all ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center">
                      <method.icon className="text-3xl text-blue-600 mr-4" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          {method.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTopUp}
              className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors"
            >
              เติมเงิน {amount ? `${amount} ฿` : ""}
            </button>

            {/* Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2">ข้อมูลเพิ่มเติม</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• จำนวนเงินขั้นต่ำในการเติมคือ 50 บาท</li>
                <li>• ยอดเงินจะเข้าระบบภายใน 5-10 นาที</li>
                <li>• ไม่มีค่าธรรมเนียมการเติมเงิน</li>
                <li>• หากมีปัญหาติดต่อฝ่ายสนับสนุนลูกค้า</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
