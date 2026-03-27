"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/config/navigation";

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  function handleClick(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    params.delete("page");
    router.push(`/noticias?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => handleClick(null)}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          !activeCategory
            ? "bg-accent text-white"
            : "bg-dark-card text-text-secondary border border-dark-border hover:bg-dark-hover hover:text-text-primary"
        }`}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleClick(cat.slug)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            activeCategory === cat.slug
              ? "text-white"
              : "bg-dark-card text-text-secondary border border-dark-border hover:bg-dark-hover hover:text-text-primary"
          }`}
          style={
            activeCategory === cat.slug
              ? { backgroundColor: cat.color }
              : undefined
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
