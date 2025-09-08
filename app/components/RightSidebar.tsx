import DailyDealCard from "./DailyDealCard";

export default function RightSidebar() {
  const dailyDeals = [
    {
      id: 1,
      title: "The Witcher 3: Wild Hunt",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_small/co1wyy.jpg",
      reviews: "1,256 Reviews",
      orders: "8,628 orders",
      price: "$19.99",
    },
    {
      id: 2,
      title: "Elden Ring",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.png",
      reviews: "2,156 Reviews",
      orders: "12,428 orders",
      price: "$39.99",
    },
    {
      id: 3,
      title: "The Legend of Zelda: Breath of the Wild",
      image:
        "https://images.igdb.com/igdb/image/upload/t_cover_big/co3p2d.webp",
      reviews: "3,256 Reviews",
      orders: "15,428 orders",
      price: "$29.99",
    },
  ];

  return (
    <aside className="w-80 bg-white shadow-sm min-h-screen sticky top-16 hidden xl:block">
      <div className="p-6">
        {/* โปรโมชั่น Summer Sale */}
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-6 mb-6 text-white relative overflow-hidden">
          <h3 className="text-lg font-semibold mb-2">Summer Gaming Sale</h3>
          <p className="text-sm mb-4">Up to 70% off on premium games</p>
          <button className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Shop Now →
          </button>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white bg-opacity-20 rounded-full"></div>
        </div>

        {/* ส่วนดีลประจำวัน */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Daily Deals</h3>
            <button className="text-gray-600 hover:text-gray-800 text-sm">
              View all →
            </button>
          </div>
          {/* รายการดีลประจำวัน */}
          <div className="space-y-4">
            {dailyDeals.map((deal) => (
              <DailyDealCard
                key={deal.id}
                id={deal.id}
                title={deal.title}
                image={deal.image}
                reviews={deal.reviews}
                orders={deal.orders}
                price={deal.price}
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
