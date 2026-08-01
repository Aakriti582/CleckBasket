import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import Home from "./pages/customer/Home";
import Login from "./pages/auth/Login";
import CustomerRegister from "./pages/auth/CustomerRegister";
import TraderRegister from "./pages/auth/TraderRegister";
import ProtectedRoute from "./routes/ProtectedRoute";

import Shop from "./pages/customer/Shop";
import About from "./pages/customer/About";
import Contact from "./pages/customer/Contact";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no navbar/footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/register/trader" element={<TraderRegister />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Public pages with shared layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["TRADER"]} />}>
          <Route path="/trader/dashboard" element={<div>Trader Dashboard</div>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

