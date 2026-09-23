import SearchBar from "@/components/SearchBar";

export default function Hero({
  searchTerm,
  onSearchTermChange,
  selectedCategory,
  onSelectedCategoryChange,
  categories,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-light via-white to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6 sm:py-14">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Tu tiempo es tu moneda en{" "}
          <span style={{ color: "#0f766e" }}>tempo</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-600">
          Descubre servicios y productos ofrecidos por particulares y
          organizaciones locales, e intercambia sin usar dinero.
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
