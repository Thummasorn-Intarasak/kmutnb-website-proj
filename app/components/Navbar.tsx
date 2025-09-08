"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  FaGamepad,
  FaBars,
  FaHeart,
  FaBell,
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
  FaCoins,
  FaChevronDown,
  FaCreditCard,
  FaBox,
  FaHistory,
  FaCog,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

            {/* ส่วนผู้ใช้หรือปุ่มเข้าสู่ระบบ */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* แสดงยอดเงิน */}
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                  <FaCoins className="text-green-600 text-sm" />
                  <span className="text-sm font-medium text-green-700">
                    ฿{user.balance.toLocaleString()}
                  </span>
                </div>

                {/* ข้อมูลผู้ใช้และ Dropdown */}
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <FaUser className="text-gray-600 text-sm" />
                    </div>
                    <span className="hidden sm:block">สวัสดี, {user.name}</span>
                    <FaChevronDown className="text-xs text-gray-500" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-2">
                        {/* ข้อมูลผู้ใช้ */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                              <FaUser className="text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* เมนูต่างๆ */}
                        <div className="py-1">
                          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <FaCreditCard className="text-gray-400" />
                            <span>เติมเงิน</span>
                          </button>

                          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <FaBox className="text-gray-400" />
                            <span>ช่องเก็บของ</span>
                          </button>

                          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <FaHistory className="text-gray-400" />
                            <span>ประวัติการซื้อ</span>
                          </button>

                          <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3">
                            <FaCog className="text-gray-400" />
                            <span>การตั้งค่าบัญชี</span>
                          </button>
                        </div>

                        {/* แยกเส้น */}
                        <div className="border-t border-gray-100 my-1"></div>

                        {/* ปุ่มออกจากระบบ */}
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3"
                        >
                          <FaSignOutAlt className="text-red-500" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-300 font-medium transition-colors hover:rounded-lg"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium transition-colors"
                >
                  สมัครสมาชิก
                </Link>
              </div>
            )}
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
