"use client";

export default function SearchBar({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  categories,
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
        placeholder="Rechercher un produit..."
        className="w-full flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-brand focus:outline-none"
      />
      <select
        value={selectedCategory}
        onChange={(event) => onSelectedCategoryChange(event.target.value)}
        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-brand focus:outline-none sm:w-56"
      >
        <option value="">Toutes les catégories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
