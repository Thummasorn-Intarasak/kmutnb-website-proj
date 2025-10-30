"use client";

import { useState, useEffect } from "react";
import { itemApi } from "@/lib/api-client";
import { ApiItem } from "@/app/types";

interface AdminItemListProps {
  refreshTrigger?: number;
}

export default function AdminItemList({ refreshTrigger }: AdminItemListProps) {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ApiItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    game_name: "",
    game_description: "",
    game_price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const getImageUrl = (image: string | Buffer | undefined): string => {
    if (!image) return "/placeholder-game.jpg";

    if (typeof image === "string") {
      // ถ้าเป็น JSON array ของรูปภาพ (ต้อง parse ก่อน)
      if (image.startsWith("[") && image.includes("uploads/")) {
        try {
          const imageArray = JSON.parse(image);
          if (Array.isArray(imageArray) && imageArray.length > 0) {
            // ใช้รูปแรกของ array
            const firstImage = imageArray[0];
            if (firstImage.startsWith("/")) {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
                ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "")
                : "http://localhost:3002";
              return `${baseUrl}/${firstImage}`;
            }
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
              ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "")
              : "http://localhost:3002";
            return `${baseUrl}/${firstImage}`;
          }
        } catch (e) {
          console.error("Error parsing image array:", e);
        }
      }

      // ถ้าเป็น URL เต็มแล้ว
      if (image.startsWith("http://") || image.startsWith("https://")) {
        return image;
      }

      // ถ้าเป็น path ที่เริ่มด้วย /uploads/
      if (image.startsWith("/uploads/") || image.startsWith("uploads/")) {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
          ? process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "")
          : "http://localhost:3002";
        const path = image.startsWith("/") ? image : `/${image}`;
        return `${baseUrl}${path}`;
      }

      // ถ้าเป็น path อื่นๆ
      if (image.startsWith("/")) {
        return image;
      }

      return image;
    }

    return "/placeholder-game.jpg";
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await itemApi.getAllItems();
      console.log("✅ Fetched items successfully:", data.length, "items");

      // Debug: แสดง URL ของรูปภาพแต่ละตัว
      data.forEach((item: ApiItem) => {
        const imageUrl = getImageUrl(item.game_image);
        console.log(`🎮 Item ${item.game_id} - ${item.game_name}:`, {
          originalImage: item.game_image,
          parsedImageUrl: imageUrl,
          type: typeof item.game_image,
        });
      });

      setItems(data);
    } catch (error) {
      console.error("❌ Error fetching items:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
    } finally {
      setLoading(false);
    }
  };

  // โหลดข้อมูลสินค้า
  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`คุณต้องการลบ "${name}" หรือไม่?`)) {
      return;
    }

    try {
      await itemApi.deleteItem(id);
      alert("ลบสินค้าสำเร็จ");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("เกิดข้อผิดพลาดในการลบสินค้า");
    }
  };

  const handleEdit = (item: ApiItem) => {
    setEditingItem(item);
    setEditFormData({
      game_name: item.game_name,
      game_description: item.game_description || "",
      game_price: item.game_price.toString(),
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({
      game_name: "",
      game_description: "",
      game_price: "",
    });
    setImagePreview("");
    setImageFile(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      // อัปเดตข้อมูลสินค้า
      await itemApi.updateItem(editingItem.game_id, {
        game_name: editFormData.game_name,
        game_description: editFormData.game_description,
        game_price: parseFloat(editFormData.game_price),
      });

      // ถ้ามีรูปภาพใหม่ ให้อัปโหลด
      if (imageFile) {
        await itemApi.uploadItemImage(editingItem.game_id, imageFile);
      }

      alert("อัปเดตสินค้าสำเร็จ");
      handleCancelEdit();
      fetchItems();
    } catch (error) {
      console.error("Error updating item:", error);
      alert("เกิดข้อผิดพลาดในการอัปเดตสินค้า");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <p className="text-gray-400 mt-2">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (editingItem) {
    return (
      <div className="bg-[#1a1d29] rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">แก้ไขสินค้า</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">ชื่อเกม *</label>
            <input
              type="text"
              value={editFormData.game_name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, game_name: e.target.value })
              }
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">คำอธิบาย</label>
            <textarea
              value={editFormData.game_description}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  game_description: e.target.value,
                })
              }
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">ราคา (บาท) *</label>
            <input
              type="number"
              value={editFormData.game_price}
              onChange={(e) =>
                setEditFormData({ ...editFormData, game_price: e.target.value })
              }
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">รูปภาพใหม่</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />

            <div className="mt-4 flex gap-4">
              {imagePreview ? (
                <div>
                  <p className="text-sm text-gray-400 mb-2">รูปภาพใหม่:</p>
                  <img
                    src={imagePreview}
                    alt="New preview"
                    className="max-w-xs rounded border border-gray-700"
                  />
                </div>
              ) : editingItem.game_image ? (
                <div>
                  <p className="text-sm text-gray-400 mb-2">รูปภาพปัจจุบัน:</p>
                  <img
                    src={getImageUrl(editingItem.game_image)}
                    alt={editingItem.game_name}
                    className="max-w-xs rounded border border-gray-700"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-game.jpg";
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded font-semibold transition-colors"
            >
              บันทึกการแก้ไข
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded font-semibold transition-colors"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1d29] rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        รายการสินค้าทั้งหมด ({items.length})
      </h2>

      {items.length === 0 ? (
        <p className="text-gray-400 text-center py-8">ไม่มีสินค้าในระบบ</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="pb-3 text-gray-400 font-medium">รูปภาพ</th>
                <th className="pb-3 text-gray-400 font-medium">ชื่อเกม</th>
                <th className="pb-3 text-gray-400 font-medium">คำอธิบาย</th>
                <th className="pb-3 text-gray-400 font-medium">ราคา</th>
                <th className="pb-3 text-gray-400 font-medium text-right">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.game_id}
                  className="border-b border-gray-800 hover:bg-[#0d1117] transition-colors"
                >
                  <td className="py-4">
                    <img
                      src={getImageUrl(item.game_image)}
                      alt={item.game_name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-game.jpg";
                      }}
                    />
                  </td>
                  <td className="py-4 text-white font-medium">
                    {item.game_name}
                  </td>
                  <td className="py-4 text-gray-400 max-w-md truncate">
                    {item.game_description || "-"}
                  </td>
                  <td className="py-4 text-white font-semibold">
                    ฿{parseFloat(item.game_price).toFixed(2)}
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2 transition-colors"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(item.game_id, item.game_name)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
