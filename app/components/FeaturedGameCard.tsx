"use client";
import { useRouter } from "next/navigation";

export interface FeaturedGameCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonColor?: string;
  imagePosition?: "left" | "right";
}

export default function FeaturedGameCard({
  id,
  title,
  description,
  image,
  buttonText = "SHOP NOW",
  buttonColor = "bg-gray-600 hover:bg-gray-700",
  imagePosition = "left",
}: FeaturedGameCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/game/${id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 mb-8 hover:shadow-md transition-shadow">
      <div
        className={`flex flex-col lg:flex-row gap-8 ${
          imagePosition === "right" ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Image Section */}
        <div className="lg:w-1/2">
          <img
            src={image}
            alt={title}
            className="w-full h-80 object-cover object-center rounded-lg shadow-md hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={handleClick}
          />
        </div>

        {/* Content Section */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
          <div>
            <button
              onClick={handleClick}
              className={`${buttonColor} text-white py-3 px-8 rounded-lg transition-colors font-medium shadow-sm hover:shadow-md`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
