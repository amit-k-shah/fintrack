import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaBullseye,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaPlus,
  FaTrash,
  FaWallet,
} from "react-icons/fa";

const Budget = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  useEffect(() => {
    if (!user?.id) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:3000/api/transactions/${user.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setTransactions(data.transactions || []);
        }
      })
      .catch((error) => {
        console.error("Transaction fetch error:", error);
      });
  }, [navigate, user?.id]);

  // =========================
  // LOAD BUDGETS
  // =========================

  useEffect(() => {
    if (!user?.id) return;

    const savedBudgets = localStorage.getItem(
      `budgets_${user.id}`
    );

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }
  }, [user?.id]);

  // =========================
  // SAVE BUDGETS
  // =========================

  useEffect(() => {
    if (!user?.id) return;

    localStorage.setItem(
      `budgets_${user.id}`,
      JSON.stringify(budgets)
    );
  }, [budgets, user?.id]);

  // =========================
  // ADD BUDGET
  // =========================

  const handleAddBudget = (e) => {
    e.preventDefault();

    if (!formData.category.trim() || !formData.amount) {
      alert("Please enter category and amount");
      return;
    }

    const amount = Number(formData.amount);

    if (amount <= 0) {
      alert("Budget amount must be greater than 0");
      return;
    }

    const existingBudget = budgets.find(
      (budget) =>
        budget.category.toLowerCase() ===
        formData.category.trim().toLowerCase()
    );

    if (existingBudget) {
      alert("Budget for this category already exists");
      return;
    }

    const newBudget = {
      id: Date.now(),
      category: formData.category.trim(),
      limit: amount,
    };

    setBudgets((prev) => [...prev, newBudget]);

    setFormData({
      category: "",
      amount: "",
    });

    setShowForm(false);
  };

  // =========================
  // DELETE BUDGET
  // =========================

  const handleDeleteBudget = (id) => {
    setBudgets((prev) =>
      prev.filter((budget) => budget.id !== id)
    );
  };

  // =========================
  // CALCULATE SPENT
  // =========================

  const getSpent = (category) => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category?.toLowerCase() ===
            category.toLowerCase()
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // SIDEBAR
  // =========================

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHome />,
      path: "/dashboard",
    },
    {
      name: "Transactions",
      icon: <FaExchangeAlt />,
      path: "/transactions",
    },
    {
      name: "Budgets",
      icon: <FaChartPie />,
      path: "/budgets",
    },
    {
      name: "Goals",
      icon: <FaBullseye />,
      path: "/goals",
    },
    {
      name: "Analytics",
      icon: <FaChartPie />,
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      path: "/profile",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-72
          bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}

        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100">

          <Link
            to="/dashboard"
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
              F
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Fin<span className="text-blue-600">Track</span>
              </h1>

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Personal Finance
              </p>
            </div>
          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-500"
          >
            <FaTimes />
          </button>
        </div>

        {/* MENU */}

        <div className="flex-1 px-4 py-6">

          <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {
              const active = item.path === "/budgets";

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-4
                    px-4 py-3.5
                    rounded-xl
                    text-sm font-semibold
                    transition
                    ${
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                        : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                    }
                  `}
                >
                  <span className="text-lg">
                    {item.icon}
                  </span>

                  {item.name}
                </Link>
              );
            })}

          </nav>

          {/* ADD BUDGET */}

          <div className="mt-8">

            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 transition"
            >
              <FaPlus />
              Add Budget
            </button>

          </div>

        </div>

        {/* PROFILE */}

        <div className="p-4 border-t border-slate-100">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-bold text-slate-800 truncate">
                {user?.name || "User"}
              </p>

              <p className="text-xs text-slate-400 truncate">
                Personal Account
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500"
            >
              <FaSignOutAlt />
            </button>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <div className="lg:ml-72">

        {/* TOPBAR */}

        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200">

          <div className="h-full px-5 sm:px-8 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
              >
                <FaBars />
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Budgets
                </h2>

                <p className="text-xs text-slate-400">
                  Manage your spending limits
                </p>
              </div>

            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              <FaPlus />
              Add Budget
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <main className="p-5 sm:p-8">

          <div className="mb-8">

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              My Budgets
            </h1>

            <p className="text-slate-500 mt-2">
              Set limits and track your spending.
            </p>

          </div>

          {/* SUMMARY */}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaChartPie />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Total Budget
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    ₹
                    {budgets
                      .reduce(
                        (total, budget) =>
                          total + budget.limit,
                        0
                      )
                      .toLocaleString()}
                  </h3>
                </div>

              </div>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FaWallet />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Total Spent
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    ₹
                    {budgets
                      .reduce(
                        (total, budget) =>
                          total + getSpent(budget.category),
                        0
                      )
                      .toLocaleString()}
                  </h3>
                </div>

              </div>

            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <FaWallet />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Remaining
                  </p>

                  <h3 className="text-2xl font-bold text-slate-900">
                    ₹
                    {budgets
                      .reduce(
                        (total, budget) =>
                          total +
                          (budget.limit -
                            getSpent(budget.category)),
                        0
                      )
                      .toLocaleString()}
                  </h3>
                </div>

              </div>

            </div>

          </div>

          {/* BUDGET CARDS */}

          {budgets.length === 0 ? (

            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                <FaChartPie />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No budgets yet
              </h3>

              <p className="mt-2 text-slate-500">
                Create your first budget to start tracking your spending.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-6 px-5 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                <span className="flex items-center gap-2">
                  <FaPlus />
                  Create Budget
                </span>
              </button>

            </div>

          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {budgets.map((budget) => {

                const spent = getSpent(budget.category);

                const remaining =
                  budget.limit - spent;

                const percentage =
                  budget.limit > 0
                    ? Math.min(
                        (spent / budget.limit) * 100,
                        100
                      )
                    : 0;

                return (
                  <div
                    key={budget.id}
                    className="bg-white border border-slate-200 rounded-2xl p-6"
                  >

                    <div className="flex items-start justify-between">

                      <div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {budget.category}
                        </h3>

                        <p className="text-sm text-slate-400 mt-1">
                          Monthly budget
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleDeleteBudget(budget.id)
                        }
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                      >
                        <FaTrash />
                      </button>

                    </div>

                    <div className="mt-6">

                      <div className="flex items-center justify-between">

                        <span className="text-sm text-slate-500">
                          Spent
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          ₹{spent.toLocaleString()} / ₹
                          {budget.limit.toLocaleString()}
                        </span>

                      </div>

                      <div className="mt-3 w-full h-3 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${
                            percentage >= 100
                              ? "bg-red-500"
                              : percentage >= 80
                              ? "bg-yellow-500"
                              : "bg-blue-600"
                          }`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                      <div className="flex justify-between mt-3">

                        <span className="text-xs text-slate-400">
                          {Math.round(percentage)}% used
                        </span>

                        <span
                          className={`text-xs font-semibold ${
                            remaining < 0
                              ? "text-red-500"
                              : "text-green-600"
                          }`}
                        >
                          {remaining < 0
                            ? `₹${Math.abs(
                                remaining
                              ).toLocaleString()} over`
                            : `₹${remaining.toLocaleString()} left`}
                        </span>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </main>

      </div>

      {/* ADD BUDGET MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Budget
                </h2>

                <p className="text-sm text-slate-400 mt-1">
                  Set a spending limit for a category
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200"
              >
                <FaTimes />
              </button>

            </div>

            <form
              onSubmit={handleAddBudget}
              className="space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>

                <input
                  type="text"
                  placeholder="e.g. Food, Transport, Shopping"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    })
                  }
                  className="w-full h-11 rounded-lg border border-slate-300 px-3 text-slate-800 outline-none focus:border-blue-500"
                />

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Budget Amount
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    min="1"
                    placeholder="10000"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount: e.target.value,
                      })
                    }
                    className="w-full h-11 rounded-lg border border-slate-300 pl-8 pr-3 text-slate-800 outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 h-11 rounded-lg border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                >
                  Add Budget
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Budget;