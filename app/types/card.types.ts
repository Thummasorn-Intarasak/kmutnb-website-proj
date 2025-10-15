// LatestGameCard Props
export interface LatestGameCardProps {
  id: number;
  title: string;
  image: string;
  platform: string;
  price: string;
}

// BestSellerCard Props
export interface BestSellerCardProps {
  id: number;
  title: string;
  image: string;
  platform: string;
  discount?: string;
  originalPrice?: string;
  price: string;
}

// API Item interface (จาก backend)
export interface ApiItem {
  id: number;
  game_name: string;
  description?: string;
  price: string; // เปลี่ยนจาก number เป็น string เพราะ API ส่งมาเป็น string
  game_image?: Buffer | string;
}

// BestSellerCard Props ที่รองรับข้อมูลจาก API
export interface BestSellerCardFromApiProps {
  item: ApiItem;
  platform?: string;
  discount?: string;
  originalPrice?: string;
}

// FeaturedGameCard Props
export interface FeaturedGameCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonColor?: string;
  imagePosition?: "left" | "right";
}
