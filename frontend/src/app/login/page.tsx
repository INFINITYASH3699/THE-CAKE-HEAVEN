// src/app/login/page.tsx - Updated with Forgot Password Link

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "@/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Link from "next/link"; // Make sure Link is imported
import { LoginCredentials } from "@/types";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({ email: "", password: "" });

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Clear any previous errors/messages when component mounts or user state changes
    // Important: clearError now also clears the success message from forgot password
    dispatch(clearError());

    // Redirect if already logged in
    if (isAuthenticated && user) {
      // Check user role for redirection
      const userRole = typeof user.role === "string" ? user.role : "user"; // Default to 'user' if undefined
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/"); // Redirect regular users to home
      }
    }
    // Only run when isAuthenticated or user changes, plus initial mount dependencies
  }, [isAuthenticated, user, router, dispatch]);

  const validateForm = () => {
    let valid = true;
    const errors = { email: "", password: "" };

    if (!email) {
      errors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
      valid = false;
    }

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    }

    setFormErrors(errors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError()); // Clear previous errors before attempting login

    if (validateForm()) {
      try {
        const credentials: LoginCredentials = { email, password };
        // Dispatch login action. Redirection is handled by the useEffect hook.
        await dispatch(login(credentials)).unwrap(); // Using unwrap to potentially catch rejected promises here if needed
      } catch (err) {
        // Error is already set in the Redux state by the rejected thunk
        console.error("Login dispatch failed:", err);
        // No need to manually set error state here, Redux handles it
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-pink-500">
            Cake Heaven
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/register"
            className="font-medium text-pink-600 hover:text-pink-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div
              className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required // Added required attribute for basic HTML validation
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                  aria-describedby={
                    formErrors.email ? "email-error" : undefined
                  }
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600" id="email-error">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required // Added required attribute
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    formErrors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                  aria-describedby={
                    formErrors.password ? "password-error" : undefined
                  }
                />
                {formErrors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {formErrors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* Remember me functionality is not implemented in the state/logic */}
                {/* <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember_me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label> */}
              </div>

              <div className="text-sm">
                {/* --- UPDATED LINK --- */}
                <Link
                  href="/forgot-password" // Point to your forgot password page route
                  className="font-medium text-pink-600 hover:text-pink-500"
                >
                  Forgot your password?
                </Link>
                {/* --- END OF UPDATE --- */}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
