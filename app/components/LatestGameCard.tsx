import { LatestGameCardProps } from "../types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LatestGameCard({
  game_id,
  game_title,
  game_image,
  platform,
  game_price,
}: LatestGameCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="relative">
        <Link href={`/game/${game_id}`}>
          <img
            src={game_image}
            alt={game_title}
            className="w-full h-48 object-cover object-center rounded-lg mb-4 shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
      </div>

      <Link href={`/game/${game_id}`}>
        <h4 className="font-semibold text-gray-800 mb-2 text-sm leading-tight flex-grow cursor-pointer hover:text-blue-600 transition-colors">
          {game_title}
        </h4>
      </Link>

      <div className="mb-3">
        <span className="text-lg font-bold text-gray-800">{game_price}</span>
      </div>

      <button
        onClick={() => router.push(`/game/${game_id}`)}
        className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium mt-auto"
      >
        Buy
      </button>
    </div>
  );
}
