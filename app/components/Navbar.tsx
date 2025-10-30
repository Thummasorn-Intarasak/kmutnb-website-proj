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
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useAppDispatch, useAppSelector } from "../hooks";
import { openCart } from "../store/slices/cartSlice";
import Cart from "./Cart";
import { itemApi } from "../../lib/api-client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

interface SearchResult {
  game_id: number;
  game_name: string;
  game_price: string;
  game_image?: string | Buffer;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout, isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { totalItems } = useAppSelector((state) => state.cart) as {
    totalItems: number;
  };
  const wishlistItems = useAppSelector((state) => state.wishlist.items);
  const wishlistCount = wishlistItems.length;
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const searchDropdownMobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        searchDropdownDesktopRef.current &&
        !searchDropdownDesktopRef.current.contains(event.target as Node) &&
        searchDropdownMobileRef.current &&
        !searchDropdownMobileRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ค้นหาเกมเมื่อพิมพ์
  useEffect(() => {
    const searchGames = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await itemApi.searchItems(searchQuery);
        setSearchResults(results.slice(0, 5)); // แสดงแค่ 5 รายการ
        setShowSearchResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchGames, 300); // debounce 300ms
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchItemClick = (id: number) => {
    router.push(`/game/${id}`);
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const getImageUrl = (image: string | Buffer | undefined): string => {
    if (!image) return "/placeholder-game.jpg";
    if (typeof image === "string") return image;
    // ถ้าเป็น Buffer ใช้ placeholder
    return "/placeholder-game.jpg";
  };

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
          <div
            className="flex-1 max-w-lg mx-8 hidden md:block"
            ref={searchDropdownDesktopRef}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search Games"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery.length >= 2 && setShowSearchResults(true)
                }
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
              />

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto mb-2"></div>
                      กำลังค้นหา...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={`search-result-${result.game_id}-${index}`}
                          onClick={() => handleSearchItemClick(result.game_id)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                        >
                          <img
                            src={getImageUrl(result.game_image)}
                            alt={result.game_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1 text-left">
                            <p className="text-sm font-medium text-gray-900">
                              {result.game_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ฿{parseFloat(result.game_price).toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      ไม่พบเกมที่ค้นหา
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ส่วนปุ่มต่างๆ และโปรไฟล์ผู้ใช้ */}
          <div className="flex items-center space-x-4">
            {/* ปุ่มรายการโปรด */}
            <Link href="/wishlist">
              <button className="p-2 text-gray-600 hover:text-gray-800 relative">
                <FaHeart className="text-lg" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </Link>

            {/* ปุ่มแจ้งเตือน */}
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <FaBell className="text-lg" />
            </button>

            {/* ปุ่มตะกร้าสินค้า */}
            <button
              onClick={() => dispatch(openCart())}
              className="p-2 text-gray-600 hover:text-gray-800 relative"
            >
              <FaShoppingCart className="text-lg" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
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
                    <span className="hidden sm:block">
                      สวัสดี, {user.username}
                    </span>
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
                                {user.username}
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* เมนูต่างๆ */}
                        <div className="py-1">
                          {/* แสดง Admin Dashboard เฉพาะ admin */}
                          {isAdmin() && (
                            <Link
                              href="/admin"
                              className="w-full text-left px-4 py-3 text-sm text-blue-700 hover:bg-blue-50 transition-colors flex items-center space-x-3 border-b border-gray-100"
                            >
                              <FaUserShield className="text-blue-500" />
                              <span className="font-medium">
                                Admin Dashboard
                              </span>
                            </Link>
                          )}

                          <Link
                            href="/topup"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          >
                            <FaCreditCard className="text-gray-400" />
                            <span>เติมเงิน</span>
                          </Link>

                          <Link
                            href="/inventory"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          >
                            <FaBox className="text-gray-400" />
                            <span>ช่องเก็บของ</span>
                          </Link>

                          <Link
                            href="/history"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          >
                            <FaHistory className="text-gray-400" />
                            <span>ประวัติการซื้อ</span>
                          </Link>

                          <Link
                            href="/settings"
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-3"
                          >
                            <FaCog className="text-gray-400" />
                            <span>การตั้งค่าบัญชี</span>
                          </Link>
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
        <div className="relative" ref={searchDropdownMobileRef}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Games"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() =>
              searchQuery.length >= 2 && setShowSearchResults(true)
            }
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-gray-900"
          />

          {/* Search Results Dropdown for Mobile */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              {isSearching ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto mb-2"></div>
                  กำลังค้นหา...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={`search-result-mobile-${result.game_id}-${index}`}
                      onClick={() => handleSearchItemClick(result.game_id)}
                      className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                    >
                      <img
                        src={getImageUrl(result.game_image)}
                        alt={result.game_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {result.game_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          ฿{parseFloat(result.game_price).toFixed(2)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  ไม่พบเกมที่ค้นหา
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Component */}
      <Cart />
    </header>
  );
}
