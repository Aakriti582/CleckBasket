import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Heart, Minus, Plus } from "lucide-react";
import { getProduct } from "../../api/endpoints/products";
import { useCart } from "../../hooks/useCart";
import { useAuthStore } from "../../store/authStore";
import CategorySidebar from "../../components/product/CategorySidebar";
import NewProductsWidget from "../../components/product/NewProductsWidget";

const reviews = [
  { title: "Review title", body: "Review body", name: "Reviewer name", date: "Date" },
  { title: "Review title", body: "Review body", name: "Reviewer name", date: "Date" },
  { title: "Review title", body: "Review body", name: "Reviewer name", date: "Date" },
];

export default function ProductDetails() {
  const { slug } = useParams();
  const [qty, setQty] = useState(1);
  const { addItem, isAdding } = useCart();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
  });

  if (isLoading) {
    return <p className="max-w-7xl mx-auto px-4 py-16 text-gray-400">Loading…</p>;
  }

  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Product not found.</p>
        <Link to="/shop" className="text-accent-green font-medium">
          Back to Shop
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const max = Math.min(product.max_order ?? 50, product.stock ?? 50);
  const min = product.min_order ?? 1;

  const changeQty = (delta) =>
    setQty((q) => Math.min(max, Math.max(min, q + delta)));

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addItem({ productId: product.id, quantity: qty });
    } catch {
      // could surface an error message here
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3 grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="bg-gray-50 rounded-card aspect-square flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-6"
              />
            ) : (
              <span className="text-gray-300">No image</span>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            <span className="inline-block mt-3 bg-primary-cream text-accent-dark text-xs font-semibold px-3 py-1 rounded-full">
              {product.category?.name}
            </span>

            <div className="flex items-center gap-1 mt-4 text-gray-300">
              {"★★★★★".split("").map((s, i) => (
                <span key={i} className={i < 4 ? "text-yellow-400" : ""}>
                  ★
                </span>
              ))}
              <span className="text-gray-400 text-sm ml-2">(reviews coming soon)</span>
            </div>

            <p className="text-4xl font-bold text-gray-900 mt-4">
              £{Math.floor(price)}
              <span className="text-lg">.{price.toFixed(2).split(".")[1]}</span>
              {product.unit !== "item" && (
                <span className="text-gray-500 font-normal text-lg"> / {product.unit}</span>
              )}
            </p>

            <p className="text-gray-500 mt-4 text-sm leading-relaxed">
              {product.description || "No description available."}
            </p>

            {!product.in_stock && (
              <p className="text-red-500 text-sm font-medium mt-4">Out of stock</p>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 mb-2">Quantity</p>
              <div className="inline-flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2">
                <button
                  onClick={() => changeQty(-1)}
                  disabled={qty <= min}
                  className="text-gray-500 hover:text-primary disabled:opacity-30"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button
                  onClick={() => changeQty(1)}
                  disabled={qty >= max}
                  className="text-gray-500 hover:text-primary disabled:opacity-30"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Min {min}, max {max} per order
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.in_stock || isAdding}
                className="bg-primary hover:bg-primary-light text-white font-semibold px-8 py-3 rounded-lg transition disabled:opacity-40"
              >
                {isAdding ? "Adding…" : "Add To Cart"}
              </button>
              <button className="flex items-center gap-2 bg-primary-cream hover:bg-primary/10 text-accent-dark font-medium px-6 py-3 rounded-lg transition">
                <Heart size={18} />
                Add To Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <CategorySidebar activeSlug={product.category?.slug} onSelect={() => {}} />
          <NewProductsWidget />
        </aside>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Latest reviews</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="border border-gray-200 rounded-card p-6">
              <div className="flex gap-1 text-gray-300">
                {"★★★★★".split("").map((s, j) => (
                  <span key={j}>★</span>
                ))}
              </div>
              <h3 className="font-bold text-gray-900 mt-4">{r.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{r.body}</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}