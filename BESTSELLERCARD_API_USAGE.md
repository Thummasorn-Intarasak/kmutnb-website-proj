# BestSellerCard API Integration

## ภาพรวม
BestSellerCard ได้รับการปรับปรุงให้สามารถดึงข้อมูลจาก API ของ items ได้แล้ว โดยมี 3 components หลัก:

1. `BestSellerCard` - Component เดิมที่ใช้ props
2. `BestSellerCardFromApi` - Component ใหม่ที่ใช้ข้อมูลจาก API
3. `BestSellerCardWithApi` - Component หลักที่จัดการ loading, error และแสดงรายการเกมจาก API

## การใช้งาน

### 1. BestSellerCard (Component เดิม)
```tsx
import BestSellerCard from "./BestSellerCard";

<BestSellerCard
  id={1}
  title="Game Title"
  image="/path/to/image.jpg"
  platform="Steam"
  discount="20%"
  originalPrice="฿99.99"
  price="฿79.99"
/>
```

### 2. BestSellerCardWithApi (Component ใหม่ที่ใช้ API)
```tsx
import { BestSellerCardWithApi } from "./BestSellerCard";

<BestSellerCardWithApi />
```

### 3. BestSellerCardFromApi (Component สำหรับ item เดียว)
```tsx
import { BestSellerCardFromApi } from "./BestSellerCard";

<BestSellerCardFromApi
  item={{
    id: 1,
    game_name: "Game Title",
    description: "Game description",
    price: 79.99,
    game_image: Buffer
  }}
  platform="Steam"
  discount="20%"
  originalPrice="฿99.99"
/>
```

## Features

### Loading State
- แสดง loading spinner ขณะดึงข้อมูลจาก API
- มีข้อความ "Loading..." แสดงสถานะ

### Error Handling
- แสดงข้อความ error หากการดึงข้อมูลล้มเหลว
- มี fallback image หากรูปภาพไม่สามารถโหลดได้

### Image Handling
- รองรับการแสดงรูปภาพจาก Buffer ที่ส่งมาจาก API
- ใช้ placeholder image หากไม่มีรูปภาพ

### Cart Integration
- รองรับการเพิ่มเกมลงตะกร้าผ่าน Redux
- แปลงข้อมูลจาก API ให้เข้ากับ cart slice

## API Structure

### ApiItem Interface
```typescript
interface ApiItem {
  id: number;
  game_name: string;
  description?: string;
  price: number;
  game_image?: Buffer;
}
```

### useItems Hook
```typescript
const { items, loading, error } = useItems();
```

## การติดตั้ง

1. ตรวจสอบว่า API endpoint `/api/items` ทำงานได้
2. ตรวจสอบว่า backend API ส่งข้อมูลในรูปแบบที่ถูกต้อง
3. Import component ที่ต้องการใช้

## ตัวอย่างการใช้งานใน MainContent

```tsx
// แสดง Best Sellers จาก API
<div className="mb-8">
  <h2 className="text-2xl font-bold text-gray-800">Best Sellers (จาก API)</h2>
  <BestSellerCardWithApi />
</div>

// แสดง Best Sellers จาก Mock Data
<div className="mb-8">
  <h2 className="text-2xl font-bold text-gray-800">Best Sellers (Mock Data)</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {bestSellers.map((game) => (
      <BestSellerCard key={game.id} {...game} />
    ))}
  </div>
</div>
```

## หมายเหตุ

- Component ใหม่จะดึงข้อมูลจาก API โดยอัตโนมัติเมื่อ mount
- รองรับการแสดงผลแบบ responsive grid
- มี error boundary และ loading state ที่สมบูรณ์
- รองรับการแสดงรูปภาพจาก Buffer ที่ส่งมาจาก backend
