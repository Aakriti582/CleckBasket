import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/endpoints/products";

export default function CategorySidebar({ activeSlug, onSelect }) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <div className="bg-white border border-gray-100 rounded-card p-5">
      <h3 className="font-semibold text-primary mb-4">Shop By Category</h3>
      <div className="space-y-2">
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(isActive ? null : cat.slug)}
              className={`w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-dark text-white"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.icon ? (
                <img src={cat.icon} alt="" className="w-6 h-6 object-contain" />
              ) : (
                <span>🧺</span>
              )}
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}