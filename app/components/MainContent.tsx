"use client";
import { FaStar, FaArrowRight } from "react-icons/fa";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchBestSellers,
  fetchLatestGames,
  setMockData,
} from "../store/slices/gamesSlice";
import { fetchBanners } from "../store/slices/bannerSlice";
import BestSellerCard, { BestSellerCardWithApi } from "./BestSellerCard";
import LatestGameCard from "./LatestGameCard";
import BannerCarousel from "./BannerCarousel";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";
import ApiTest from "./ApiTest";
import FeaturedGameCard from "./FeaturedGameCard";
import {
  formatPrice,
  formatOriginalPrice,
  transformGameData,
} from "../../lib/utils";

export default function MainContent() {
  const dispatch = useAppDispatch();
  const { bestSellers, latestGames, loading } = useAppSelector(
    (state) => state.games
  );
  const { banners, loading: bannersLoading } = useAppSelector(
    (state) => state.banners
  );

  // Load data from API on component mount
  useEffect(() => {
    // ใช้ mock data ก่อนเพื่อทดสอบ
    dispatch(setMockData());
    dispatch(fetchBestSellers());
    dispatch(fetchLatestGames());
    dispatch(fetchBanners());
  }, [dispatch]);

  // ใช้ข้อมูลจาก API หรือ fallback data
  const bannerData =
    banners.length > 0
      ? banners
      : [
          {
            id: 1,
            title: "บัญชี Steam",
            subtitle: "มือ 1",
            description: "ราคาถูกกว่าซื้อเอง เป็นเจ้าของคนเดียว",
            image:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
            buttonText: "ดูเพิ่มเติม",
            buttonColor: "#ff6b6b",
            titleColor: "#ffffff",
            backgroundColor:
              "linear-gradient(135deg, #ff6b6b, #ffa500, #ff69b4)",
          },
          {
            id: 2,
            title: "Cyberpunk 2077",
            subtitle: "Ultimate Edition",
            description:
              "An open-world, action-adventure story set in Night City",
            image:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp",
            buttonText: "SHOP NOW",
            buttonColor: "#3b82f6",
            titleColor: "#60a5fa",
            backgroundColor:
              "linear-gradient(135deg, #1e3a8a, #3b82f6, #8b5cf6)",
          },
          {
            id: 3,
            title: "Metal Gear Solid Δ",
            subtitle: "Snake Eater",
            description:
              "A remake of the 2004 game with all-new graphics and 3D audio",
            image:
              "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.webp",
            buttonText: "PRE-ORDER",
            buttonColor: "#10b981",
            titleColor: "#14b8a6",
            backgroundColor:
              "linear-gradient(135deg, #065f46, #10b981, #34d399)",
          },
        ];

  const testimonials = [
    {
      id: 1,
      name: "Reece",
      rating: 5,
      text: "I've been using CDKeys for years, and I've never had a issue with any of the keys I've bought. I've bought games for both console and PC, and not only has it always been a quick delivery of the key, but it's been redeemed without issue. 10/10 would recommend!",
    },
    {
      id: 2,
      name: "Paul",
      rating: 5,
      text: "Having tried several alternative platforms, I can confidently say that CDKeys is the easiest to use, most trust worthy, value for money website and service available on the market. Would highy recommend, having already done so to all of my gaming frends and family.",
    },
    {
      id: 3,
      name: "Joshua",
      rating: 5,
      text: "It doesn't matter if its a new Triple A release, or a game for early windows OS - This is always the first place I come to buy my games. Cheaper, instant access, redeemed straight to your favourite console/pc in less than a minute. GOAT.",
    },
  ];

  return (
    <ErrorBoundary>
      <main className="flex-1 p-6">
        {/* API Test Component */}
        <ApiTest />

        {/* Banner Carousel */}
        {bannersLoading ? (
          <LoadingSpinner text="กำลังโหลด Banner..." />
        ) : (
          <BannerCarousel banners={bannerData} />
        )}

        {/* Best Sellers Section - จาก API */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Best Sellers</h2>
          </div>
          <BestSellerCardWithApi />
        </div>

        {/* Featured Game Section */}
        <FeaturedGameCard
          id={3}
          title="Metal Gear Solid Δ: Snake Eater"
          description="A remake of the 2004 game Metal Gear Solid 3: Snake Eater, with the same gripping story and engrossing world, now with all-new graphics and 3D audio."
          image="https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp"
          buttonText="SHOP NOW"
          buttonColor="bg-gray-600 hover:bg-gray-700"
          imagePosition="left"
        />

        {/* Latest Games Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Latest Games</h2>
            <button className="text-gray-600 hover:text-gray-800 flex items-center">
              <span>View All</span>
              <FaArrowRight className="ml-2" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {loading ? (
              <div className="col-span-full">
                <LoadingSpinner text="กำลังโหลดเกมใหม่..." />
              </div>
            ) : (
              latestGames.map((game) => {
                const transformedGame = transformGameData(game);
                return (
                  <LatestGameCard
                    key={transformedGame.id}
                    id={transformedGame.id}
                    title={transformedGame.title}
                    image={transformedGame.image}
                    platform={transformedGame.platform}
                    price={formatPrice(transformedGame.price)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Customer Testimonials */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            What our customers say about us
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Over 18 million happy customers and counting...
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <p className="font-semibold text-gray-800">
                  - {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-gray-600 text-sm">
          <p className="mb-2">
            Loaded, formerly CDKeys.com, gives gamers like you loads of value on
            Games, Memberships, Top-Ups and more.
          </p>
          <p>Join millions of gamers already saving big with Loaded.</p>
        </div>
      </main>
    </ErrorBoundary>
  );
}
