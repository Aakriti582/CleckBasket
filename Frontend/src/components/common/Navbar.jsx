import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Bell, Heart, User, Menu } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { logoutUser } from "../../api/endpoints/auth";


const navLinkClass = ({ isActive }) =>
  `font-medium whitespace-nowrap transition ${
    isActive ? "text-accent-green" : "text-gray-800 hover:text-primary"
  }`;


export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/shop?search=${encodeURIComponent(search)}`);
  };

  
  const handleLogout = async () => {
  await logoutUser();
  logout();
  navigate("/login");
};

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-[72px] flex items-center gap-6">
        <button className="lg:hidden text-gray-700">
          <Menu size={22} />
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <ShoppingCart size={28} className="text-accent-green" />
          <div className="leading-tight">
            <span className="font-extrabold text-lg">
              <span className="text-primary">CLECK</span>{" "}
              <span className="text-gray-900">BASKET</span>
            </span>
            <p className="text-[9px] tracking-[0.2em] text-gray-500">
              — SHOP LOCAL • EAT FRESH —
            </p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-8 ml-4">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/shop" className={navLinkClass}>Shop</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          <NavLink to="/contact" className={navLinkClass}>Contact Us</NavLink>
        </nav>
        

        {/* Search */}
        <form
          onSubmit={onSearch}
          className="hidden md:flex flex-1 max-w-md ml-auto items-center bg-purple-50 rounded-full pl-5 pr-1 py-1"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="What do you need today?"
            className="flex-1 bg-transparent text-sm text-gray-600 placeholder-gray-400 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-accent-green text-white rounded-lg p-2 hover:opacity-90 transition"
          >
            <Search size={16} />
          </button>
        </form>

        {/* User area */}
        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <Link to="/profile" className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary">
                <User size={20} />
                <span className="hidden sm:inline">Hi, {user.full_name.split(" ")[0]}!</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-accent-green font-semibold text-sm">
              Sign In
            </Link>
          )}

          <Link to="/cart" className="relative text-gray-700 hover:text-primary">
            <ShoppingCart size={21} />
          </Link>
          <button className="relative text-gray-700 hover:text-primary">
            <Bell size={21} />
          </button>
          <Link to="/wishlist" className="text-gray-700 hover:text-primary">
            <Heart size={21} />
          </Link>
        </div>
      </div>
    </header>
  );
}
