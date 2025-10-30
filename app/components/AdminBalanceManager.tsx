"use client";

import { useState } from "react";
import { userApi } from "@/lib/api-client";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminBalanceManager() {
  const { user, refreshBalance } = useAuth();
  const [targetUserId, setTargetUserId] = useState<string>(
    user ? String(user.id) : ""
  );
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [currentBalance, setCurrentBalance] = useState<number | null>(null);

  const handleFetchUser = async () => {
    setMessage("");
    setCurrentBalance(null);
    if (!targetUserId) return;
    try {
      const data = await userApi.getUserById(Number(targetUserId));
      const bal = parseFloat(data.balance) || 0;
      setCurrentBalance(bal);
    } catch (e) {
      setMessage("ไม่พบผู้ใช้ตาม ID ที่ระบุ");
    }
  };

  const handleAddBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!targetUserId || !amount) {
      setMessage("กรุณากรอก User ID และจำนวนเงิน");
      return;
    }
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setMessage("จำนวนเงินไม่ถูกต้อง");
      return;
    }

    setLoading(true);
    try {
      const userData = await userApi.getUserById(Number(targetUserId));
      const oldBalance = parseFloat(userData.balance) || 0;
      const newBalance = oldBalance + amt;
      await userApi.updateUser(Number(targetUserId), { balance: newBalance });
      setMessage(`เพิ่มเงินสำเร็จ: ยอดคงเหลือใหม่ ฿${newBalance.toFixed(2)}`);
      setCurrentBalance(newBalance);
      setAmount("");

      // ถ้าเป็นการเพิ่มเงินให้กับผู้ใช้ที่กำลังล็อกอินอยู่ ให้รีเฟรชยอดทันที
      if (user && Number(targetUserId) === user.id) {
        await refreshBalance();
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการเพิ่มเงิน");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1d29] rounded-lg p-6 border border-gray-800 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">
        จัดการยอดเงินผู้ใช้
      </h2>

      <form onSubmit={handleAddBalance} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">User ID</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                placeholder="เช่น 1"
              />
              <button
                type="button"
                onClick={handleFetchUser}
                className="px-4 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                ตรวจสอบ
              </button>
            </div>
            {currentBalance !== null && (
              <p className="text-sm text-gray-400 mt-1">
                ยอดคงเหลือปัจจุบัน: ฿{currentBalance.toFixed(2)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              จำนวนเงินที่เพิ่ม (บาท)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold disabled:opacity-50"
            >
              {loading ? "กำลังเพิ่มเงิน..." : "เพิ่มเงิน"}
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-blue-500/20 border border-blue-500 text-blue-300 px-4 py-3 rounded">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
