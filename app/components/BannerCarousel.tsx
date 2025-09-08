"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BannerCarouselProps } from "../types";

export default function BannerCarousel({
  banners,
  autoPlay = true,
  autoPlayInterval = 5000,
}: BannerCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative w-full h-96 mb-8 overflow-hidden rounded-xl">
      {/* Banner Content */}
      <div
        className="w-full h-full flex items-center justify-center relative transition-all duration-500 ease-in-out"
        style={{
          background: currentBanner.backgroundColor,
        }}
      >
        {/* Background Color */}
        <div className="absolute inset-0 bg-gray-800 opacity-30"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-8 max-w-4xl">
          <h1
            className="text-4xl md:text-6xl font-bold mb-2"
            style={{ color: currentBanner.titleColor }}
          >
            {currentBanner.title}
          </h1>
          <h2
            className="text-2xl md:text-4xl font-semibold mb-4"
            style={{ color: currentBanner.titleColor }}
          >
            {currentBanner.subtitle}
          </h2>
          <p className="text-lg md:text-xl text-white mb-8 opacity-90">
            {currentBanner.description}
          </p>
          <button
            className="px-8 py-4 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: currentBanner.buttonColor }}
          >
            {currentBanner.buttonText}
          </button>
        </div>

        {/* Game Cards Overlay (if available) */}
        {currentBanner.games && currentBanner.games.length > 0 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {currentBanner.games.slice(0, 7).map((game, index) => (
              <div
                key={index}
                className="w-16 h-20 rounded-lg shadow-lg transform hover:scale-110 transition-transform bg-gray-600 flex items-center justify-center"
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
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all"
          >
            <FaChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 rounded-full transition-all"
          >
            <FaChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
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
