// Utility functions for data transformation and formatting

/**
 * แปลงค่าเป็น number และจัดการกับ null/undefined
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined || value === "") {
    return defaultValue;
  }

  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

/**
 * แปลงราคาเป็นรูปแบบเงิน
 */
export function formatPrice(price: any, currency: string = "฿"): string {
  const safePrice = safeNumber(price);
  return `${currency}${safePrice.toFixed(2)}`;
}

/**
 * แปลงราคาเดิมเป็นรูปแบบเงิน (ถ้ามี)
 */
export function formatOriginalPrice(
  originalPrice: any,
  currency: string = "฿"
): string | undefined {
  if (!originalPrice) return undefined;
  const safePrice = safeNumber(originalPrice);
  return safePrice > 0 ? `${currency}${safePrice.toFixed(2)}` : undefined;
}

/**
 * แปลงข้อมูลเกมจาก API ให้เข้ากับ interface ของ frontend
 */
export function transformGameData(apiGame: any) {
  // จัดการ game_image ที่อาจเป็น JSON array
  let imageUrl = "/placeholder-game.jpg";

  if (apiGame.game_image) {
    try {
      // ลอง parse เป็น JSON array (กรณีหลายรูป)
      const parsed = JSON.parse(apiGame.game_image);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // เอารูปแรกมา (path จะเป็น uploads/games/{game-slug}/filename.jpg)
        const firstImage = parsed[0];
        imageUrl = firstImage.startsWith("uploads/")
          ? `http://localhost:3002/${firstImage}`
          : firstImage;
      }
    } catch (error) {
      // parse ไม่ได้ แสดงว่าเป็น string เดียว (รูปเดียว)
      if (typeof apiGame.game_image === "string") {
        // path จะเป็น uploads/games/{game-slug}/filename.jpg
        imageUrl = apiGame.game_image.startsWith("uploads/")
          ? `http://localhost:3002/${apiGame.game_image}`
          : apiGame.game_image;
      }
    }
  } else if (apiGame.image) {
    imageUrl = apiGame.image;
  }

  return {
    id: apiGame.game_id || apiGame.id,
    title: apiGame.game_name || apiGame.title || "Unknown Game",
    image: imageUrl,
    platform: apiGame.platform || "steam",
    price: safeNumber(apiGame.game_price || apiGame.price),
    originalPrice: apiGame.originalPrice
      ? safeNumber(apiGame.originalPrice)
      : undefined,
    discount: apiGame.discount || undefined,
    description: apiGame.game_description || apiGame.description || undefined,
    category: apiGame.category || undefined,
    isNew: apiGame.isNew || false,
    isBestSeller: apiGame.isBestSeller || false,
  };
}

/**
 * แปลงข้อมูล banner จาก API ให้เข้ากับ interface ของ frontend
 */
export function transformBannerData(apiBanner: any) {
  // จัดการ banner_image URL (path จะเป็น uploads/banners/filename.jpg)
  let imageUrl = "/placeholder-banner.jpg";
  if (apiBanner.banner_image) {
    imageUrl = apiBanner.banner_image.startsWith("uploads/")
      ? `http://localhost:3002/${apiBanner.banner_image}`
      : apiBanner.banner_image;
  }

  // จัดการ game.game_image ถ้ามี (path จะเป็น uploads/games/{game-slug}/filename.jpg)
  let gameImageUrl = "/placeholder-game.jpg";
  if (apiBanner.game?.game_image) {
    try {
      const parsed = JSON.parse(apiBanner.game.game_image);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const firstImage = parsed[0];
        gameImageUrl = firstImage.startsWith("uploads/")
          ? `http://localhost:3002/${firstImage}`
          : firstImage;
      }
    } catch {
      if (typeof apiBanner.game.game_image === "string") {
        gameImageUrl = apiBanner.game.game_image.startsWith("uploads/")
          ? `http://localhost:3002/${apiBanner.game.game_image}`
          : apiBanner.game.game_image;
      }
    }
  }

  return {
    banner_id: apiBanner.banner_id,
    banner_name: apiBanner.banner_name,
    banner_image: imageUrl,
    game_id: apiBanner.game_id,
    game: apiBanner.game
      ? {
          game_id: apiBanner.game.game_id,
          game_name: apiBanner.game.game_name,
          game_description: apiBanner.game.game_description,
          game_price: safeNumber(apiBanner.game.game_price),
          game_image: gameImageUrl,
        }
      : undefined,
  };
}
