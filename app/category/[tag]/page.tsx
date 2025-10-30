"use client";

import { useEffect, useMemo, useState, use as usePromise } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { itemApi } from "../../../lib/api-client";
import { BestSellerCardFromApi } from "../../components/BestSellerCard";
import { ApiItem } from "../../types";

interface PageProps {
  params: Promise<{ tag: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [games, setGames] = useState<{ item: ApiItem; tags: string[] }[]>([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const { tag } = usePromise(params);

  const normalizedParam = useMemo(() => {
    // แปลง tag จาก URL เป็นรูปแบบเปรียบเทียบง่าย
    return tag.replace(/-/g, " ").toLowerCase();
  }, [tag]);

  const pageTitle = useMemo(() => {
    const mapping: Record<string, string> = {
      fps: "FPS",
      "open world": "Open World",
      multiplayer: "Multiplayer",
      action: "Action",
      indie: "Indie",
      rpg: "RPG",
      horror: "Horror",
    };
    return mapping[normalizedParam] || tag;
  }, [normalizedParam, tag]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = (await itemApi.getAllItems()) as ApiItem[];

        const matchTag = (value: string) => {
          const v = value.toLowerCase();
          // จับคู่ sci-fi / sci fi / scifi
          if (normalizedParam === "sci fi") {
            return (
              v.includes("sci-fi") ||
              v.includes("sci fi") ||
              v.includes("scifi")
            );
          }
          return v.includes(normalizedParam);
        };

        const parseTagsToArray = (raw: ApiItem["game_tag"]): string[] => {
          if (!raw) return [];
          try {
            if (Array.isArray(raw)) {
              return (raw as string[])
                .map((t) => String(t).trim())
                .filter((s) => s.length > 0);
            }
            if (typeof raw === "string") {
              const trimmed = raw.trim();
              if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
                const parsed: unknown = JSON.parse(trimmed);
                if (Array.isArray(parsed)) {
                  return (parsed as unknown[])
                    .map((t) => String(t).trim())
                    .filter((s) => s.length > 0);
                }
                return [];
              }
              return trimmed
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);
            }
          } catch {
            return String(raw as string)
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t.length > 0);
          }
          return [];
        };

        const filtered = (items || []).filter((it: ApiItem) => {
          const raw = it.game_tag;
          const tags = parseTagsToArray(raw);
          return tags.some((t) => matchTag(t));
        });

        const prepared = filtered.map((it: ApiItem) => ({
          item: it,
          tags: parseTagsToArray(it.game_tag),
        }));
        if (mounted) setGames(prepared);
      } catch (e) {
        if (mounted)
          setError(e instanceof Error ? e.message : "เกิดข้อผิดพลาด");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [normalizedParam]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {pageTitle}
            </h1>

            {loading && (
              <div className="text-gray-600">กำลังโหลดรายการเกม...</div>
            )}
            {error && (
              <div className="text-red-600">เกิดข้อผิดพลาด: {error}</div>
            )}

            {!loading && !error && games.length === 0 && (
              <div className="text-gray-600">ไม่พบเกมในหมวดนี้</div>
            )}

            {!loading && !error && games.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map(({ item }) => (
                  <div key={item.game_id} className="space-y-2">
                    <BestSellerCardFromApi item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
