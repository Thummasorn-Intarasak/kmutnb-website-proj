"use client";

import {
  FaGamepad,
  FaBars,
  FaHeart,
  FaBell,
  FaUser,
  FaSearch,
  FaShoppingCart,
} from "react-icons/fa";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ส่วนโลโก้และปุ่มเมนู */}
          <div className="flex items-center space-x-4">
            {/* ปุ่มเมนูสำหรับมือถือ */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
            >
              <FaBars className="text-lg" />
            </button>

            {/* โลโก้ */}
            <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center">
              <FaGamepad className="text-white text-sm" />
            </div>
          </div>

          {/* ช่องค้นหาเกม (แสดงเฉพาะในหน้าจอขนาดกลางขึ้นไป) */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Games"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* ส่วนปุ่มต่างๆ และโปรไฟล์ผู้ใช้ */}
          <div className="flex items-center space-x-4">
            {/* ปุ่มหัวใจ */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FaHeart className="text-lg" />
            </button>

            {/* ปุ่มแจ้งเตือน */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FaBell className="text-lg" />
            </button>

            {/* ปุ่มตะกร้าสินค้า */}
            <button className="p-2 text-gray-600 hover:text-gray-800 relative">
              <FaShoppingCart className="text-lg" />
            </button>

            {/* ไอคอนโปรไฟล์ผู้ใช้ */}
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <FaUser className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ช่องค้นหาเกมสำหรับมือถือ (แสดงเฉพาะในหน้าจอขนาดเล็ก) */}
      <div className="md:hidden px-4 py-2 border-t border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Games"
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
      </div>
    </header>
  );
}
