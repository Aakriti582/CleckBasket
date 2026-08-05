import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useAuthStore } from "../../store/authStore";

export default function ProductCard({ product }) {
  const price = Number(product.price);
  const { addItem, isAdding } = useCart();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await addItem({ productId: product.id, quantity: 1 });
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1500);
    } catch {
      // swallow — could surface a toast later
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-card overflow-hidden hover:shadow-md transition">
      <Link to={`/product/${product.slug}`} className="block bg-gray-50 aspect-square">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
            No image
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
        </Link>
        <p className="text-accent-dark font-bold mt-1">
          £{Math.floor(price)}
          <span className="text-sm">.{price.toFixed(2).split(".")[1]}</span>
          {product.unit !== "item" && (
            <span className="text-gray-500 font-normal text-sm"> / {product.unit}</span>
          )}
        </p>

        <div className="flex items-center justify-between mt-3">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.in_stock === false}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition disabled:opacity-50"
          >
            {isAdding ? "Adding…" : justAdded ? "✓ Added" : "Add to Cart"}
          </button>
          <button className="text-gray-300 hover:text-red-400 transition">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}