import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { bannerApi } from "../../../lib/api-client";
import { transformBannerData } from "../../../lib/utils";

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonColor?: string;
  titleColor?: string;
  backgroundColor?: string;
  isActive: boolean;
  sortOrder: number;
}

interface BannerState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchBanners = createAsyncThunk(
  "banners/fetchBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bannerApi.getAllBanners();
      return response.map((banner: any) => transformBannerData(banner));
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const createBanner = createAsyncThunk(
  "banners/createBanner",
  async (
    bannerData: {
      title: string;
      subtitle?: string;
      description?: string;
      image?: string;
      buttonText?: string;
      buttonColor?: string;
      titleColor?: string;
      backgroundColor?: string;
      isActive?: boolean;
      sortOrder?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await bannerApi.createBanner(bannerData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banners/updateBanner",
  async (
    {
      id,
      bannerData,
    }: {
      id: number;
      bannerData: {
        title?: string;
        subtitle?: string;
        description?: string;
        image?: string;
        buttonText?: string;
        buttonColor?: string;
        titleColor?: string;
        backgroundColor?: string;
        isActive?: boolean;
        sortOrder?: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await bannerApi.updateBanner(id, bannerData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banners/deleteBanner",
  async (id: number, { rejectWithValue }) => {
    try {
      await bannerApi.deleteBanner(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Unknown error"
      );
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Banners
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Banner
      .addCase(createBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners.push(action.payload);
      })
      .addCase(createBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Banner
      .addCase(updateBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBanner.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banners.findIndex(
          (banner) => banner.id === action.payload.id
        );
        if (index !== -1) {
          state.banners[index] = action.payload;
        }
      })
      .addCase(updateBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Banner
      .addCase(deleteBanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBanner.fulfilled, (state, action) => {
        state.loading = false;
        state.banners = state.banners.filter(
          (banner) => banner.id !== action.payload
        );
      })
      .addCase(deleteBanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bannerSlice.actions;

export default bannerSlice.reducer;
