import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaTrash,
  FaWallet,
  FaTimes,
} from "react-icons/fa";

const API_URL = "http://localhost:3000";

const Transactions = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const userId = user?.id || user?._id;

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
      console.error("Invalid user data:", error);
      localStorage.removeItem("user");
      navigate("/login");
    }
  }, [navigate]);

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
      console.error("Transaction fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  // =========================
  // FORM CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // ADD TRANSACTION
  // =========================

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User not found. Please login again.");
      navigate("/login");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.category.trim() ||
      !formData.amount
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      alert("Amount must be greater than 0.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            title: formData.title.trim(),
            category: formData.category.trim(),
            amount: Number(formData.amount),
            type: formData.type,
            date: formData.date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add transaction"
        );
      }

      // Add the new transaction immediately
      setTransactions((prev) => [
        data.transaction,
        ...prev,
      ]);

      // Reset form
      setFormData({
        title: "",
        category: "",
        amount: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });

      setShowModal(false);
    } catch (error) {
      console.error("Add transaction error:", error);
      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE TRANSACTION
  // =========================

  const deleteTransaction = async (id) => {
    const confirmDelete = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_URL}/api/transactions/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete transaction"
        );
      }

      setTransactions((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete transaction error:", error);
      alert(error.message);
    }
  };

  // =========================
  // FORMAT CURRENCY
  // =========================

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // TOTALS
  // =========================

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <FaArrowLeft />
            </button>

            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Transactions
              </h1>

              <p className="text-xs text-gray-500">
                Manage your income and expenses
              </p>
            </div>

          </div>

          <Link
            to="/dashboard"
            className="hidden items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:flex"
          >
            <FaWallet />
            Dashboard
          </Link>

        </div>
      </header>

      {/* CONTENT */}

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8">

        {/* TOP */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              All Transactions
            </h2>

            <p className="text-sm text-gray-500">
              {transactions.length} transaction
              {transactions.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <FaPlus />
            Add Transaction
          </button>

        </div>

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Income
            </p>

            <h3 className="mt-2 text-2xl font-bold text-emerald-600">
              {formatCurrency(totalIncome)}
            </h3>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Total Expenses
            </p>

            <h3 className="mt-2 text-2xl font-bold text-red-500">
              {formatCurrency(totalExpenses)}
            </h3>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">
              Balance
            </p>

            <h3 className="mt-2 text-2xl font-bold text-blue-600">
              {formatCurrency(
                totalIncome - totalExpenses
              )}
            </h3>
          </div>

        </div>

        {/* TRANSACTIONS */}

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {loading ? (

            <div className="p-12 text-center text-gray-500">
              Loading transactions...
            </div>

          ) : transactions.length === 0 ? (

            <div className="p-12 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <FaWallet />
              </div>

              <h3 className="mt-4 font-semibold text-gray-800">
                No transactions yet
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                Add your first income or expense.
              </p>

              <button
                onClick={() => setShowModal(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <FaPlus />
                Add Transaction
              </button>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {transactions.map((transaction) => (

                <div
                  key={transaction._id}
                  className="flex items-center justify-between gap-4 p-4 hover:bg-gray-50 md:p-5"
                >

                  <div className="flex min-w-0 items-center gap-4">

                    <div
                      className={`
                        flex h-11 w-11 shrink-0 items-center
                        justify-center rounded-xl
                        ${
                          transaction.type === "income"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-500"
                        }
                      `}
                    >
                      {transaction.type === "income" ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      )}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-gray-800">
                        {transaction.title}
                      </h3>

                      <p className="mt-1 text-xs text-gray-400">
                        {transaction.category} •{" "}
                        {formatDate(transaction.date)}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-4">

                    <span
                      className={`
                        whitespace-nowrap text-sm font-bold
                        ${
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-red-500"
                        }
                      `}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>

                    <button
                      onClick={() =>
                        deleteTransaction(transaction._id)
                      }
                      className="text-gray-300 hover:text-red-500"
                      title="Delete transaction"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

      {/* ADD TRANSACTION MODAL */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* MODAL HEADER */}

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add Transaction
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Record your income or expense
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
              >
                <FaTimes />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleAddTransaction}
              className="space-y-5"
            >

              {/* TYPE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Transaction Type
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: "income",
                      }))
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      formData.type === "income"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <FaArrowUp className="mx-auto mb-1" />
                    Income
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        type: "expense",
                      }))
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
                      formData.type === "expense"
                        ? "border-red-500 bg-red-50 text-red-500"
                        : "border-gray-200 text-gray-500"
                    }`}
                  >
                    <FaArrowDown className="mx-auto mb-1" />
                    Expense
                  </button>

                </div>

              </div>

              {/* TITLE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Salary, Grocery"
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-800 outline-none focus:border-blue-500"
                />

              </div>

              {/* CATEGORY */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Food, Transport, Salary"
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-800 outline-none focus:border-blue-500"
                />

              </div>

              {/* AMOUNT */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <div className="relative">

                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="amount"
                    min="1"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0"
                    className="h-11 w-full rounded-lg border border-gray-300 pl-8 pr-3 text-gray-800 outline-none focus:border-blue-500"
                  />

                </div>

              </div>

              {/* DATE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 text-gray-800 outline-none focus:border-blue-500"
                />

              </div>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {saving
                    ? "Saving..."
                    : "Add Transaction"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
};

export default Transactions;