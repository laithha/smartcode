export const LANG_COLORS: Record<string, { color: string; bg: string; accent: string }> = {
    python:     { color: "#3b82f6", bg: "#eff6ff", accent: "#3b82f6" },
    javascript: { color: "#d97706", bg: "#fffbeb", accent: "#f59e0b" },
    java:       { color: "#dc2626", bg: "#fef2f2", accent: "#ef4444" },
    c:          { color: "#7c3aed", bg: "#f5f3ff", accent: "#8b5cf6" },
    cpp:        { color: "#0891b2", bg: "#ecfeff", accent: "#06b6d4" },
};

export const DIFF_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
    beginner:     { color: "#16a34a", bg: "#f0fdf4", dot: "#22c55e" },
    intermediate: { color: "#d97706", bg: "#fffbeb", dot: "#f59e0b" },
    advanced:     { color: "#dc2626", bg: "#fef2f2", dot: "#ef4444" },
};

export const langConf = (l: string) =>
    LANG_COLORS[l?.toLowerCase()] ?? { color: "#6366f1", bg: "#eef2ff", accent: "#6366f1" };

export const diffConf = (d: string) =>
    DIFF_CONFIG[d?.toLowerCase()] ?? { color: "#6b7280", bg: "#f9fafb", dot: "#9ca3af" };
