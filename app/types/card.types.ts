// LatestGameCard Props
export interface LatestGameCardProps {
  game_id: number;
  game_title: string;
  game_image: string;
  platform: string;
  game_price: string;
}

// BestSellerCard Props
export interface BestSellerCardProps {
  game_id: number;
  game_title: string;
  game_image: string;
  platform: string;
  game_discount?: string;
  game_originalPrice?: string;
  game_price: string;
}

// API Item interface (จาก backend)
export interface ApiItem {
  game_id: number;
  game_name: string;
  game_description?: string;
  game_price: string; // เปลี่ยนจาก number เป็น string เพราะ API ส่งมาเป็น string
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
  game_id: number;
  game_title: string;
  game_description: string;
  game_image: string;
  buttonText?: string;
  buttonColor?: string;
  imagePosition?: "left" | "right";
}
