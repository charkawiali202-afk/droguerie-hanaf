"use client";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";

export default function Featured() {
  const { products, categories } = useStore();
  const list = products.filter((p) => p.featured).slice(0, 8);
  const shown = list.length ? list : products.slice(0, 8);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {shown.map((p) => <ProductCard key={p.id} p={p} category={categories.find((c) => c.id === p.categoryId)?.name} />)}
    </div>
  );
}
