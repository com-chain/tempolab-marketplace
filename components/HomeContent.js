"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/components/Hero";
import ProductFilters from "@/components/ProductFilters";
import ProductGrid from "@/components/ProductGrid";
import MembersSection from "@/components/MembersSection";
import { categories, categoryTree } from "@/data/categories";
import { members } from "@/data/members";

function productMatchesCategory(productCategory, selectedCategory) {
  if (productCategory === selectedCategory) return true;
  const parent = categoryTree.find(
    (category) => category.name === selectedCategory
  );
  return parent ? parent.subs.includes(productCategory) : false;
}

const DEFAULT_FILTERS = {
  minPrice: "",
  maxPrice: "",
  type: "",
  shippingOnly: false,
  location: "",
  sellerId: "",
};

function HomeContentInner({ products }) {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        selectedCategory &&
        !productMatchesCategory(product.category, selectedCategory)
      ) {
        return false;
      }
      if (!product.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.minPrice && product.price < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && product.price > Number(filters.maxPrice)) {
        return false;
      }
      if (filters.type && product.type !== filters.type) {
        return false;
      }
      if (filters.shippingOnly && !product.shippingAvailable) {
        return false;
      }
      if (filters.location && product.location !== filters.location) {
        return false;
      }
      if (filters.sellerId && product.owner.id !== filters.sellerId) {
        return false;
      }
      return true;
    });
  }, [products, searchTerm, selectedCategory, filters]);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <Hero
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={setSelectedCategory}
        categories={categories}
      />
      <ProductFilters
        products={products}
        filters={filters}
        onChange={setFilters}
      />
      <ProductGrid products={filteredProducts} />
      <MembersSection members={members} />
    </div>
  );
}

export default function HomeContent({ products }) {
  return (
    <Suspense fallback={null}>
      <HomeContentInner products={products} />
    </Suspense>
  );
}
