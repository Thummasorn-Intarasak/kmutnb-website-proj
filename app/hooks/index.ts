import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState, AppDispatch } from "../store";
import { itemApi } from "../../lib/api";
import type { ApiItem } from "../types/card.types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook สำหรับดึงข้อมูล items จาก API
export const useItems = () => {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await itemApi.getAllItems();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch items");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return { items, loading, error };
};

// Hook สำหรับดึงข้อมูล item ตาม ID จาก API
export const useItemById = (id: number) => {
  const [item, setItem] = useState<ApiItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await itemApi.getItemById(id);
        setItem(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch item");
        console.error("Error fetching item:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  return { item, loading, error };
};
