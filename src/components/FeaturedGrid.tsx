"use client";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";

export default function FeaturedGrid() {
  const { products, categories } = useStore();
  const featured = products.filter((p) => p.featured);
  const shown = (featured.length ? featured : products).slice(0, 8);
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {shown.map((p) => <ProductCard key={p.id} p={p} category={categories.find((c) => c.id === p.categoryId)?.name} />)}
    </div>
  );
}
