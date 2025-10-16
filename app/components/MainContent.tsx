"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  fetchBestSellers,
  fetchLatestGames,
  setMockData,
} from "../store/slices/gamesSlice";
import { fetchBanners } from "../store/slices/bannerSlice";
import { BestSellerCardWithApi } from "./BestSellerCard";
import BannerCarousel from "./BannerCarousel";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";
import ApiTest from "./ApiTest";
import FeaturedGameCard from "./FeaturedGameCard";
import { transformGameData } from "../../lib/utils";
import { Banner } from "../types/banner.types";

export default function MainContent() {
  const dispatch = useAppDispatch();
  const { latestGames, loading } = useAppSelector((state) => state.games);
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

  // ใช้ข้อมูลจาก API และจัดเรียงให้ banner_id = 4 อยู่ด้านหน้า
  const bannerData =
    banners.length > 0
      ? (() => {
          // หา banner_id = 4 (เกม Rust)
          const rustBanner = banners.find((b: Banner) => b.banner_id === 4);
          const otherBanners = banners.filter((b: Banner) => b.banner_id !== 4);

          // ถ้าเจอ banner_id = 4 ให้ใส่อันแรก ไม่เจอก็ใช้ banners ตามปกติ
          return rustBanner ? [rustBanner, ...otherBanners] : banners;
        })()
      : [];

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

        {/* Featured Game Section - จาก API */}
        {!loading &&
          latestGames.length > 0 &&
          (() => {
            // ค้นหาเกม Metal Gear Solid หรือเกม ID=3 จาก API
            let selectedGame = latestGames.find((game) => {
              const gameName =
                (game as { game_name?: string }).game_name?.toLowerCase() || "";
              return (
                game.id === 3 ||
                gameName.includes("metal gear") ||
                gameName.includes("red dead")
              );
            });

            // ถ้าไม่เจอให้ใช้เกมแรก
            if (!selectedGame) {
              selectedGame = latestGames[0];
            }

            const featuredGame = transformGameData(selectedGame);
            return (
              <FeaturedGameCard
                id={featuredGame.id}
                title={featuredGame.title}
                description={
                  featuredGame.description ||
                  `${featuredGame.title} - เกมสุดฮิตพร้อมส่ง! ราคาพิเศษเฉพาะที่นี่`
                }
                image={featuredGame.image}
                buttonText="ซื้อเลย"
                buttonColor="bg-gray-600 hover:bg-gray-700"
                imagePosition="left"
              />
            );
          })()}

        {/* Footer Info */}
        <div className="text-center text-gray-600 text-sm space-y-2">
          <p className="mb-2">
            FPB Game Store ให้บริการเกมในราคาคุ้มค่า สำหรับเกมเมอร์อย่างคุณ
            พร้อมส่งทันทีหลังสั่งซื้อ
          </p>
          <p>เข้าร่วมกับเกมเมอร์หลายล้านคนที่ประหยัดไปกับเรา</p>
          <p className="text-gray-500 mt-4">
            Copyright © 2025 FPB Game Store. All rights reserved.
          </p>
        </div>
      </main>
    </ErrorBoundary>
  );
}
