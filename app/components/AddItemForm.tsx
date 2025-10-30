"use client";

import { useState } from "react";
import { itemApi } from "@/lib/api-client";
import Image from "next/image";

interface AddItemFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddItemForm({ onSuccess, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    game_name: "",
    game_description: "",
    game_price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // สร้าง preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ตรวจสอบข้อมูล
      if (!formData.game_name || !formData.game_price) {
        setError("กรุณากรอกชื่อเกมและราคา");
        setLoading(false);
        return;
      }

      // สร้างสินค้าใหม่
      const newItem = await itemApi.createItem({
        game_name: formData.game_name,
        game_description: formData.game_description,
        game_price: parseFloat(formData.game_price),
      });

      // ถ้ามีรูปภาพ ให้อัปโหลด
      if (imageFile && newItem.game_id) {
        await itemApi.uploadItemImage(newItem.game_id, imageFile);
      }

      // รีเซ็ตฟอร์ม
      setFormData({
        game_name: "",
        game_description: "",
        game_price: "",
      });
      setImageFile(null);
      setImagePreview("");

      // เรียก callback
      if (onSuccess) {
        onSuccess();
      }

      alert("เพิ่มสินค้าสำเร็จ!");
    } catch (err) {
      console.error("Error creating item:", err);
      const errorMessage =
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการเพิ่มสินค้า";
      setError(errorMessage);
      alert(`ไม่สามารถเพิ่มสินค้าได้: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1d29] rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-white mb-4">เพิ่มสินค้าใหม่</h2>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">ชื่อเกม *</label>
          <input
            type="text"
            name="game_name"
            value={formData.game_name}
            onChange={handleInputChange}
            className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="ระบุชื่อเกม"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">คำอธิบาย</label>
          <textarea
            name="game_description"
            value={formData.game_description}
            onChange={handleInputChange}
            className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="ระบุคำอธิบายเกม"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">ราคา (บาท) *</label>
          <input
            type="number"
            name="game_price"
            value={formData.game_price}
            onChange={handleInputChange}
            className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">รูปภาพสินค้า</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
          />
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Preview"
                width={300}
                height={300}
                className="max-w-xs rounded border border-gray-700 object-cover"
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "กำลังเพิ่มสินค้า..." : "เพิ่มสินค้า"}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition-colors"
            >
              ยกเลิก
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
