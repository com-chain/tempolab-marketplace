import SearchBar from "@/components/SearchBar";

export default function Hero({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  categories,
}) {
  return (
    <section className="bg-brand-light">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-14">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          La Place de Marché de Kultura
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600">
          Services et produits proposés par les associations membres de
          Kultura
        </p>

        <div className="mt-6 rounded-lg bg-white p-2 shadow-sm sm:mx-auto sm:max-w-2xl">
          <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={onSearchTermChange}
            selectedCategory={selectedCategory}
            onSelectedCategoryChange={onSelectedCategoryChange}
            categories={categories}
          />
        </div>
      </div>
    </section>
  );
}
