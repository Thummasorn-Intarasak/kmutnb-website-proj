"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BannerCarouselProps } from "../types";

export default function BannerCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 20000,
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

  const getPrevIndex = () =>
    currentIndex === 0 ? banners.length - 1 : currentIndex - 1;
  const getNextIndex = () => (currentIndex + 1) % banners.length;

  const handleBannerClick = (index: number) => {
    const banner = banners[index];
    if (banner.game_id) {
      router.push(`/game/${banner.game_id}`);
    }
  };

  return (
    <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 mb-4 sm:mb-6 md:mb-8 overflow-hidden">
      {/* Banner Container with Peek View */}
      <div className="relative w-full h-full flex items-center justify-center px-2 sm:px-4">
        {/* Previous Banner (Left Peek) - Hidden on mobile */}
        {banners.length > 1 && (
          <div
            className="hidden md:block absolute left-0 w-1/4 h-full z-0 cursor-pointer transition-all duration-500 hover:opacity-70"
            style={{
              transform: "translateX(10%) scale(0.9)",
              opacity: 0.4,
            }}
            onClick={() => goToPrevious()}
          >
            <div className="w-full h-full rounded-lg lg:rounded-xl overflow-hidden">
              {banners[getPrevIndex()].banner_image && (
                <img
                  src={banners[getPrevIndex()].banner_image}
                  alt={banners[getPrevIndex()].banner_name || "Previous Banner"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        )}

        {/* Current Banner (Center) */}
        <div
          className="relative w-full md:max-w-2xl lg:max-w-4xl h-full z-10 cursor-pointer transition-all duration-500"
          onClick={() => handleBannerClick(currentIndex)}
        >
          <div className="w-full h-full rounded-lg lg:rounded-xl overflow-hidden shadow-xl lg:shadow-2xl">
            {banners[currentIndex].banner_image && (
              <img
                src={banners[currentIndex].banner_image}
                alt={banners[currentIndex].banner_name || "Banner"}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            )}
          </div>
        </div>

        {/* Next Banner (Right Peek) - Hidden on mobile */}
        {banners.length > 1 && (
          <div
            className="hidden md:block absolute right-0 w-1/4 h-full z-0 cursor-pointer transition-all duration-500 hover:opacity-70"
            style={{
              transform: "translateX(-10%) scale(0.9)",
              opacity: 0.4,
            }}
            onClick={() => goToNext()}
          >
            <div className="w-full h-full rounded-lg lg:rounded-xl overflow-hidden">
              {banners[getNextIndex()].banner_image && (
                <img
                  src={banners[getNextIndex()].banner_image}
                  alt={banners[getNextIndex()].banner_name || "Next Banner"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
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
            className="absolute left-0 top-0 h-full w-12 sm:w-16 lg:w-20 z-30 flex items-center justify-center bg-gradient-to-r from-black/30 to-transparent hover:from-black/50 text-white transition-all group"
          >
            <FaChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 group-hover:scale-125 transition-transform" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-0 top-0 h-full w-12 sm:w-16 lg:w-20 z-30 flex items-center justify-center bg-gradient-to-l from-black/30 to-transparent hover:from-black/50 text-white transition-all group"
          >
            <FaChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 group-hover:scale-125 transition-transform" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all ${
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
