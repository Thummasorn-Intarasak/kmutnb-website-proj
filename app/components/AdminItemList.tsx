"use client";

import { useState, useEffect, useRef } from "react";
import { itemApi } from "@/lib/api-client";
import { ApiItem } from "@/app/types";
import TagBadges from "./TagBadges";
import { useRouter } from "next/navigation";

interface AdminItemListProps {
  refreshTrigger?: number;
}

export default function AdminItemList({ refreshTrigger }: AdminItemListProps) {
  const router = useRouter();
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ApiItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    game_name: "",
    game_description: "",
    game_price: "",
    game_tag: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  // kept for backward compatibility; not used in multi-preview
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const getImageArray = (image: string | Buffer | undefined): string[] => {
    if (!image) return [];
    if (typeof image === "string") {
      try {
        if (image.trim().startsWith("[")) {
          const arr = JSON.parse(image);
          return Array.isArray(arr) ? arr.map((s: string) => s) : [];
        }
      } catch {}
      return [image];
    }
    return [];
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
      game_tag: Array.isArray(item.game_tag)
        ? item.game_tag.join(",")
        : item.game_tag || "",
    });
    setImagePreview("");
    setImageFiles([]);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditFormData({
      game_name: "",
      game_description: "",
      game_price: "",
      game_tag: "",
    });
    setImagePreview("");
    setImageFiles([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      setImageFiles(files);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    } else {
      setImageFiles([]);
      setImagePreview("");
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
        game_tag: editFormData.game_tag
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      });

      // ถ้ามีรูปภาพใหม่ ให้อัปโหลด (รองรับหลายรูป)
      if (imageFiles.length > 0) {
        await itemApi.uploadItemImages(editingItem.game_id, imageFiles);
      }

      alert("อัปเดตสินค้าสำเร็จ");
      handleCancelEdit();
      fetchItems();
      // กลับไปหน้าแดชบอร์ดแอดมิน
      router.push("/admin");
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
            <label className="block text-gray-300 mb-2">
              แท็ก (คั่นด้วย ,)
            </label>
            <input
              type="text"
              value={editFormData.game_tag}
              onChange={(e) =>
                setEditFormData({ ...editFormData, game_tag: e.target.value })
              }
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="เช่น RPG,Action,Multiplayer"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">
              รูปภาพใหม่ (อัปโหลดหลายรูปได้)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              ref={fileInputRef}
              className="w-full bg-[#0d1117] text-white px-4 py-2 rounded border border-gray-700 focus:border-blue-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />

            <div className="mt-4 flex flex-col gap-3">
              {imageFiles.length > 0 && (
                <div className="text-sm text-gray-400">
                  เลือกไฟล์ใหม่ {imageFiles.length} ไฟล์
                  (ไฟล์ใหม่จะถูกเพิ่มต่อท้ายเมื่อกดบันทึก)
                </div>
              )}

              {editingItem.game_image ? (
                <div>
                  <p className="text-sm text-gray-400 mb-2">รูปภาพปัจจุบัน:</p>
                  <div className="flex flex-wrap gap-3">
                    {getImageArray(editingItem.game_image).map((path) => {
                      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
                        ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(
                            "/api",
                            ""
                          )
                        : "http://localhost:3002";
                      const src = path.startsWith("/")
                        ? `${baseUrl}${path}`
                        : `${baseUrl}/${path}`;
                      const handleDeleteImage = async () => {
                        if (!confirm("ลบรูปนี้ออกจากเกม?")) return;
                        try {
                          await itemApi.deleteItemImage(
                            editingItem.game_id,
                            path
                          );
                          const updated = await itemApi.getItemById(
                            editingItem.game_id
                          );
                          setEditingItem(updated);
                        } catch {
                          alert("ลบรูปไม่สำเร็จ");
                        }
                      };
                      return (
                        <div key={path} className="relative">
                          <img
                            src={src}
                            alt={editingItem.game_name}
                            className="w-28 h-28 object-cover rounded border border-gray-700"
                          />
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                            title="ลบรูปนี้"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                    {imageFiles.map((file, idx) => {
                      const src = URL.createObjectURL(file);
                      const removeAt = () => {
                        setImageFiles((prev) =>
                          prev.filter((_, i) => i !== idx)
                        );
                        setTimeout(() => URL.revokeObjectURL(src), 0);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      };
                      return (
                        <div
                          key={`new-${file.name}-${idx}`}
                          className="relative"
                        >
                          <img
                            src={src}
                            alt={file.name}
                            className="w-28 h-28 object-cover rounded border border-gray-700 opacity-90 ring-2 ring-blue-500/50"
                          />
                          <button
                            type="button"
                            onClick={removeAt}
                            className="absolute -top-2 -right-2 bg-gray-700 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center"
                            title="เอาไฟล์ใหม่นี้ออกจากการอัปโหลด"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
                <th className="pb-3 text-gray-400 font-medium">แท็ก</th>
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
                  <td className="py-4">
                    <TagBadges tags={item.game_tag} />
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
