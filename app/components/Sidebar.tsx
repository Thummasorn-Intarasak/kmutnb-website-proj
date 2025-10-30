"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaGamepad,
  FaInfoCircle,
  FaPlus,
  FaMinus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaBalanceScale,
} from "react-icons/fa";
// removed unused icons

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
      label: "ประเภทเกม",
      href: "#",
      hasExpand: true,
      subItems: [
        { icon: FaGamepad, label: "FPS", href: "/category/fps" },
        { icon: FaGamepad, label: "Open World", href: "/category/open-world" },
        {
          icon: FaGamepad,
          label: "Multiplayer",
          href: "/category/multiplayer",
        },
        { icon: FaGamepad, label: "Action", href: "/category/action" },
        { icon: FaGamepad, label: "Indie", href: "/category/indie" },
        { icon: FaGamepad, label: "RPG", href: "/category/rpg" },
        { icon: FaGamepad, label: "Horror", href: "/category/horror" },
      ],
    },
  ];

  const bottomMenuItems = [
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
                    className="flex items-center text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 px-2 py-3"
                    title={!shouldShowExpanded ? item.label : undefined}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <item.icon className="text-gray-600 text-lg flex-shrink-0" />
                      <span
                        className={`text-sm whitespace-nowrap transition-all duration-300 ${
                          shouldShowExpanded
                            ? "opacity-100 max-w-full"
                            : "opacity-0 max-w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                    {item.hasExpand && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleExpand(item.label);
                        }}
                        className={`w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-all duration-300 ml-3 ${
                          shouldShowExpanded
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-0"
                        }`}
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
                  {item.subItems && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        shouldShowExpanded && expandedItems[item.label]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="ml-6 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.href}
                              className="flex items-center text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-300 py-2 px-2"
                            >
                              <subItem.icon className="text-gray-600 text-sm mr-3 flex-shrink-0" />
                              <span
                                className={`text-sm whitespace-nowrap transition-all duration-300 ${
                                  shouldShowExpanded
                                    ? "opacity-100 max-w-full"
                                    : "opacity-0 max-w-0 overflow-hidden"
                                }`}
                              >
                                {subItem.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
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
                  className="flex items-center text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 px-2 py-3"
                  title={!shouldShowExpanded ? item.label : undefined}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <item.icon className="text-gray-600 text-lg flex-shrink-0" />
                    <span
                      className={`text-sm whitespace-nowrap transition-all duration-300 ${
                        shouldShowExpanded
                          ? "opacity-100 max-w-full"
                          : "opacity-0 max-w-0 overflow-hidden"
                      }`}
                    >
                      {item.label}
                    </span>
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
