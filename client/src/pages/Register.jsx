import React, { useState } from "react";
import { MdOutlineSignalCellularAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { TbTargetArrow } from "react-icons/tb";
import { RiSecurePaymentFill } from "react-icons/ri";
import RegisterImage from "../assets/image1.png";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  // Submit signup form
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
        "http://localhost:3000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          api: data.message || "Registration failed",
        });

        return;
      }

      // Signup successful
      alert("Account created successfully!");

      console.log("Signup response:", data);

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setErrors({});

    } catch (error) {
      console.error("Signup error:", error);

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
        ), url(${RegisterImage})`,
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 underline decoration-blue-600"
            >
              Sign in
            </Link>
          </p>
        </div>
      </nav>

      {/* Main */}
      <main className="flex px-10 py-6 w-full">
        {/* Left Section */}
        <div className="h-[90%] w-[60%]">
          <h1 className="bg-blue-50 text-blue-700 w-[20%] mt-[5%] whitespace-nowrap">
            SMART FINANCE, BRIGHTER TOMORROW
          </h1>

          <h2 className="text-5xl font-bold mt-[4%]">
            Take Control <br />
            of Your Money
            <br />
            Today
          </h2>

          <p className="text-gray-400 mt-[2%]">
            Track your expenses, manage budgets,
            <br />
            set goals, and build a better financial future
            <br />
            --- all in one place.
          </p>

          <div className="flex flex-col">
            {/* Feature 1 */}
            <div className="flex gap-4 mt-[2%]">
              <MdOutlineSignalCellularAlt className="text-green-500 bg-green-300 text-4xl rounded-2xl" />

              <span>
                <p className="font-bold">Track Spending</p>
                <p>Know where your money goes</p>
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4 mt-[1%]">
              <TbTargetArrow className="text-blue-500 bg-blue-300 text-4xl rounded-2xl" />

              <span>
                <p className="font-bold">Set Financial Goals</p>
                <p>Save for what matters</p>
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4 mt-[1%]">
              <RiSecurePaymentFill className="text-green-500 bg-green-300 text-4xl rounded-2xl" />

              <span>
                <p className="font-bold">Stay secure</p>
                <p>Your data is always protected</p>
              </span>
            </div>
          </div>
        </div>

        {/* Register Form */}
        <div className="h-[90%] w-[40%] py-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg w-[70%] flex flex-col gap-3 px-5"
          >
            <p className="text-2xl font-bold px-5">
              Create your account
            </p>

            <p className="px-5">
              Join FinTrack and start your journey towards
              <br />
              financial freedom
            </p>

            {/* API Error */}
            {errors.api && (
              <p className="text-red-500 text-sm text-center">
                {errors.api}
              </p>
            )}

            {/* Full Name */}
            <div className="relative flex flex-col">
              <FaRegUserCircle className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" />

              <label
                htmlFor="fullname"
                className="text-md font-medium text-slate-700"
              >
                Full Name
              </label>

              <input
                type="text"
                placeholder="Full name"
                name="name"
                id="fullname"
                value={formData.name}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-10 py-2 outline-none focus:border-blue-500"
              />

              {errors.name && (
                <p className="text-red-500 text-sm">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative flex flex-col">
              <MdOutlineMailOutline className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" />

              <label
                htmlFor="email"
                className="text-md font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-10 py-2 outline-none focus:border-blue-500"
              />

              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative flex flex-col">
              <CiLock className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" />

              <label
                htmlFor="password"
                className="text-md font-medium text-slate-700"
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-10 py-2 outline-none focus:border-blue-500"
              />

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative flex flex-col">
              <CiLock className="absolute left-3 top-2/3 -translate-y-1/2 text-gray-400" />

              <label
                htmlFor="confirmPassword"
                className="text-md font-medium text-slate-700"
              >
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="rounded-lg border border-slate-300 px-10 py-2 outline-none focus:border-blue-500"
              />

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex gap-2">
              <input type="checkbox" required />

              <p>
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 underline decoration-blue-600"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 underline decoration-blue-600"
                >
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-3 rounded-b-lg disabled:bg-blue-300"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

            {/* OR */}
            <div className="flex gap-2">
              <p>_______________________</p>

              <span className="translate-y-2 px-6">
                OR
              </span>

              <p>______________________</p>
            </div>

            {/* Login */}
            <div className="flex justify-center gap-2 text-black">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 underline decoration-blue-600"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Register;