"use client";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  text = "กำลังโหลด...",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 ${className}`}
    >
      <div
        className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]} mb-4`}
      ></div>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}
