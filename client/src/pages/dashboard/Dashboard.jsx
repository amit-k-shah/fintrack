import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaBullseye,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaPiggyBank,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";

const API_URL = "http://localhost:3000";

const Dashboard = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET USER
  // =========================

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid user:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

  const userId = user?.id || user?._id;

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/transactions/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load transactions"
        );
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Dashboard transaction error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // =========================
  // LOAD BUDGETS
  // =========================

  useEffect(() => {
    if (!userId) return;

    const storedBudgets = localStorage.getItem(
      `budgets_${userId}`
    );

    if (!storedBudgets) {
      setBudgets([]);
      return;
    }

    try {
      setBudgets(JSON.parse(storedBudgets));
    } catch (error) {
      console.error("Invalid budget data:", error);
      setBudgets([]);
    }
  }, [userId]);

  // =========================
  // TOTAL INCOME
  // =========================

  const totalIncome = useMemo(() => {
    return transactions
      .filter(
        (transaction) => transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) => transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  // =========================
  // BALANCE
  // =========================

  const balance = totalIncome - totalExpenses;

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // RECENT TRANSACTIONS
  // =========================

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  // =========================
  // BUDGET DATA
  // =========================

  const budgetData = useMemo(() => {
    return budgets.slice(0, 3).map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.category?.toLowerCase() ===
              budget.category?.toLowerCase()
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        );

      const limit = Number(budget.amount || 0);

      const percentage =
        limit > 0
          ? Math.min((spent / limit) * 100, 100)
          : 0;

      return {
        name: budget.category,
        spent,
        limit,
        percentage,
      };
    });
  }, [budgets, transactions]);

  // =========================
  // MONTHLY CHART
  // =========================

  const chartData = useMemo(() => {
    const now = new Date();

    const months = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        month: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
        income: 0,
        expense: 0,
      });
    }

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);

      const month = months.find(
        (item) =>
          item.monthIndex === date.getMonth() &&
          item.year === date.getFullYear()
      );

      if (!month) return;

      if (transaction.type === "income") {
        month.income += Number(transaction.amount || 0);
      } else {
        month.expense += Number(transaction.amount || 0);
      }
    });

    const maxValue = Math.max(
      ...months.map((item) =>
        Math.max(item.income, item.expense)
      ),
      1
    );

    return months.map((item) => ({
      ...item,
      incomeHeight:
        (item.income / maxValue) * 100,
      expenseHeight:
        (item.expense / maxValue) * 100,
    }));
  }, [transactions]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // SIDEBAR MENU
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
      path: "/settings",
    },
  ];

  // =========================
  // USER NAME
  // =========================

  const userName = user?.name || "User";

  const firstLetter =
    userName.charAt(0).toUpperCase() || "U";

  // =========================
  // CURRENT DATE
  // =========================

  const currentDate = new Date().toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* =========================
          MOBILE OVERLAY
      ========================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

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

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-100">
              F
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Fin<span className="text-blue-600">
                  Track
                </span>
              </h1>

              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Personal Finance
              </p>
            </div>

          </Link>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-500 hover:text-slate-900"
          >
            <FaTimes />
          </button>

        </div>

        {/* NAVIGATION */}

        <div className="flex-1 px-4 py-6 overflow-y-auto">

          <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {
              const active =
                item.path === "/dashboard";

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
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

          {/* QUICK ACTION */}

          <div className="mt-8">

            <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick Action
            </p>

            <button
              onClick={() =>
                navigate("/transactions")
              }
              className="
                w-full
                flex items-center justify-center gap-2
                px-4 py-3.5
                rounded-xl
                bg-blue-50
                text-blue-600
                text-sm font-bold
                hover:bg-blue-100
                transition
              "
            >
              <FaPlus />
              Add Transaction
            </button>

          </div>

        </div>

        {/* PROFILE */}

        <div className="p-4 border-t border-slate-100">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">

            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {firstLetter}
            </div>

            <div className="flex-1 min-w-0">

              <p className="text-sm font-bold text-slate-800 truncate">
                {userName}
              </p>

              <p className="text-xs text-slate-400 truncate">
                Personal Account
              </p>

            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="text-slate-400 hover:text-red-500 transition"
            >
              <FaSignOutAlt />
            </button>

          </div>

        </div>

      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="lg:ml-72">

        {/* TOPBAR */}

        <header className="sticky top-0 z-30 h-20 bg-white/95 backdrop-blur-md border-b border-slate-200">

          <div className="h-full px-5 sm:px-8 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={() =>
                  setSidebarOpen(true)
                }
                className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <FaBars />
              </button>

              <div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Dashboard
                </h2>

                <p className="hidden sm:block text-xs text-slate-400">
                  Here's your financial overview
                </p>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <button className="relative w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:text-blue-600 transition">
                <FaBell />
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="flex items-center gap-3 pl-2 sm:pl-3"
              >

                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {firstLetter}
                </div>

                <div className="hidden sm:block text-left">

                  <p className="text-sm font-bold text-slate-800">
                    {userName}
                  </p>

                  <p className="text-xs text-slate-400">
                    My Account
                  </p>

                </div>

              </button>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="p-5 sm:p-8">

          {/* GREETING */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

            <div>

              <p className="text-sm text-slate-400">
                {currentDate}
              </p>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Good morning, {userName} 👋
              </h1>

              <p className="text-slate-500 mt-2">
                Here's what's happening with your money today.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/transactions")
              }
              className="
                w-fit
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                bg-blue-600
                text-white
                font-semibold
                text-sm
                hover:bg-blue-700
                transition
                shadow-lg shadow-blue-100
              "
            >
              <FaPlus />
              Add Transaction
            </button>

          </div>

          {/* SUMMARY CARDS */}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* BALANCE */}

            <div className="relative overflow-hidden p-6 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">

              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />

              <div className="flex items-center justify-between">

                <p className="text-sm text-blue-100">
                  Total Balance
                </p>

                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <FaWallet />
                </div>

              </div>

              <h3 className="text-3xl font-extrabold mt-4">
                {formatCurrency(balance)}
              </h3>

              <div className="flex items-center gap-2 mt-4 text-sm text-blue-100">
                <span>
                  Income - Expenses
                </span>
              </div>

            </div>

            {/* INCOME */}

            <div className="p-6 rounded-2xl bg-white border border-slate-200">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Income
                </p>

                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <FaArrowDown />
                </div>

              </div>

              <h3 className="text-3xl font-extrabold text-slate-900 mt-4">
                {formatCurrency(totalIncome)}
              </h3>

              <div className="flex items-center gap-2 mt-4 text-sm text-green-600">
                <FaArrowUp />
                <span>
                  {transactions.filter(
                    (item) =>
                      item.type === "income"
                  ).length}{" "}
                  income transaction
                  {transactions.filter(
                    (item) =>
                      item.type === "income"
                  ).length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

            </div>

            {/* EXPENSES */}

            <div className="p-6 rounded-2xl bg-white border border-slate-200">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Expenses
                </p>

                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                  <FaArrowUp />
                </div>

              </div>

              <h3 className="text-3xl font-extrabold text-slate-900 mt-4">
                {formatCurrency(totalExpenses)}
              </h3>

              <div className="flex items-center gap-2 mt-4 text-sm text-red-500">
                <FaArrowDown />
                <span>
                  {transactions.filter(
                    (item) =>
                      item.type === "expense"
                  ).length}{" "}
                  expense transaction
                  {transactions.filter(
                    (item) =>
                      item.type === "expense"
                  ).length !== 1
                    ? "s"
                    : ""}
                </span>
              </div>

            </div>

            {/* SAVINGS */}

            <div className="p-6 rounded-2xl bg-white border border-slate-200">

              <div className="flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Net Savings
                </p>

                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FaPiggyBank />
                </div>

              </div>

              <h3
                className={`text-3xl font-extrabold mt-4 ${
                  balance >= 0
                    ? "text-slate-900"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(balance)}
              </h3>

              <div className="mt-4 text-sm text-slate-400">
                Current net amount
              </div>

            </div>

          </div>

          {/* CHART + BUDGET */}

          <div className="grid xl:grid-cols-3 gap-5 mt-6">

            {/* SPENDING CHART */}

            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Spending Overview
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Income and expenses for the last 7 months
                  </p>

                </div>

              </div>

              <div className="mt-8">

                <div className="h-64 flex items-end gap-2 sm:gap-5">

                  {chartData.map((item) => (

                    <div
                      key={`${item.month}-${item.year}`}
                      className="flex-1 h-full flex flex-col justify-end"
                    >

                      <div className="flex items-end justify-center gap-1 h-full">

                        <div
                          style={{
                            height: `${item.incomeHeight}%`,
                          }}
                          className="w-3 sm:w-5 bg-blue-600 rounded-t-md"
                          title={`Income: ${formatCurrency(
                            item.income
                          )}`}
                        />

                        <div
                          style={{
                            height: `${item.expenseHeight}%`,
                          }}
                          className="w-3 sm:w-5 bg-blue-100 rounded-t-md"
                          title={`Expenses: ${formatCurrency(
                            item.expense
                          )}`}
                        />

                      </div>

                      <p className="text-xs text-slate-400 text-center mt-3">
                        {item.month}
                      </p>

                    </div>

                  ))}

                </div>

                <div className="flex items-center justify-center gap-6 mt-6">

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-blue-600" />
                    Income
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-blue-100" />
                    Expenses
                  </div>

                </div>

              </div>

            </div>

            {/* BUDGET */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Monthly Budget
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Your current budgets
                  </p>

                </div>

              </div>

              <div className="mt-6 space-y-6">

                {budgetData.length === 0 ? (

                  <div className="py-8 text-center">

                    <FaChartPie className="mx-auto text-3xl text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No budgets yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Create a budget to track spending.
                    </p>

                  </div>

                ) : (

                  budgetData.map((budget) => (

                    <div key={budget.name}>

                      <div className="flex items-center justify-between mb-2">

                        <span className="text-sm font-semibold text-slate-700">
                          {budget.name}
                        </span>

                        <span className="text-xs text-slate-400">
                          {formatCurrency(
                            budget.spent
                          )}{" "}
                          /{" "}
                          {formatCurrency(
                            budget.limit
                          )}
                        </span>

                      </div>

                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">

                        <div
                          className={`h-full rounded-full ${
                            budget.spent >
                            budget.limit
                              ? "bg-red-500"
                              : "bg-blue-600"
                          }`}
                          style={{
                            width: `${Math.min(
                              budget.percentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                      <p className="text-xs text-slate-400 mt-2">
                        {Math.round(
                          budget.percentage
                        )}
                        % used
                      </p>

                    </div>

                  ))

                )}

              </div>

              <button
                onClick={() => navigate("/budgets")}
                className="w-full mt-7 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition"
              >
                View All Budgets
                <FaChevronRight className="text-xs" />
              </button>

            </div>

          </div>

          {/* TRANSACTIONS + GOALS */}

          <div className="grid xl:grid-cols-3 gap-5 mt-6">

            {/* RECENT TRANSACTIONS */}

            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Recent Transactions
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Your latest financial activity
                  </p>

                </div>

                <Link
                  to="/transactions"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>

              </div>

              {loading ? (

                <div className="py-12 text-center text-sm text-slate-400">
                  Loading transactions...
                </div>

              ) : recentTransactions.length === 0 ? (

                <div className="py-12 text-center">

                  <FaWallet className="mx-auto text-3xl text-slate-300" />

                  <p className="mt-3 font-semibold text-slate-600">
                    No transactions yet
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Add your first income or expense.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/transactions")
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <FaPlus />
                    Add Transaction
                  </button>

                </div>

              ) : (

                <div className="space-y-3">

                  {recentTransactions.map(
                    (transaction) => (

                      <div
                        key={transaction._id}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition"
                      >

                        <div
                          className={`
                            w-11 h-11 rounded-xl
                            flex items-center justify-center
                            ${
                              transaction.type ===
                              "income"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-500"
                            }
                          `}
                        >
                          {transaction.type ===
                          "income" ? (
                            <FaArrowUp />
                          ) : (
                            <FaArrowDown />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">

                          <p className="font-semibold text-slate-800 truncate">
                            {transaction.title}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            {transaction.category} •{" "}
                            {formatDate(
                              transaction.date
                            )}
                          </p>

                        </div>

                        <div
                          className={`font-bold text-sm ${
                            transaction.type ===
                            "income"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.type === "income"
                            ? "+"
                            : "-"}
                          {formatCurrency(
                            transaction.amount
                          )}
                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>

            {/* GOALS */}

            <div className="bg-white border border-slate-200 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">

                <div>

                  <h3 className="text-lg font-bold text-slate-900">
                    Financial Goals
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Track your savings goals
                  </p>

                </div>

                <Link
                  to="/goals"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  View All
                </Link>

              </div>

              <div className="py-10 text-center">

                <FaBullseye className="mx-auto text-3xl text-slate-300" />

                <p className="mt-3 font-semibold text-slate-600">
                  No goals yet
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  Create a financial goal to track your progress.
                </p>

                <button
                  onClick={() => navigate("/goals")}
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                >
                  Create Goal
                  <FaChevronRight className="text-xs" />
                </button>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default Dashboard;