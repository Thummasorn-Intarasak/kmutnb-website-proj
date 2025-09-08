"use client";
import { FaStar, FaArrowRight } from "react-icons/fa";
import BestSellerCard from "./BestSellerCard";
import DealCard from "./DealCard";
import LatestGameCard from "./LatestGameCard";
import BannerCarousel from "./BannerCarousel";

export default function MainContent() {
  const bannerData = [
    {
      id: 1,
      title: "บัญชี Steam",
      subtitle: "มือ 1",
      description: "ราคาถูกกว่าซื้อเอง เป็นเจ้าของคนเดียว",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      buttonText: "ดูเพิ่มเติม",
      buttonColor: "#ff6b6b",
      titleColor: "#ffffff",
      backgroundColor: "linear-gradient(135deg, #ff6b6b, #ffa500, #ff69b4)",
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      subtitle: "Ultimate Edition",
      description: "An open-world, action-adventure story set in Night City",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp",
      buttonText: "SHOP NOW",
      buttonColor: "#3b82f6",
      titleColor: "#60a5fa",
      backgroundColor: "linear-gradient(135deg, #1e3a8a, #3b82f6, #8b5cf6)",
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
      backgroundColor: "linear-gradient(135deg, #065f46, #10b981, #34d399)",
    },
  ];

  const bestSellers = [
    {
      id: 1,
      title: "No Man's Sky PC",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      platform: "steam",
      discount: "60% Off",
      originalPrice: "$53.99",
      price: "$21.59",
    },
    {
      id: 2,
      title: "NBA 2K26 Superstar Edition Xbox Series X|S",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.png",
      platform: "xbox",
      discount: "10% Off",
      originalPrice: "$99.99",
      price: "$89.99",
    },
    {
      id: 3,
      title: "Hell is Us - Deluxe Edition PC",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
      platform: "steam",
      discount: "35% Off",
      originalPrice: "$78.99",
      price: "$51.29",
    },
    {
      id: 4,
      title: "HELLDIVERS 2 PC",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.webp",
      platform: "steam",
      discount: "12% Off",
      originalPrice: "$39.99",
      price: "$35.09",
    },
    {
      id: 5,
      title: "Ready or Not PC",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      platform: "steam",
      discount: "60% Off",
      originalPrice: "$60.99",
      price: "$24.29",
    },
    {
      id: 6,
      title: "EA SPORTS FC 26 Ultimate Edition Xbox One & Xbox Series X|S",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.png",
      platform: "xbox",
      discount: "10% Off",
      originalPrice: "$99.99",
      price: "$89.99",
    },
  ];

  const deals = [
    {
      id: 1,
      title: "Cyberpunk 2077: Ultimate Edition PC (GOG)",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp",
      platform: "gog",
      discount: "58% Off",
      originalPrice: "$79.99",
      price: "$33.69",
    },
    {
      id: 2,
      title: "Broken Arrow PC",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      platform: "steam",
      discount: "41% Off",
      originalPrice: "$56.99",
      price: "$33.69",
    },
    {
      id: 3,
      title: "PERSONA 5 ROYAL PC",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
      platform: "steam",
      discount: "77% Off",
      originalPrice: "$67.99",
      price: "$15.49",
    },
    {
      id: 4,
      title: "FINAL FANTASY VII REBIRTH + Bonus PC",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.webp",
      platform: "steam",
      discount: "56% Off",
      originalPrice: "$87.99",
      price: "$38.49",
    },
  ];

  const latestGames = [
    {
      id: 1,
      title: "Metal Gear Solid Δ: Snake Eater",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      platform: "steam",
      price: "$59.99",
    },
    {
      id: 2,
      title: "EA SPORTS Madden NFL 26",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.png",
      platform: "xbox",
      price: "$69.99",
    },
    {
      id: 3,
      title: "EA SPORTS FC 26",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
      platform: "playstation",
      price: "$69.99",
    },
    {
      id: 4,
      title: "Mafia: The Old Country",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.webp",
      platform: "steam",
      price: "$59.99",
    },
    {
      id: 5,
      title: "Borderlands 4",
      image: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
      platform: "xbox",
      price: "$59.99",
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
    <main className="flex-1 p-6">
      {/* Banner Carousel */}
      <BannerCarousel banners={bannerData} />

      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Pay less. Game more.
        </h1>
        <p className="text-gray-600">
          Browse over 15,000 PC, Xbox, PlayStation & Nintendo titles
        </p>
      </div>

      {/* Best Sellers Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Best Sellers</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bestSellers.map((game) => (
            <BestSellerCard
              key={game.id}
              id={game.id}
              title={game.title}
              image={game.image}
              platform={game.platform}
              discount={game.discount}
              originalPrice={game.originalPrice}
              price={game.price}
            />
          ))}
        </div>
      </div>

      {/* Memberships Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Memberships</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              PlayStation Plus
            </h3>
            <p className="text-gray-600 text-sm">
              Access to monthly games and online multiplayer
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">NS</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nintendo Switch Online
            </h3>
            <p className="text-gray-600 text-sm">
              Online play and classic NES & SNES games
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">XG</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Xbox Game Pass
            </h3>
            <p className="text-gray-600 text-sm">
              Access to hundreds of games with Game Pass
            </p>
          </div>
        </div>
      </div>

      {/* Gift Cards Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Gift Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">PS</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              PlayStation Gift Cards
            </h3>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">XB</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Xbox Gift Cards
            </h3>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-red-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">NS</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Nintendo E-Shop Cards
            </h3>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-lg">ST</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Steam Gift Cards
            </h3>
          </div>
        </div>
      </div>

      {/* Featured Game Section */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <img
              src="https://images.igdb.com/igdb/image/upload/t_cover_big/co7497.webp"
              alt="Metal Gear Solid Δ: Snake Eater"
              className="w-full h-80 object-cover object-center rounded-lg shadow-md"
            />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Metal Gear Solid Δ: Snake Eater
            </h2>
            <p className="text-gray-600 mb-6">
              A remake of the 2004 game Metal Gear Solid 3: Snake Eater, with
              the same gripping story and engrossing world, now with all-new
              graphics and 3D audio.
            </p>
            <button className="bg-gray-600 text-white py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors font-medium">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>

      {/* Deals Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Deals</h2>
          <button className="text-gray-600 hover:text-gray-800 flex items-center">
            <span>View All</span>
            <FaArrowRight className="ml-2" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              id={deal.id}
              title={deal.title}
              image={deal.image}
              platform={deal.platform}
              discount={deal.discount}
              originalPrice={deal.originalPrice}
              price={deal.price}
            />
          ))}
        </div>
      </div>

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
          {latestGames.map((game) => (
            <LatestGameCard
              key={game.id}
              id={game.id}
              title={game.title}
              image={game.image}
              platform={game.platform}
              price={game.price}
            />
          ))}
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
  );
}
