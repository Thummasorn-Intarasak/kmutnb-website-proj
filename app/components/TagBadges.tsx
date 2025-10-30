"use client";

interface TagBadgesProps {
  tags?: unknown;
}

export default function TagBadges({ tags }: TagBadgesProps) {
  if (tags === undefined || tags === null) {
    return <span className="text-gray-500">-</span>;
  }

  let list: string[] = [];
  try {
    if (Array.isArray(tags)) {
      list = tags.map((t) => String(t).trim());
    } else if (typeof tags === "string") {
      const trimmed = tags.trim();
      // กรณีเป็น JSON array ในรูป string
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          list = parsed.map((t) => String(t).trim());
        } else {
          list = trimmed
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        }
      } else {
        list = trimmed
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
      }
    } else {
      // อื่นๆ แปลงเป็น string แล้ว split
      list = String(tags)
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
  } catch {
    list = String(tags)
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  }

  if (list.length === 0) return <span className="text-gray-500">-</span>;

  const visible = list.slice(0, 2);
  const remaining = list.length - visible.length;
  const tooltip = list.join(", ");

  return (
    <div className="flex items-center gap-2">
      {visible.map((t) => (
        <span
          key={t}
          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-300 border border-red-500/40"
        >
          {t}
        </span>
      ))}
      {remaining > 0 && (
        <span className="relative inline-block group">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-600/20 text-gray-300 border border-gray-500/40 cursor-default">
            +{remaining}
          </span>
          {/* Custom tooltip to ensure it works across browsers/mobile */}
          <span
            className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 max-w-xs whitespace-pre-line px-3 py-2 rounded-md bg-gray-900 text-gray-100 text-xs shadow-lg"
            role="tooltip"
          >
            {tooltip}
          </span>
        </span>
      )}
    </div>
  );
}
