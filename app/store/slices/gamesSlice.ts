import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { itemApi } from "../../../lib/api-client";
import { transformGameData } from "../../../lib/utils";

export interface Game {
  id: number;
  title: string;
  image: string;
  platform: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  description?: string;
  category?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

interface GamesState {
  games: Game[];
  bestSellers: Game[];
  latestGames: Game[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
}

const initialState: GamesState = {
  games: [],
  bestSellers: [],
  latestGames: [],
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategory: "all",
};

// Async thunks for API calls
export const fetchGames = createAsyncThunk(
  "games/fetchGames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await itemApi.getAllItems();
      return response.map((item: any) => transformGameData(item));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  "games/fetchBestSellers",
  async (_, { rejectWithValue }) => {
    try {
      // ใช้ API ดึงข้อมูลเกมทั้งหมด แล้วกรองเป็น best sellers
      const response = await itemApi.getAllItems();
      // แปลงข้อมูลและกรองเกมที่มีราคาลด (มี originalPrice)
      const transformedItems = response.map((item: any) =>
        transformGameData(item)
      );
      const bestSellers = transformedItems.filter(
        (item: any) => item.originalPrice
      );
      return bestSellers;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const fetchLatestGames = createAsyncThunk(
  "games/fetchLatestGames",
  async (_, { rejectWithValue }) => {
    try {
      // ใช้ API ดึงข้อมูลเกมทั้งหมด แล้วกรองเป็น latest games
      const response = await itemApi.getAllItems();
      // แปลงข้อมูลและกรองเกมที่ใหม่ (เรียงตาม id ล่าสุด)
      const transformedItems = response.map((item: any) =>
        transformGameData(item)
      );
      const latestGames = transformedItems
        .sort((a: any, b: any) => b.id - a.id)
        .slice(0, 10);
      return latestGames;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Mock data actions for development
    setMockData: (state) => {
      state.bestSellers = [
        {
          id: 1,
          title: "No Man's Sky PC",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
          platform: "steam",
          price: 21.59,
          originalPrice: 53.99,
          discount: "60% Off",
          isBestSeller: true,
        },
        {
          id: 2,
          title: "NBA 2K26 Superstar Edition Xbox Series X|S",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.png",
          platform: "xbox",
          price: 89.99,
          originalPrice: 99.99,
          discount: "10% Off",
          isBestSeller: true,
        },
        {
          id: 3,
          title: "Hell is Us - Deluxe Edition PC",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co1q1f.webp",
          platform: "steam",
          price: 51.29,
          originalPrice: 78.99,
          discount: "35% Off",
          isBestSeller: true,
        },
      ];

      state.latestGames = [
        {
          id: 1,
          title: "Metal Gear Solid Δ: Snake Eater",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg",
          platform: "steam",
          price: 59.99,
          isNew: true,
        },
        {
          id: 2,
          title: "EA SPORTS Madden NFL 26",
          image:
            "https://images.igdb.com/igdb/image/upload/t_cover_small/co4jni.png",
          platform: "xbox",
          price: 69.99,
          isNew: true,
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Games
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.games = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Best Sellers
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Latest Games
      .addCase(fetchLatestGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestGames.fulfilled, (state, action) => {
        state.loading = false;
        state.latestGames = action.payload;
      })
      .addCase(fetchLatestGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearchQuery, setSelectedCategory, clearError, setMockData } =
  gamesSlice.actions;

export default gamesSlice.reducer;
