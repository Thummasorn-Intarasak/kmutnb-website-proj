"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BannerCarouselProps } from "../types";

export default function BannerCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, banners.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const handleBannerClick = () => {
    // ถ้ามี game_id ให้ไปหน้ารายละเอียดเกม
    if (currentBanner.game_id) {
      router.push(`/game/${currentBanner.game_id}`);
    }
  };

  return (
    <div className="relative w-full h-96 mb-8 overflow-hidden rounded-xl">
      {/* Banner Content */}
      <div
        className="w-full h-full flex items-center justify-center relative transition-all duration-500 ease-in-out cursor-pointer"
        onClick={handleBannerClick}
      >
        {/* Background Image */}
        {currentBanner.banner_image && (
          <img
            src={currentBanner.banner_image}
            alt={currentBanner.banner_name || "Banner"}
            className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Fallback Background Color (for old banner format) */}
        {!currentBanner.banner_image && currentBanner.backgroundColor && (
          <div
            className="absolute inset-0"
            style={{ background: currentBanner.backgroundColor }}
          ></div>
        )}

        {/* Game Cards Overlay (if available) */}
        {currentBanner.games && currentBanner.games.length > 0 && (
          <div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {currentBanner.games.slice(0, 7).map((game, index) => (
              <div
                key={index}
                className="w-16 h-20 rounded-lg shadow-lg transform hover:scale-110 transition-transform bg-gray-600 flex items-center justify-center cursor-default"
                style={{
                  transform: `rotate(${(index - 3) * 5}deg) translateY(${
                    Math.abs(index - 3) * 2
                  }px)`,
                }}
              >
                <span className="text-white text-xs font-semibold text-center px-1">
                  {game.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all z-20"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all z-20"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
