import { useEffect, useState } from "react";
import {
  FaPlus,
  FaBullseye,
  FaTrash,
  FaEdit,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const Goals = () => {
  const navigate = useNavigate();

  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    target: "",
    saved: "",
    deadline: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user?.id || user?._id;

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    fetchGoals();
  }, [userId]);

  const fetchGoals = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/goals/${userId}`
      );

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Backend returned:", text);

        throw new Error(
          "Backend did not return JSON. Make sure the server is running."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load goals");
      }

      setGoals(data.goals || []);
    } catch (error) {
      console.error("Fetch goals error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      target: "",
      saved: "",
      deadline: "",
    });

    setEditingGoal(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.target || !form.deadline) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const url = editingGoal
        ? `${API_URL}/api/goals/${editingGoal._id}`
        : `${API_URL}/api/goals`;

      const method = editingGoal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: form.title,
          target: Number(form.target),
          saved: Number(form.saved) || 0,
          deadline: form.deadline,
        }),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();
        console.error("Backend returned:", text);

        throw new Error(
          `Backend returned ${response.status} instead of JSON`
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save goal");
      }

      if (editingGoal) {
        setGoals((prev) =>
          prev.map((goal) =>
            goal._id === editingGoal._id ? data.goal : goal
          )
        );
      } else {
        setGoals((prev) => [data.goal, ...prev]);
      }

      resetForm();

      alert(
        editingGoal
          ? "Goal updated successfully!"
          : "Goal created successfully!"
      );
    } catch (error) {
      console.error("Save goal error:", error);
      alert(error.message);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);

    setForm({
      title: goal.title,
      target: goal.target,
      saved: goal.saved,
      deadline: goal.deadline
        ? goal.deadline.split("T")[0]
        : "",
    });

    setShowForm(true);
  };

  const deleteGoal = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/goals/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete goal");
      }

      setGoals((prev) =>
        prev.filter((goal) => goal._id !== id)
      );

      alert("Goal deleted successfully!");
    } catch (error) {
      console.error("Delete goal error:", error);
      alert(error.message);
    }
  };

  const totalTarget = goals.reduce(
    (total, goal) => total + Number(goal.target),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + Number(goal.saved),
    0
  );

  const totalRemaining = Math.max(
    totalTarget - totalSaved,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Financial Goals
          </h1>

          <p className="mt-1 text-slate-500">
            Set goals and track your progress
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <FaPlus />
          {showForm ? "Close" : "Add Goal"}
        </button>
      </div>

      {/* SUMMARY */}
      <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Target
            </p>

            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FaBullseye />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800">
            ₹{totalTarget.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Saved
            </p>

            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              ₹
            </div>
          </div>

          <h2 className="text-3xl font-bold text-green-600">
            ₹{totalSaved.toLocaleString("en-IN")}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Remaining
            </p>

            <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
              ₹
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800">
            ₹{totalRemaining.toLocaleString("en-IN")}
          </h2>
        </div>

      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-1 text-xl font-bold text-slate-800">
            {editingGoal ? "Edit Goal" : "Create New Goal"}
          </h2>

          <p className="mb-6 text-sm text-slate-500">
            {editingGoal
              ? "Update your financial goal"
              : "Define your financial target"}
          </p>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Goal Name
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Buy a new laptop"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Target Amount
              </label>

              <input
                type="number"
                name="target"
                value={form.target}
                onChange={handleChange}
                min="1"
                placeholder="₹100000"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Saved Amount
              </label>

              <input
                type="number"
                name="saved"
                value={form.saved}
                onChange={handleChange}
                min="0"
                placeholder="₹0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Target Date
              </label>

              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                <FaPlus />
                {editingGoal ? "Update Goal" : "Create Goal"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-600 hover:bg-slate-200"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* GOALS */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            My Goals
          </h2>

          <p className="text-sm text-slate-500">
            Track your progress toward your financial goals
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-500">
            Loading goals...
          </div>
        ) : goals.length === 0 ? (
          <div className="py-12 text-center">
            <FaBullseye className="mx-auto mb-4 text-5xl text-slate-300" />

            <p className="font-medium text-slate-600">
              No financial goals yet
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Create your first goal to start saving
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {goals.map((goal) => {
              const percentage =
                goal.target > 0
                  ? (goal.saved / goal.target) * 100
                  : 0;

              const progress = Math.min(percentage, 100);

              const remaining = Math.max(
                goal.target - goal.saved,
                0
              );

              const completed =
                goal.saved >= goal.target;

              return (
                <div
                  key={goal._id}
                  className="rounded-2xl border border-slate-100 p-5"
                >

                  <div className="mb-5 flex items-start justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <FaBullseye />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {goal.title}
                        </h3>

                        <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                          <FaCalendarAlt />

                          {new Date(
                            goal.deadline
                          ).toLocaleDateString("en-IN")}
                        </div>
                      </div>

                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleEdit(goal)}
                        className="rounded-lg p-2 text-blue-500 hover:bg-blue-50"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() =>
                          deleteGoal(goal._id)
                        }
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  </div>

                  <div className="mb-3 flex items-end justify-between">

                    <div>
                      <p className="text-sm text-slate-500">
                        Saved
                      </p>

                      <p className="text-2xl font-bold text-green-600">
                        ₹{Number(goal.saved).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-slate-500">
                        Target
                      </p>

                      <p className="text-2xl font-bold text-slate-800">
                        ₹{Number(goal.target).toLocaleString("en-IN")}
                      </p>
                    </div>

                  </div>

                  <div className="mb-2 h-3 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className={`h-full rounded-full transition-all ${
                        completed
                          ? "bg-green-500"
                          : "bg-blue-600"
                      }`}
                      style={{
                        width: `${progress}%`,
                      }}
                    />

                  </div>

                  <div className="flex items-center justify-between text-sm">

                    <span
                      className={`font-semibold ${
                        completed
                          ? "text-green-600"
                          : "text-slate-500"
                      }`}
                    >
                      {Math.round(percentage)}%
                    </span>

                    <span className="text-slate-500">
                      {completed
                        ? "Goal completed 🎉"
                        : `₹${remaining.toLocaleString(
                            "en-IN"
                          )} remaining`}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Goals;