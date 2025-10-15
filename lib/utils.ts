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
  return {
    id: apiGame.id,
    title: apiGame.game_name || apiGame.title || "Unknown Game",
    image: apiGame.game_image || apiGame.image || "/placeholder-game.jpg",
    platform: apiGame.platform || "steam",
    price: safeNumber(apiGame.price),
    originalPrice: apiGame.originalPrice
      ? safeNumber(apiGame.originalPrice)
      : undefined,
    discount: apiGame.discount || undefined,
    description: apiGame.description || undefined,
    category: apiGame.category || undefined,
    isNew: apiGame.isNew || false,
    isBestSeller: apiGame.isBestSeller || false,
  };
}

/**
 * แปลงข้อมูล banner จาก API ให้เข้ากับ interface ของ frontend
 */
export function transformBannerData(apiBanner: any) {
  return {
    id: apiBanner.id,
    title: apiBanner.title || "Untitled Banner",
    subtitle: apiBanner.subtitle || undefined,
    description: apiBanner.description || undefined,
    image: apiBanner.image || "/placeholder-banner.jpg",
    buttonText: apiBanner.buttonText || "Learn More",
    buttonColor: apiBanner.buttonColor || "#3b82f6",
    titleColor: apiBanner.titleColor || "#ffffff",
    backgroundColor:
      apiBanner.backgroundColor || "linear-gradient(135deg, #3b82f6, #1e40af)",
    isActive: apiBanner.isActive !== false,
    sortOrder: safeNumber(apiBanner.sortOrder),
  };
}
