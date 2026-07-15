import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import { loginUser } from "../../api/endpoints/auth";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const roleHome = {
  ADMIN: "/admin/dashboard",
  TRADER: "/trader/dashboard",
  CUSTOMER: "/",
};

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    setServerError("");
    try {
      const { data } = await loginUser(values);
      setAuth(data);
      navigate(roleHome[data.user.role] ?? "/");
    } catch (err) {
      setServerError(
        err.response?.data?.detail ?? "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="bg-white rounded-card shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-primary flex items-center gap-2">
          Log in <LogIn size={24} />
        </h1>
        <p className="text-gray-500 mt-2 mb-8">
          Welcome back to your curated organic pantry.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold tracking-wide text-primary mb-1">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="e.g. curator@organic.com"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold tracking-wide text-primary mb-1">
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white rounded-full py-3 font-medium tracking-wide hover:bg-primary-light transition disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "LOG IN"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary underline font-medium">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}