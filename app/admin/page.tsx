"use client";

import { useState } from "react";
import AddItemForm from "@/app/components/AddItemForm";
import AdminItemList from "@/app/components/AdminItemList";
import AdminGuard from "@/app/components/AdminGuard";
import Link from "next/link";

export default function AdminPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleItemAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowAddForm(false);
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0d1117]">
        {/* Header */}
        <div className="bg-[#1a1d29] border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">จัดการสินค้าและข้อมูลในระบบ</p>
              </div>
              <Link
                href="/"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                ← กลับหน้าหลัก
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Add Item Button */}
          <div className="mb-6">
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                เพิ่มสินค้าใหม่
              </button>
            )}
          </div>

          {/* Add Item Form */}
          {showAddForm && (
            <AddItemForm
              onSuccess={handleItemAdded}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Items List */}
          <AdminItemList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </AdminGuard>
  );
}
