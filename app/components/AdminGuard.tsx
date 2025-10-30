"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // ถ้าไม่ได้ login หรือไม่ใช่ admin ให้ redirect ไปหน้าแรก
      if (!user) {
        router.push("/login");
      } else if (!isAdmin()) {
        router.push("/");
        alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      }
    }
  }, [user, loading, isAdmin, router]);

  // แสดง loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // ถ้าไม่ใช่ admin ไม่แสดงอะไร (จะ redirect ไปแล้ว)
  if (!user || !isAdmin()) {
    return null;
  }

  // ถ้าเป็น admin ให้แสดง children
  return <>{children}</>;
}
