import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import CustomerRegister from "./pages/auth/CustomerRegister";
import TraderRegister from "./pages/auth/TraderRegister";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/register/trader" element={<TraderRegister />} />

        {/* placeholders for now */}
        <Route path="/" element={<div>Home (customer)</div>} />

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