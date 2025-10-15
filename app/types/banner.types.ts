// Game interface for banner
export interface Game {
  title: string;
  image: string;
}

// Banner interface
export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonColor?: string;
  titleColor?: string;
  backgroundColor?: string;
  games?: Game[];
}

// BannerCarousel Props
export interface BannerCarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}
