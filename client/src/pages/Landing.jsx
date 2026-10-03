import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartPie,
  FaWallet,
  FaBullseye,
  FaShieldAlt,
  FaCheckCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: <FaWallet />,
      title: "Track Expenses",
      description:
        "Keep track of your daily income and expenses in one simple place.",
    },
    {
      icon: <FaChartPie />,
      title: "Smart Analytics",
      description:
        "Understand where your money goes with clear financial insights.",
    },
    {
      icon: <FaBullseye />,
      title: "Set Financial Goals",
      description:
        "Create goals and track your progress toward achieving them.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Secure & Private",
      description:
        "Your financial information stays protected and private.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="h-20 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-200">
                F
              </div>

              <span className="text-2xl font-bold text-slate-900">
                Fin<span className="text-blue-600">Track</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a
                href="#home"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                Home
              </a>

              <a
                href="#features"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                How It Works
              </a>

              <a
                href="#about"
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
              >
                About
              </a>
            </nav>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-xl text-slate-700"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="md:hidden pb-6 border-t border-slate-100">
              <div className="flex flex-col gap-4 pt-5">

                <a
                  href="#home"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-600 font-medium"
                >
                  Home
                </a>

                <a
                  href="#features"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-600 font-medium"
                >
                  Features
                </a>

                <a
                  href="#how-it-works"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-600 font-medium"
                >
                  How It Works
                </a>

                <a
                  href="#about"
                  onClick={() => setMenuOpen(false)}
                  className="text-slate-600 font-medium"
                >
                  About
                </a>

                <div className="flex gap-3 pt-2">
                  <Link
                    to="/login"
                    className="flex-1 text-center py-3 rounded-xl border border-slate-200 font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= HERO ================= */}
      <main id="home">

        <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 bg-gradient-to-br from-blue-50 via-white to-slate-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <div className="grid lg:grid-cols-2 gap-14 items-center">

              {/* Hero Text */}
              <div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
                  <FaCheckCircle />
                  Take control of your finances
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-slate-900">
                  Manage Your Money.
                  <span className="block text-blue-600">
                    Build Your Future.
                  </span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                  FinTrack helps you track expenses, manage budgets, analyze
                  spending and achieve your financial goals — all in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mt-9">

                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                  >
                    Start Tracking
                    <FaArrowRight className="group-hover:translate-x-1 transition" />
                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-7 py-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:border-blue-300 hover:text-blue-600 transition"
                  >
                    Sign In
                  </Link>

                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Easy to use
                  </span>

                  <span className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    Secure
                  </span>

                  <span className="flex items-center gap-2">
                    <FaCheckCircle className="text-green-500" />
                    All-in-one
                  </span>
                </div>

              </div>

              {/* Dashboard Preview */}
              <div className="relative">

                <div className="absolute -top-10 -right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-40" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-40" />

                <div className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">

                  {/* Dashboard Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">
                        Total Balance
                      </p>

                      <h3 className="text-2xl font-bold text-slate-900">
                        ₹84,250.00
                      </h3>
                    </div>

                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FaWallet />
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="grid grid-cols-2 gap-4 p-6">

                    <div className="p-5 rounded-2xl bg-blue-600 text-white">
                      <p className="text-sm text-blue-100">
                        Income
                      </p>

                      <h4 className="text-2xl font-bold mt-2">
                        ₹52,500
                      </h4>

                      <p className="text-xs text-blue-100 mt-2">
                        +12.5% this month
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-100">
                      <p className="text-sm text-slate-500">
                        Expenses
                      </p>

                      <h4 className="text-2xl font-bold mt-2 text-slate-900">
                        ₹28,250
                      </h4>

                      <p className="text-xs text-green-600 mt-2">
                        -8.2% this month
                      </p>
                    </div>

                  </div>

                  {/* Chart */}
                  <div className="px-6 pb-6">

                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <h4 className="font-bold text-slate-900">
                          Spending Overview
                        </h4>

                        <p className="text-xs text-slate-400">
                          Last 7 months
                        </p>
                      </div>

                      <span className="text-xs font-semibold text-blue-600">
                        2026
                      </span>
                    </div>

                    <div className="h-40 flex items-end gap-3">
                      {[45, 70, 55, 85, 60, 95, 72].map(
                        (height, index) => (
                          <div
                            key={index}
                            className="flex-1 flex items-end h-full"
                          >
                            <div
                              style={{ height: `${height}%` }}
                              className={`w-full rounded-t-lg ${
                                index === 5
                                  ? "bg-blue-600"
                                  : "bg-blue-100"
                              }`}
                            />
                          </div>
                        )
                      )}
                    </div>

                    <div className="flex justify-between mt-3 text-xs text-slate-400">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                    </div>

                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <div className="text-center max-w-2xl mx-auto">

              <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">
                Everything You Need
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                Your finances, simplified.
              </h2>

              <p className="mt-5 text-slate-500 text-lg">
                Everything you need to understand, manage and improve your
                financial life.
              </p>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-7 rounded-2xl border border-slate-100 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition duration-300"
                >

                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-6">
                    {feature.title}
                  </h3>

                  <p className="text-slate-500 mt-3 leading-relaxed">
                    {feature.description}
                  </p>

                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section
          id="how-it-works"
          className="py-24 bg-slate-50"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <div className="text-center max-w-2xl mx-auto">

              <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">
                Simple Process
              </span>

              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-3">
                Start managing your money
              </h2>

            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-14">

              {[
                {
                  number: "01",
                  title: "Create Your Account",
                  text: "Sign up and create your personal FinTrack account.",
                },
                {
                  number: "02",
                  title: "Track Your Money",
                  text: "Add your income and expenses to keep everything organized.",
                },
                {
                  number: "03",
                  title: "Reach Your Goals",
                  text: "Analyze your spending and work toward your financial goals.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  className="relative bg-white p-8 rounded-2xl border border-slate-100"
                >

                  <span className="text-6xl font-extrabold text-blue-50">
                    {item.number}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 mt-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-500 mt-3 leading-relaxed">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
              F
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-6">
              Financial clarity starts with FinTrack.
            </h2>

            <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-500 leading-relaxed">
              FinTrack brings your income, expenses, budgets, analytics and
              financial goals together so you can make better-informed
              financial decisions.
            </p>

          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="py-24 bg-blue-600">
          <div className="max-w-4xl mx-auto px-6 text-center">

            <h2 className="text-4xl md:text-5xl font-extrabold text-white">
              Ready to take control?
            </h2>

            <p className="text-blue-100 text-lg mt-5 max-w-2xl mx-auto">
              Start tracking your finances and build better money habits
              today.
            </p>

            <Link
              to="/register"
              className="inline-flex items-center gap-3 mt-8 px-8 py-4 rounded-xl bg-white text-blue-600 font-bold hover:bg-blue-50 transition shadow-xl"
            >
              Create Free Account
              <FaArrowRight />
            </Link>

          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400">

        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">

          <div className="grid md:grid-cols-4 gap-10">

            <div className="md:col-span-2">

              <div className="flex items-center gap-2">

                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  F
                </div>

                <span className="text-2xl font-bold text-white">
                  Fin<span className="text-blue-500">Track</span>
                </span>

              </div>

              <p className="mt-5 max-w-md leading-relaxed">
                A simple personal finance platform designed to help you track,
                manage and improve your financial life.
              </p>

            </div>

            <div>
              <h4 className="text-white font-bold mb-4">
                Product
              </h4>

              <div className="flex flex-col gap-3 text-sm">

                <a
                  href="#features"
                  className="hover:text-white transition"
                >
                  Features
                </a>

                <a
                  href="#how-it-works"
                  className="hover:text-white transition"
                >
                  How It Works
                </a>

                <Link
                  to="/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hover:text-white transition"
                >
                  Register
                </Link>

              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">
                Company
              </h4>

              <div className="flex flex-col gap-3 text-sm">

                <a
                  href="#about"
                  className="hover:text-white transition"
                >
                  About
                </a>

                <a
                  href="#features"
                  className="hover:text-white transition"
                >
                  Privacy
                </a>

                <a
                  href="#features"
                  className="hover:text-white transition"
                >
                  Security
                </a>

              </div>
            </div>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Landing;