// Game interface (ข้อมูลเกมที่เชื่อมกับ banner)
export interface Game {
  game_id: number;
  game_name: string;
  game_description?: string;
  game_price: number;
  game_image?: string;
}

// Banner interface
export interface Banner {
  banner_id: number;
  banner_name: string;
  banner_image?: string;
  game_id: number;
  game?: Game; // ข้อมูลเกมที่เชื่อมกับ banner (จาก relation)
}

// BannerCarousel Props
export interface BannerCarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}
