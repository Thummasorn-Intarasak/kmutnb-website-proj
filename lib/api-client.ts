// API Client สำหรับเรียกใช้ Next.js API routes

const API_BASE_URL = "/api";

// Helper function สำหรับเรียก API
async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ error: "Unknown error" }));
    throw new Error(
      errorData.message ||
        errorData.error ||
        `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// User API
export const userApi = {
  // สมัครสมาชิก
  register: async (userData: {
    username: string;
    email: string;
    password: string;
  }) => {
    return apiCall("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // เข้าสู่ระบบ
  login: async (credentials: { username: string; password: string }) => {
    return apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // ดึงข้อมูลผู้ใช้ทั้งหมด
  getAllUsers: async () => {
    return apiCall("/users");
  },

  // ดึงข้อมูลผู้ใช้ตาม ID
  getUserById: async (id: number) => {
    return apiCall(`/users/${id}`);
  },

  // อัปเดตข้อมูลผู้ใช้
  updateUser: async (
    id: number,
    userData: {
      username?: string;
      email?: string;
      password?: string;
      balance?: number;
      role?: string;
    }
  ) => {
    return apiCall(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  // ลบผู้ใช้
  deleteUser: async (id: number) => {
    return apiCall(`/users/${id}`, {
      method: "DELETE",
    });
  },
};

// Item API
export const itemApi = {
  // ดึงข้อมูลเกมทั้งหมด
  getAllItems: async () => {
    return apiCall("/items");
  },

  // ดึงข้อมูลเกมตาม ID
  getItemById: async (id: number) => {
    return apiCall(`/items/${id}`);
  },

  // ค้นหาเกมตามชื่อ
  searchItems: async (name: string) => {
    return apiCall(`/items?name=${encodeURIComponent(name)}`);
  },

  // ค้นหาเกมตามช่วงราคา
  getItemsByPriceRange: async (minPrice: number, maxPrice: number) => {
    return apiCall(`/items?min=${minPrice}&max=${maxPrice}`);
  },

  // สร้างเกมใหม่
  createItem: async (itemData: {
    game_name: string;
    game_description?: string;
    game_price: number;
    game_image?: string;
    game_tag?: string[];
  }) => {
    return apiCall("/items", {
      method: "POST",
      body: JSON.stringify(itemData),
    });
  },

  // อัปโหลดรูปภาพสินค้า
  uploadItemImage: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${API_BASE_URL}/items/${id}/upload-image`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  },

  // อัปเดตเกม
  updateItem: async (
    id: number,
    itemData: {
      game_name?: string;
      game_description?: string;
      game_price?: number;
      game_image?: string;
      game_tag?: string[];
    }
  ) => {
    return apiCall(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    });
  },

  // ลบเกม
  deleteItem: async (id: number) => {
    return apiCall(`/items/${id}`, {
      method: "DELETE",
    });
  },
};

// Banner API
export const bannerApi = {
  // ดึงข้อมูล banner ทั้งหมด
  getAllBanners: async () => {
    return apiCall("/banners");
  },

  // ดึงข้อมูล banner ตาม ID
  getBannerById: async (id: number) => {
    return apiCall(`/banners/${id}`);
  },

  // สร้าง banner ใหม่
  createBanner: async (bannerData: {
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonColor?: string;
    titleColor?: string;
    backgroundColor?: string;
    isActive?: boolean;
    sortOrder?: number;
  }) => {
    return apiCall("/banners", {
      method: "POST",
      body: JSON.stringify(bannerData),
    });
  },

  // อัปเดต banner
  updateBanner: async (
    id: number,
    bannerData: {
      title?: string;
      subtitle?: string;
      description?: string;
      image?: string;
      buttonText?: string;
      buttonColor?: string;
      titleColor?: string;
      backgroundColor?: string;
      isActive?: boolean;
      sortOrder?: number;
    }
  ) => {
    return apiCall(`/banners/${id}`, {
      method: "PUT",
      body: JSON.stringify(bannerData),
    });
  },

  // เปลี่ยนสถานะ banner
  toggleBannerStatus: async (id: number) => {
    return apiCall(`/banners/${id}/toggle`, {
      method: "PUT",
    });
  },

  // ลบ banner
  deleteBanner: async (id: number) => {
    return apiCall(`/banners/${id}`, {
      method: "DELETE",
    });
  },
};

export default { userApi, itemApi, bannerApi };
