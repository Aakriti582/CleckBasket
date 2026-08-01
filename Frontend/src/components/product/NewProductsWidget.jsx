import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../../api/endpoints/products";

export default function NewProductsWidget() {
  const { data } = useQuery({
    queryKey: ["products", "newest"],
    queryFn: () => getProducts({ ordering: "-created_at", page_size: 2 }),
  });

  const items = data?.results ?? [];
  if (!items.length) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-card p-5">
      <h3 className="font-semibold text-primary mb-4">New Products</h3>
      <div className="space-y-3">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5 hover:bg-gray-100 transition"
          >
            <div className="w-14 h-14 bg-white rounded-lg overflow-hidden shrink-0">
              {p.image && (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{p.name}</p>
              <p className="text-sm text-accent-dark font-bold">
                £{Number(p.price).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}