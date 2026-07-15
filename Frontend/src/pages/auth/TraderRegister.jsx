import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerTrader } from "../../api/endpoints/auth";

const schema = z
  .object({
    full_name: z.string().min(2, "Name is required"),
    email: z.string().email("Enter a valid email"),
    company_name: z.string().min(2, "Company name is required"),
    company_registration_no: z.string().min(1, "Registration number is required"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirm_password: z.string(),
    terms: z.literal(true, {
      errorMap: () => ({ message: "You must agree to the terms" }),
    }),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export default function TraderRegister() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ terms, ...values }) => {
    setServerError("");
    try {
      await registerTrader(values);
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      setServerError(
        data?.email?.[0] ??
          data?.company_registration_no?.[0] ??
          "Registration failed."
      );
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900">Trader Registration</h1>
      <p className="text-sm mt-2 text-primary font-medium">
        Are you a Customer?{" "}
        <Link to="/register" className="text-accent-green">
          Register as a Customer here.
        </Link>
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md mt-10 space-y-5"
      >
        <div>
          <label className="block text-sm mb-1">Full Name</label>
          <input placeholder="Enter your full name" className={inputClass} {...register("full_name")} />
          {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Trader Email</label>
          <input type="email" placeholder="Enter your email" className={inputClass} {...register("email")} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Company Name</label>
          <input placeholder="Enter your company name" className={inputClass} {...register("company_name")} />
          {errors.company_name && <p className="text-red-500 text-xs mt-1">{errors.company_name.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Company Registration No.</label>
          <input placeholder="Enter your company registration number" className={inputClass} {...register("company_registration_no")} />
          {errors.company_registration_no && <p className="text-red-500 text-xs mt-1">{errors.company_registration_no.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" placeholder="Enter your password" className={inputClass} {...register("password")} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input type="password" placeholder="Re-enter your password" className={inputClass} {...register("confirm_password")} />
          {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password.message}</p>}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("terms")} />
            I agree to terms and conditions.
          </label>
          {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>}
        </div>

        {serverError && (
          <p className="text-red-600 text-sm bg-red-50 rounded-lg p-3">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition disabled:opacity-60"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}