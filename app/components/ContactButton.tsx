"use client";

import { useState } from "react";
import { FaComments, FaTimes, FaEnvelope } from "react-icons/fa";

export default function ContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {/* Contact Options Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-64 mb-2 animate-fade-in">
          <div className="mb-3">
            <h3 className="font-semibold text-gray-800 text-lg mb-1">
              ติดต่อเรา
            </h3>
            <p className="text-sm text-gray-600">
              เลือกช่องทางที่ต้องการติดต่อ
            </p>
          </div>

          <div className="space-y-2">
            {/* Email */}
            <a
              href="mailto:s6504022630129@email.kmutnb.ac.th"
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                <FaEnvelope className="text-white text-xl" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Email</p>
                <p className="text-xs text-gray-500">
                  s6504022630129@email.kmutnb.ac.th
                </p>
              </div>
            </a>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              เวลาทำการ: จันทร์-ศุกร์ 9:00-18:00
            </p>
          </div>
        </div>
      )}

      {/* Main Contact Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
        }`}
        aria-label="ติดต่อเรา"
      >
        {isOpen ? (
          <FaTimes className="text-white text-2xl" />
        ) : (
          <FaComments className="text-white text-2xl" />
        )}
      </button>

      {/* Pulse Animation when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75 pointer-events-none"></span>
      )}
    </div>
  );
}
