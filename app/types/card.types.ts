// LatestGameCard Props
export interface LatestGameCardProps {
  id: number;
  title: string;
  image: string;
  platform: string;
  price: string;
}

// PopularGameCard Props
export interface PopularGameCardProps {
  id: number;
  title: string;
  image: string;
  rating: number;
  price: string;
}

// BestSellerCard Props
export interface BestSellerCardProps {
  id: number;
  title: string;
  image: string;
  platform: string;
  discount: string;
  originalPrice: string;
  price: string;
}

// DealCard Props
export interface DealCardProps {
  id: number;
  title: string;
  image: string;
  platform: string;
  discount: string;
  originalPrice: string;
  price: string;
}

// DailyDealCard Props
export interface DailyDealCardProps {
  id: number;
  title: string;
  image: string;
  reviews: string;
  orders: string;
  price: string;
}
