import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCategories, getProducts } from "../../api/endpoints/products";
import ProductCard from "../../components/product/ProductCard";
import heroImg from "../../assets/hero.png";

export default function Home() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => getProducts({ ordering: "-created_at" }),
  });

  const productList = products?.results ?? products ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide text-gray-700">
              FRESH, LOCAL, YOURS.
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 leading-tight">
              Your Neighborhood <br />
              <span className="font-semibold">Market, </span>
              <span className="font-normal">Online</span>
            </h1>
            <p className="text-gray-500 mt-4 max-w-sm text-sm">
              Shop from your favorite local traders online and pick up fresh
              goods, close by.
            </p>
            <Link
              to="/shop"
              className="inline-block mt-8 bg-accent-green/80 hover:bg-accent-green text-white font-semibold px-8 py-3 rounded-lg transition"
            >
              SHOP NOW
            </Link>
          </div>
          <div className="hidden md:flex justify-end">
              <img src={heroImg} alt="Fresh groceries" className="max-h-80 object-contain" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Categories</h2>
          <Link to="/shop" className="text-accent-green text-sm font-medium">
            See all
          </Link>
        </div>
        <div className="flex flex-wrap gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden group-hover:ring-2 group-hover:ring-accent-green transition">
                {cat.icon ? (
                  <img src={cat.icon} alt={cat.name} className="w-10 h-10 object-contain" />
                ) : (
                  <span className="text-2xl">🧺</span>
                )}
              </div>
              <span className="text-xs text-gray-600">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-primary">Featured Products</h2>
          <Link to="/shop" className="text-accent-green font-medium">See all</Link>
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading products…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
    
  );
}