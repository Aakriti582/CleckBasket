import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-accent-green" />
          <span className="font-bold text-sm">
            <span className="text-primary">CLECK</span> BASKET
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-6 text-xs tracking-wide text-gray-500">
          <Link to="/privacy" className="hover:text-primary">PRIVACY POLICY</Link>
          <Link to="/terms" className="hover:text-primary">TERMS OF SERVICE</Link>
          <Link to="/shipping" className="hover:text-primary">SHIPPING INFO</Link>
          <Link to="/wholesale" className="hover:text-primary">WHOLESALE</Link>
        </nav>

        <p className="text-xs text-gray-400">
          © 2026 CLECKBASKET ORGANIC CURATORS.
        </p>
      </div>
    </footer>
  );
}