import { useSearchParams } from "react-router-dom";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "../../api/endpoints/products";
import ProductCard from "../../components/product/ProductCard";
import CategorySidebar from "../../components/product/CategorySidebar";
import NewProductsWidget from "../../components/product/NewProductsWidget";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const page = Number(searchParams.get("page") ?? 1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", { category, search, page }],
    queryFn: () =>
      getProducts({
        ...(category && { category__slug: category }),
        ...(search && { search }),
        page,
      }),
    placeholderData: keepPreviousData,
  });

  const products = data?.results ?? [];
  const count = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / 12));

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) =>
      v == null ? next.delete(k) : next.set(k, v)
    );
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page heading */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-primary">
          {search
            ? `Search results for "${search}"`
            : category
            ? `${category.replace(/-/g, " ")} Products`.replace(/\b\w/g, (c) => c.toUpperCase())
            : "All Products"}
        </h1>
        {count > 0 && (
          <p className="text-sm text-gray-500 mt-1">{count} items found</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="space-y-6">
          <CategorySidebar
            activeSlug={category}
            onSelect={(slug) => updateParams({ category: slug, page: null })}
          />
          <NewProductsWidget />
        </aside>

        {/* Product grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <p className="text-gray-400">Loading products…</p>
          ) : isError ? (
            <p className="text-red-500">Couldn't load products. Is the server running?</p>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg">No products found.</p>
              {(search || category) && (
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-3 text-accent-green font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      onClick={() => updateParams({ page: n === 1 ? null : n })}
                      className={`w-9 h-9 rounded-full text-sm font-medium transition ${
                        n === page
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}