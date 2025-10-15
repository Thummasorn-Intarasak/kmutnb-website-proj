"use client";

import { useState } from "react";
import Link from "next/link";
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ContactButton from "../components/ContactButton";

export default function PrivacyPolicyPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                <li className="text-gray-800 font-medium">Privacy</li>
              </ol>
            </nav>

            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                นโยบายความเป็นส่วนตัว
              </h1>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Section 1: Personal Data Security */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  การรักษาความปลอดภัยสำหรับข้อมูลส่วนบุคคล
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    เพื่อความปลอดภัยและความเป็นส่วนตัวของข้อมูลส่วนบุคคล FPB
                    Game Store ได้กำหนดระเบียบการเข้าถึงและใช้ข้อมูลส่วนบุคคล
                    โดยให้ความสำคัญกับการปกป้องข้อมูลที่สำคัญ เช่น
                    หมายเลขบัตรเครดิต
                  </p>
                  <p>
                    เว็บไซต์ใช้ช่องทางการสื่อสารที่ปลอดภัย เช่น Secure Socket
                    Layer (SSL) สำหรับการเข้ารหัสข้อมูล
                  </p>
                </div>
              </section>

              {/* Section 2: Cookies */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  การใช้คุกกี้
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    &ldquo;คุกกี้&rdquo; หมายถึง ข้อมูลที่ FPB Game Store
                    ส่งไปยังเว็บเบราว์เซอร์ของผู้ใช้
                    เพื่อให้เว็บไซต์สามารถบันทึกหรือจดจำข้อมูลของผู้ใช้ได้จนกว่าผู้ใช้จะออกจากเบราว์เซอร์
                    หรือลบคุกกี้ออก
                  </p>
                  <p>
                    หากเปิดใช้งานคุกกี้
                    ผู้ใช้จะได้รับประสบการณ์การท่องเว็บที่สะดวกมากขึ้น
                    เนื่องจากคุกกี้ช่วยจดจำเว็บไซต์ที่เคยเข้าเยี่ยมชม
                    ข้อมูลที่เก็บโดยคุกกี้จะถูกนำไปใช้
                    เพื่อการวิเคราะห์ทางสถิติและกิจกรรมอื่นๆ
                    เพื่อปรับปรุงคุณภาพการบริการ
                  </p>
                </div>
              </section>

              {/* Section 3: Policy Updates */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  การปรับปรุงนโยบายการคุ้มครองข้อมูลส่วนบุคคล
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    FPB Game Store อาจปรับปรุงหรือแก้ไขนโยบายความเป็นส่วนตัวนี้
                    โดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                    เพื่อความเหมาะสมและประสิทธิภาพในการให้บริการ ดังนั้น
                    ผู้ใช้ควรอ่านนโยบายความเป็นส่วนตัวทุกครั้งที่เข้าเยี่ยมชม
                    หรือใช้บริการจาก FPB Game Store
                  </p>
                </div>
              </section>

              {/* Section 4: Compliance and Contact */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  การปฏิบัติตามนโยบายคุ้มครองข้อมูลส่วนบุคคลและการติดต่อกับ FPB
                  Game Store
                </h2>
                <div className="text-gray-700 leading-relaxed space-y-3">
                  <p>
                    หากมีข้อสงสัย คำแนะนำ
                    หรือข้อเสนอแนะเกี่ยวกับนโยบายความเป็นส่วนตัว
                    หรือการดำเนินการตามนโยบาย กรุณาติดต่อ FPB Game Store
                    เรายินดีตอบคำถาม รับฟังคำแนะนำ และข้อเสนอแนะ
                    เนื่องจากสิ่งเหล่านี้จะเป็นประโยชน์ต่อการปรับปรุงบริการของ
                    FPB Game Store
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Button */}
      <ContactButton />
    </div>
  );
}
