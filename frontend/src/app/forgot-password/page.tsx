// src/app/forgot-password/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearError } from "@/redux/slices/authSlice";
import { RootState, AppDispatch } from "@/redux/store";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, message } = useSelector(
    (state: RootState) => state.auth
  ); // Assuming 'message' holds success responses

  useEffect(() => {
    // Clear any previous errors or messages when the component mounts
    dispatch(clearError());
    // Note: You might need a way to clear the success 'message' too,
    // perhaps with another action or by modifying clearError.
  }, [dispatch]);

  // Update success message based on Redux state
  useEffect(() => {
    if (message) {
      setSuccessMessage(message);
      setEmail(""); // Clear email field on success
    } else {
      setSuccessMessage(""); // Clear message if it's null/undefined
    }
  }, [message]);

  const validateForm = () => {
    if (!email) {
      setFormError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError("Email is invalid");
      return false;
    }
    setFormError(""); // Clear previous error
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(clearError()); // Clear previous API errors/messages before new request
    setSuccessMessage(""); // Clear previous success message

    if (validateForm()) {
      try {
        // Dispatch the forgotPassword action
        await dispatch(forgotPassword({ email }));
        // Success message will be handled by the useEffect hook monitoring 'message'
      } catch (err) {
        // Error will be handled by the useEffect hook monitoring 'error'
        console.error("Forgot password error:", err);
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
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your
          password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Display API Error */}
          {error && !successMessage && (
            <div
              className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          {/* Display Success Message */}
          {successMessage && (
            <div
              className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 text-green-700"
              role="alert"
            >
              <p>{successMessage}</p>
            </div>
          )}

          {/* Hide form after successful submission */}
          {!successMessage && (
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      formError ? "border-red-300" : "border-gray-300"
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm`}
                  />
                  {/* Display Validation Error */}
                  {formError && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {formError}
                    </p>
                  )}
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
                      Sending...
                    </>
                  ) : (
                    "Send Reset Instructions"
                  )}
                </button>
              </div>
            </form>
          )}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-pink-600 hover:text-pink-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
