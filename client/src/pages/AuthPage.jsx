import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login, signup } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      let result;

      if (isSignup) {
        const signupData = {
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        };
        result = await signup(signupData);
      } else {
        const loginData = {
          email: data.email,
          password: data.password,
        };
        result = await login(loginData);
      }

      console.log(`${isSignup ? "Signup" : "Login"} success:`, result);

      if (result.token && result.user) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        navigate("/");
      } else {
        setError("Authentication failed - no token received");
      }

      reset();
    } catch (err) {
      console.error("Auth failed:", err);
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] bg-gray-900 text-white flex items-center justify-center px-4 py-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm bg-gray-800 p-6 rounded-lg border border-gray-700"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-white">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

        {error && (
          <div className="mb-3 p-2 rounded bg-red-900/20 border border-red-700 text-red-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {isSignup && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Username
              </label>
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: {
                    value: 2,
                    message: "Username must be at least 2 characters",
                  },
                })}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm
                         focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-400 text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
              })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm
                       focus:outline-none focus:border-green-500 transition-colors"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm
                       focus:outline-none focus:border-green-500 transition-colors"
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {isSignup && (
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white text-sm
                         focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded 
                   transition-colors mt-4 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="text-center text-gray-400 text-xs mt-4 pt-3 border-t border-gray-700">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              reset();
              setError("");
            }}
            className="text-green-400 hover:text-green-300 font-medium"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}
