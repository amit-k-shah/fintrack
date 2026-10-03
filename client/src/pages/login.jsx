import { useState } from "react";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/image2.png";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (!response.ok) {
        setErrors({
          api: data.message || "Login failed",
        });
        return;
      }

      if (data.success) {
        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        console.log(
          "Saved user:",
          localStorage.getItem("user")
        );

        alert("Login successful!");

        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        api: "Unable to connect to the server",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(
          rgba(255, 255, 255, 0.5),
          rgba(255, 255, 255, 0.5)
        ), url(${loginImage})`,
      }}
    >
      {/* Navbar */}
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <MdOutlineSignalCellularAlt className="text-white text-2xl" />

          <h1 className="text-black text-2xl font-bold">
            Fin<span className="text-blue-500">Track</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 text-black">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 underline decoration-blue-600"
            >
              Sign up
            </Link>
          </p>
        </div>
      </nav>

      {/* Login Container */}
      <div className="flex min-h-[90vh] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-slate-700">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue to your FinTrack account
          </p>

          {/* API Error */}
          {errors.api && (
            <p className="mt-4 text-center text-sm text-red-500">
              {errors.api}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-5"
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="email"
              >
                Email
              </label>

              <input
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none focus:border-blue-500"
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />

              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-medium text-slate-700"
                htmlFor="password"
              >
                Password
              </label>

              <input
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-black outline-none focus:border-blue-500"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />

              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                />

                <label
                  className="text-sm text-slate-600"
                  htmlFor="remember"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-lg bg-blue-600 font-medium text-white transition hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;