"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaGamepad,
  FaStar,
  FaNewspaper,
  FaComments,
  FaQuestionCircle,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBalanceScale,
  FaKey,
} from "react-icons/fa";
import { BsNintendoSwitch, BsXbox, BsPlaystation } from "react-icons/bs";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdNewReleases } from "react-icons/md";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const topMenuItems = [
    { icon: FaHome, label: "หน้าหลัก", href: "/" },
    {
      icon: FaGamepad,
      label: "รายการสินค้า",
      href: "#",
      hasExpand: true,
      subItems: [
        { icon: MdNewReleases, label: "เกมออกใหม่", href: "#" },
        { icon: FaStar, label: "เกมขายดี", href: "#" },
        { icon: RiMoneyDollarCircleLine, label: "เกมลดราคา", href: "#" },
        { icon: FaGamepad, label: "เกมทั้งหมด", href: "#" },
      ],
    },
    {
      icon: FaGamepad,
      label: "เกมแพลตฟอร์มอื่นๆ",
      href: "#",
      hasExpand: true,
      subItems: [
        { icon: FaStar, label: "PC", href: "#" },
        { icon: BsNintendoSwitch, label: "NINTENDO", href: "#" },
        { icon: BsXbox, label: "XBOX", href: "#" },
        { icon: BsPlaystation, label: "PLAYSTATION", href: "#" },
        { icon: FaKey, label: "Key/Gift Card", href: "#" },
      ],
    },
  ];

  const bottomMenuItems = [
    { icon: FaStar, label: "รีวิว", href: "#" },
    { icon: FaNewspaper, label: "อัพเดต", href: "#" },
    { icon: FaComments, label: "ติดต่อเรา", href: "#" },
    {
      icon: FaQuestionCircle,
      label: "คำถามทั่วไป",
      href: "#",
    },
    { icon: FaInfoCircle, label: "เกี่ยวกับเรา", href: "/about" },
    {
      icon: FaBalanceScale,
      label: "นโยบายของทางร้าน",
      href: "/privacy",
    },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleExpand = (itemLabel: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemLabel]: !prev[itemLabel],
    }));
  };

  const shouldShowExpanded = !isCollapsed || isHovered;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-100 opacity-50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-sm transition-all duration-300 ease-in-out ${
          isOpen
            ? "fixed top-0 left-0 block h-screen overflow-y-auto z-50 lg:sticky lg:top-16 lg:left-auto lg:h-[calc(100vh-4rem)] lg:z-40"
            : "hidden lg:block lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:overflow-y-auto lg:z-40"
        } ${shouldShowExpanded ? "w-64" : "w-16"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header with toggle button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>

          {/* Desktop toggle button */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title={isCollapsed ? "ขยายเมนู" : "ย่อเมนู"}
          >
            {isCollapsed ? (
              <FaChevronRight className="text-sm" />
            ) : (
              <FaChevronLeft className="text-sm" />
            )}
          </button>
        </div>

        <nav className="p-4">
          {/* ส่วนเมนูบน */}
          <ul className="space-y-1 mb-4">
            {topMenuItems.map((item, index) => (
              <li key={index}>
                <div>
                  <Link
                    href={item.href}
                    className={`flex items-center text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ${
                      shouldShowExpanded
                        ? "justify-between px-2 py-3"
                        : "justify-center w-8 h-12"
                    }`}
                    title={!shouldShowExpanded ? item.label : undefined}
                  >
                    <div
                      className={`flex items-center ${
                        shouldShowExpanded
                          ? "space-x-3"
                          : "w-full justify-center"
                      }`}
                    >
                      <item.icon className={`text-gray-600 text-lg`} />
                      {shouldShowExpanded && (
                        <span className="text-sm whitespace-nowrap">
                          {item.label}
                        </span>
                      )}
                    </div>
                    {shouldShowExpanded && item.hasExpand && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpand(item.label);
                        }}
                        className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        {expandedItems[item.label] ? (
                          <FaMinus className="text-gray-600 text-xs" />
                        ) : (
                          <FaPlus className="text-gray-600 text-xs" />
                        )}
                      </button>
                    )}
                  </Link>

                  {/* Sub Items */}
                  {shouldShowExpanded &&
                    item.subItems &&
                    expandedItems[item.label] && (
                      <ul className="ml-6  space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className="flex items-center text-gray-600 hover:bg-gray-100 rounded-lg transition-colors py-2 px-2"
                            >
                              <subItem.icon className="text-gray-600 text-sm mr-3" />
                              <span className="text-sm whitespace-nowrap">
                                {subItem.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </li>
            ))}
          </ul>
          {/* เส้นแบ่ง */}
          <div className="border-t border-gray-200 mb-4"></div>
          {/* ส่วนเมนูล่าง */}
          <ul className="space-y-1 mb-4">
            {bottomMenuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center text-gray-800 hover:bg-gray-100 rounded-lg transition-colors ${
                    shouldShowExpanded
                      ? "justify-between px-1.75 py-3.5" // เพิ่ม justify-between ตรงนี้
                      : "justify-center w-8 h-12"
                  }`}
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                  <div
                    className={`flex items-center ${
                      shouldShowExpanded ? "space-x-3" : "w-full justify-center"
                    }`}
                  >
                    <item.icon
                      className={`text-gray-600 text-lg`} // แก้เป็น text-lg
                    />
                    {shouldShowExpanded && (
                      <span className="text-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
