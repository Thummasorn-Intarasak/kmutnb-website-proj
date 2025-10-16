import axios from "axios";

// ตั้งค่า base URL สำหรับ API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002/api";
const NEXT_API_BASE_URL = "/api"; // ใช้ Next.js API routes

// สร้าง axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor สำหรับเพิ่ม token (ถ้ามี)
api.interceptors.request.use(
  (config) => {
    // เพิ่ม token จาก localStorage ถ้ามี
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor สำหรับจัดการ error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // ถ้า unauthorized ให้ลบ token และ redirect ไป login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  // สมัครสมาชิก
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  // เข้าสู่ระบบ
  login: async (credentials: { username: string; password: string }) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  getAllUsers: async () => {
    const response = await api.get("/users");
    return response.data;
  },

  // ดึงข้อมูลผู้ใช้ตาม ID
  getUserById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // อัปเดตข้อมูลผู้ใช้
  updateUser: async (
    id: number,
    userData: {
      username?: string;
      email?: string;
      password?: string;
    }
  ) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // ลบผู้ใช้
  deleteUser: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Item API
export const itemApi = {
  // ดึงข้อมูลเกมทั้งหมด
  getAllItems: async () => {
    const response = await api.get("/items");
    return response.data;
  },

  // ดึงข้อมูลเกมตาม ID
  getItemById: async (id: number) => {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  // ค้นหาเกมตามชื่อ
  searchItems: async (name: string) => {
    const response = await api.get(
      `/items/search?name=${encodeURIComponent(name)}`
    );
    return response.data;
  },

  // ค้นหาเกมตามช่วงราคา
  getItemsByPriceRange: async (minPrice: number, maxPrice: number) => {
    const response = await api.get(
      `/items/price-range?min=${minPrice}&max=${maxPrice}`
    );
    return response.data;
  },

  // สร้างเกมใหม่
  createItem: async (itemData: {
    game_name: string;
    game_description?: string;
    game_price: number;
    game_image?: Buffer;
  }) => {
    const response = await api.post("/items", itemData);
    return response.data;
  },

  // อัปเดตเกม
  updateItem: async (
    id: number,
    itemData: {
      game_name?: string;
      game_description?: string;
      game_price?: number;
      game_image?: Buffer;
    }
  ) => {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  // ลบเกม
  deleteItem: async (id: number) => {
    const response = await api.delete(`/items/${id}`);
    return response.data;
  },
};

// Banner API
export const bannerApi = {
  // ดึงข้อมูล banner ทั้งหมด
  getAllBanners: async () => {
    const response = await api.get("/banners");
    return response.data;
  },

  // ดึงข้อมูล banner ตาม ID
  getBannerById: async (id: number) => {
    const response = await api.get(`/banners/${id}`);
    return response.data;
  },

  // สร้าง banner ใหม่
  createBanner: async (bannerData: {
    banner_name: string;
    banner_image?: string;
    game_id: number;
  }) => {
    const response = await api.post("/banners", bannerData);
    return response.data;
  },

  // อัปเดต banner
  updateBanner: async (
    id: number,
    bannerData: {
      banner_name?: string;
      banner_image?: string;
      game_id?: number;
    }
  ) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response.data;
  },

  // ลบ banner
  deleteBanner: async (id: number) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },

  // อัปโหลดรูปภาพ banner
  uploadBannerImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner_image", file);
    const response = await api.patch(`/banners/${id}/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default api;
