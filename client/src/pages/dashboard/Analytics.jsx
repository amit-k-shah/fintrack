import { useEffect, useMemo, useState } from "react";
import {
  FaChartPie,
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaMoneyBillWave,
  FaUtensils,
  FaShoppingBag,
  FaCar,
  FaFileInvoiceDollar,
  FaFilm,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const categoryIcons = {
  food: {
    icon: <FaUtensils />,
    color: "bg-orange-500",
    light: "bg-orange-100",
    text: "text-orange-600",
  },

  groceries: {
    icon: <FaShoppingBag />,
    color: "bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  },

  shopping: {
    icon: <FaShoppingBag />,
    color: "bg-purple-500",
    light: "bg-purple-100",
    text: "text-purple-600",
  },

  travel: {
    icon: <FaCar />,
    color: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  },

  transport: {
    icon: <FaCar />,
    color: "bg-blue-500",
    light: "bg-blue-100",
    text: "text-blue-600",
  },

  bills: {
    icon: <FaFileInvoiceDollar />,
    color: "bg-red-500",
    light: "bg-red-100",
    text: "text-red-600",
  },

  entertainment: {
    icon: <FaFilm />,
    color: "bg-green-500",
    light: "bg-green-100",
    text: "text-green-600",
  },
};

const defaultCategoryStyle = {
  icon: <FaMoneyBillWave />,
  color: "bg-slate-500",
  light: "bg-slate-100",
  text: "text-slate-600",
};

const Analytics = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(6);

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchTransactions();
  }, [userId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/transactions/${userId}`
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("Backend returned:", text);

        throw new Error(
          "Backend did not return JSON. Make sure the server is running."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load transactions"
        );
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Analytics fetch error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*
   * ================================
   * CURRENT TOTALS
   * ================================
   */

  const totalIncome = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "income")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount || 0),
        0
      );
  }, [transactions]);

  const totalSavings = totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? (totalSavings / totalIncome) * 100
      : 0;

  /*
   * ================================
   * MONTHLY DATA
   * ================================
   */

  const monthlyData = useMemo(() => {
    const now = new Date();

    const months = [];

    for (let i = period - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        income: 0,
        expense: 0,
      });
    }

    transactions.forEach((transaction) => {
      const transactionDate = new Date(
        transaction.date || transaction.createdAt
      );

      if (Number.isNaN(transactionDate.getTime())) {
        return;
      }

      const key = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;

      const month = months.find(
        (item) => item.key === key
      );

      if (!month) return;

      const amount = Number(transaction.amount || 0);

      if (transaction.type === "income") {
        month.income += amount;
      }

      if (transaction.type === "expense") {
        month.expense += amount;
      }
    });

    return months;
  }, [transactions, period]);

  /*
   * ================================
   * AVERAGE MONTHLY EXPENSE
   * ================================
   */

  const averageMonthlyExpense = useMemo(() => {
    if (!monthlyData.length) return 0;

    const total = monthlyData.reduce(
      (sum, month) => sum + month.expense,
      0
    );

    return total / monthlyData.length;
  }, [monthlyData]);

  /*
   * ================================
   * CATEGORY DATA
   * ================================
   */

  const categoryData = useMemo(() => {
    const categoryTotals = {};

    transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        const category =
          transaction.category?.trim() || "Other";

        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }

        categoryTotals[category] += Number(
          transaction.amount || 0
        );
      });

    const total = Object.values(categoryTotals).reduce(
      (sum, amount) => sum + amount,
      0
    );

    return Object.entries(categoryTotals)
      .map(([name, amount]) => {
        const style =
          categoryIcons[name.toLowerCase()] ||
          defaultCategoryStyle;

        return {
          name,
          amount,
          percentage:
            total > 0 ? (amount / total) * 100 : 0,
          ...style,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  /*
   * ================================
   * CHART MAX VALUE
   * ================================
   */

  const maxValue = Math.max(
    ...monthlyData.flatMap((item) => [
      item.income,
      item.expense,
    ]),
    1
  );

  /*
   * ================================
   * TOP CATEGORY
   * ================================
   */

  const highestCategory = categoryData[0];

  /*
   * ================================
   * PREVIOUS MONTH
   * ================================
   */

  const currentMonth = monthlyData[monthlyData.length - 1];

  const previousMonth =
    monthlyData.length >= 2
      ? monthlyData[monthlyData.length - 2]
      : null;

  const incomeChange =
    previousMonth?.income > 0
      ? ((currentMonth.income -
          previousMonth.income) /
          previousMonth.income) *
        100
      : null;

  const expenseChange =
    previousMonth?.expense > 0
      ? ((currentMonth.expense -
          previousMonth.expense) /
          previousMonth.expense) *
        100
      : null;

  /*
   * ================================
   * LOADING
   * ================================
   */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">

      {/* HEADER */}

      <div className="mb-8">
        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FaChartPie className="text-xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Analytics
            </h1>

            <p className="mt-1 text-slate-500">
              Understand your financial habits and
              spending patterns
            </p>
          </div>

        </div>
      </div>

      {/* EMPTY STATE */}

      {transactions.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <FaChartPie className="mx-auto mb-4 text-5xl text-slate-300" />

          <h2 className="text-xl font-bold text-slate-700">
            No transaction data yet
          </h2>

          <p className="mt-2 text-slate-500">
            Add some income or expense transactions
            to see your analytics.
          </p>

          <button
            onClick={() => navigate("/transactions")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Add Transaction
          </button>
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}

          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {/* INCOME */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Income
                </p>

                <div className="rounded-xl bg-green-100 p-3 text-green-600">
                  <FaArrowUp />
                </div>

              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                ₹{totalIncome.toLocaleString("en-IN")}
              </h2>

              {incomeChange !== null && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    incomeChange >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {incomeChange >= 0 ? "+" : ""}
                  {incomeChange.toFixed(1)}% from last month
                </p>
              )}

            </div>

            {/* EXPENSE */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Expenses
                </p>

                <div className="rounded-xl bg-red-100 p-3 text-red-600">
                  <FaArrowDown />
                </div>

              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                ₹{totalExpenses.toLocaleString("en-IN")}
              </h2>

              {expenseChange !== null && (
                <p
                  className={`mt-2 text-sm font-medium ${
                    expenseChange <= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {expenseChange >= 0 ? "+" : ""}
                  {expenseChange.toFixed(1)}% from last month
                </p>
              )}

            </div>

            {/* SAVINGS */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Total Savings
                </p>

                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                  <FaWallet />
                </div>

              </div>

              <h2
                className={`text-2xl font-bold ${
                  totalSavings >= 0
                    ? "text-slate-800"
                    : "text-red-600"
                }`}
              >
                ₹{totalSavings.toLocaleString("en-IN")}
              </h2>

              <p className="mt-2 text-sm font-medium text-blue-600">
                {savingsRate.toFixed(1)}% savings rate
              </p>

            </div>

            {/* AVERAGE */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-4 flex items-center justify-between">

                <p className="text-sm text-slate-500">
                  Avg. Monthly Expense
                </p>

                <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
                  <FaMoneyBillWave />
                </div>

              </div>

              <h2 className="text-2xl font-bold text-slate-800">
                ₹
                {Math.round(
                  averageMonthlyExpense
                ).toLocaleString("en-IN")}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Last {period} months
              </p>

            </div>

          </div>

          {/* CHART + CATEGORY */}

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* MONTHLY CHART */}

            <div className="rounded-2xl bg-white p-6 shadow-sm xl:col-span-2">

              <div className="mb-8 flex items-center justify-between">

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Income vs Expenses
                  </h2>

                  <p className="text-sm text-slate-500">
                    Monthly financial overview
                  </p>
                </div>

                <select
                  value={period}
                  onChange={(e) =>
                    setPeriod(Number(e.target.value))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none"
                >
                  <option value={6}>
                    Last 6 Months
                  </option>

                  <option value={12}>
                    Last 12 Months
                  </option>
                </select>

              </div>

              {/* LEGEND */}

              <div className="mb-6 flex gap-6">

                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-600" />

                  <span className="text-sm text-slate-500">
                    Income
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />

                  <span className="text-sm text-slate-500">
                    Expenses
                  </span>
                </div>

              </div>

              {/* BAR CHART */}

              <div className="flex h-72 items-end justify-between gap-3 border-b border-l border-slate-100 px-3">

                {monthlyData.map((item) => (
                  <div
                    key={item.key}
                    className="flex h-full flex-1 items-end justify-center gap-1"
                  >

                    {/* INCOME */}

                    <div className="flex h-full items-end">
                      <div
                        className="w-5 rounded-t-md bg-blue-500 transition-all hover:bg-blue-600 sm:w-7"
                        style={{
                          height: `${Math.max(
                            (item.income / maxValue) *
                              85,
                            item.income > 0 ? 3 : 0
                          )}%`,
                        }}
                        title={`Income ₹${item.income.toLocaleString(
                          "en-IN"
                        )}`}
                      />
                    </div>

                    {/* EXPENSE */}

                    <div className="flex h-full items-end">
                      <div
                        className="w-5 rounded-t-md bg-red-400 transition-all hover:bg-red-500 sm:w-7"
                        style={{
                          height: `${Math.max(
                            (item.expense / maxValue) *
                              85,
                            item.expense > 0 ? 3 : 0
                          )}%`,
                        }}
                        title={`Expense ₹${item.expense.toLocaleString(
                          "en-IN"
                        )}`}
                      />
                    </div>

                  </div>
                ))}

              </div>

              {/* MONTH LABELS */}

              <div className="mt-3 flex justify-between px-3">
                {monthlyData.map((item) => (
                  <span
                    key={item.key}
                    className="flex-1 text-center text-xs text-slate-500"
                  >
                    {item.month}
                  </span>
                ))}
              </div>

            </div>

            {/* SPENDING BY CATEGORY */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">
                  Spending by Category
                </h2>

                <p className="text-sm text-slate-500">
                  Where your money goes
                </p>
              </div>

              {/* TOTAL */}

              <div className="mx-auto mb-8 flex h-44 w-44 items-center justify-center rounded-full border-[24px] border-blue-500">

                <div className="text-center">

                  <p className="text-xs text-slate-400">
                    Total
                  </p>

                  <p className="text-xl font-bold text-slate-800">
                    ₹{totalExpenses.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>

              </div>

              {/* CATEGORIES */}

              {categoryData.length === 0 ? (
                <p className="text-center text-sm text-slate-400">
                  No expense categories yet
                </p>
              ) : (
                <div className="space-y-4">

                  {categoryData.map((category) => (
                    <div key={category.name}>

                      <div className="mb-2 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${category.light} ${category.text}`}
                          >
                            {category.icon}
                          </div>

                          <span className="text-sm font-medium text-slate-700">
                            {category.name}
                          </span>

                        </div>

                        <span className="text-sm font-semibold text-slate-800">
                          ₹{category.amount.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className={`h-full rounded-full ${category.color}`}
                          style={{
                            width: `${category.percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

          </div>

          {/* FINANCIAL INSIGHTS */}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                Financial Insights
              </h2>

              <p className="text-sm text-slate-500">
                Quick observations about your finances
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

              {/* SAVINGS INSIGHT */}

              <div
                className={`rounded-xl p-5 ${
                  totalSavings >= 0
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >

                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                    totalSavings >= 0
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <FaArrowUp />
                </div>

                <h3 className="font-bold text-slate-800">
                  {totalSavings >= 0
                    ? "Positive Savings"
                    : "Expenses Exceed Income"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {totalSavings >= 0
                    ? `Your current savings rate is ${savingsRate.toFixed(
                        1
                      )}%.`
                    : `Your expenses are ₹${Math.abs(
                        totalSavings
                      ).toLocaleString(
                        "en-IN"
                      )} higher than your income.`}
                </p>

              </div>

              {/* CATEGORY INSIGHT */}

              <div className="rounded-xl bg-orange-50 p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                  <FaUtensils />
                </div>

                <h3 className="font-bold text-slate-800">
                  Highest Spending
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {highestCategory
                    ? `${highestCategory.name} is your highest spending category at ₹${highestCategory.amount.toLocaleString(
                        "en-IN"
                      )}.`
                    : "No spending category data yet."}
                </p>

              </div>

              {/* BALANCE INSIGHT */}

              <div className="rounded-xl bg-blue-50 p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FaWallet />
                </div>

                <h3 className="font-bold text-slate-800">
                  Current Balance
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Your income minus recorded expenses is ₹
                  {totalSavings.toLocaleString(
                    "en-IN"
                  )}.
                </p>

              </div>

            </div>

          </div>

          {/* MONTHLY SUMMARY */}

          <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-slate-800">
              Monthly Summary
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[600px]">

                <thead>
                  <tr className="border-b border-slate-100 text-left">

                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Month
                    </th>

                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Income
                    </th>

                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Expenses
                    </th>

                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Savings
                    </th>

                    <th className="pb-4 text-sm font-semibold text-slate-500">
                      Savings Rate
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {monthlyData.map((item) => {
                    const savings =
                      item.income - item.expense;

                    const rate =
                      item.income > 0
                        ? (savings / item.income) *
                          100
                        : 0;

                    return (
                      <tr
                        key={item.key}
                        className="border-b border-slate-50"
                      >

                        <td className="py-4 font-medium text-slate-800">
                          {item.month}
                        </td>

                        <td className="py-4 font-semibold text-green-600">
                          ₹{item.income.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="py-4 font-semibold text-red-500">
                          ₹{item.expense.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td
                          className={`py-4 font-semibold ${
                            savings >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹{savings.toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        <td className="py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                              rate >= 0
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {rate.toFixed(1)}%
                          </span>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Analytics;