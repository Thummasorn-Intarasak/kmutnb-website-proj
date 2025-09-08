"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AboutPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex-1 lg:ml-0">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link
                    href="/"
                    className="hover:text-gray-800 transition-colors"
                  >
                    <FaHome className="inline mr-1" />
                    หน้าหลัก
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-800 font-medium">เกี่ยวกับเรา</li>
              </ol>
            </nav>

            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                499K NETWORK
              </h1>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1: About Us */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">i</span>
                  </span>
                  เกี่ยวกับ
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  <p>
                    499K NETWORK
                    เป็นเว็บไซต์ที่นำเสนอการบริการเกี่ยวกับการเพิ่มเวลา Steam
                    และการจัดการสินค้าดิจิทัลอื่นๆ ที่เกี่ยวข้องกับเกมออนไลน์
                    ทีมงานของเรามุ่งมั่นที่จะให้บริการที่รวดเร็วและมีคุณภาพให้แก่ผู้ใช้งาน
                  </p>
                </div>
              </section>

              {/* Section 2: Vision */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  วิสัยทัศน์
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  <p>
                    เราตั้งเป้าหมายที่จะเป็นผู้นำในด้านการให้บริการสินค้าและบริการดิจิทัลในตลาดเกมออนไลน์
                    ด้วยการพัฒนาแพลตฟอร์มที่ใช้งานง่ายและปลอดภัย
                  </p>
                </div>
              </section>

              {/* Section 3: Our Team */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  ทีมงานของเรา
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  <p>
                    ทีมงาน 499K NETWORK
                    ประกอบไปด้วยผู้เชี่ยวชาญด้านเทคโนโลยีและเกมออนไลน์ที่มีประสบการณ์
                    เราให้ความสำคัญกับการให้บริการลูกค้าและการพัฒนาอย่างต่อเนื่อง
                  </p>
                </div>
              </section>

              {/* Section 4: Contact Us */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  การติดต่อเรา
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  <p>
                    หากคุณต้องการติดต่อเราสำหรับข้อมูลเพิ่มเติมหรือข้อเสนอแนะ
                    กรุณาส่งอีเมลมาที่{" "}
                    <span className="text-orange-500 font-medium">
                      contact@499k-network.com
                    </span>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
