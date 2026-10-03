import React, { useEffect, useState } from "react";

import {
  FaUser,
  FaLock,
  FaBell,
  FaMoon,
  FaSun,
  FaShieldAlt,
  FaTrash,
  FaSignOutAlt,
  FaChevronRight,
  FaSave,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const Settings = () => {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] =
    useState("profile");

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    currency: "INR",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] =
    useState({
      transaction: true,
      budget: true,
      goal: false,
      email: true,
    });

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("fintrack_theme") ===
      "dark"
  );

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const userId = user?.id || user?._id;

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    loadProfile();
  }, [userId]);

  /* =========================
     DARK MODE
  ========================= */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "fintrack_theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "fintrack_theme",
        "light"
      );
    }
  }, [darkMode]);

  /* =========================
     LOAD PROFILE
  ========================= */

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/auth/profile/${userId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load profile"
        );
      }

      const currentUser = data.user;

      setProfile({
        fullName: currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        currency:
          currentUser.currency || "INR",
      });

      setNotifications({
        transaction:
          currentUser.notifications
            ?.transaction ?? true,

        budget:
          currentUser.notifications?.budget ??
          true,

        goal:
          currentUser.notifications?.goal ??
          false,

        email:
          currentUser.notifications?.email ??
          true,
      });
    } catch (error) {
      console.error("Profile loading error:", error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     PROFILE INPUT
  ========================= */

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     PASSWORD INPUT
  ========================= */

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     SAVE PROFILE
  ========================= */

  const handleSaveProfile = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/profile/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            currency: profile.currency,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update profile"
        );
      }

      const updatedUser = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        currency: data.user.currency,
        notifications:
          data.user.notifications,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     CHANGE PASSWORD
  ========================= */

  const handleChangePassword = async () => {
    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      alert("Please fill all password fields.");
      return;
    }

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/password/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(passwords),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update password"
        );
      }

      alert(
        "Password updated successfully!"
      );

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     NOTIFICATION TOGGLE
  ========================= */

  const toggleNotification = async (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updated);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/notifications/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            notifications: updated,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save notification settings"
        );
      }

      const storedUser = JSON.parse(
        localStorage.getItem("user")
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...storedUser,
          notifications: updated,
        })
      );
    } catch (error) {
      console.error(
        "Notification error:",
        error
      );

      setNotifications((previous) => ({
        ...previous,
        [key]: !updated[key],
      }));

      alert(error.message);
    }
  };

  /* =========================
     DELETE ACCOUNT
  ========================= */

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation =
      window.confirm(
        "This will permanently delete your FinTrack account. Continue?"
      );

    if (!secondConfirmation) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/api/auth/account/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete account"
        );
      }

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      alert("Account deleted successfully.");

      navigate("/login");
    } catch (error) {
      console.error(
        "Delete account error:",
        error
      );

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  /* =========================
     MENU
  ========================= */

  const menuItems = [
    {
      id: "profile",
      label: "Profile",
      icon: <FaUser />,
    },

    {
      id: "security",
      label: "Security",
      icon: <FaLock />,
    },

    {
      id: "notifications",
      label: "Notifications",
      icon: <FaBell />,
    },

    {
      id: "appearance",
      label: "Appearance",
      icon: <FaMoon />,
    },

    {
      id: "privacy",
      label: "Privacy & Security",
      icon: <FaShieldAlt />,
    },
  ];

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-800"
      }`}
    >
      {/* HEADER */}

      <div
        className={`border-b ${
          darkMode
            ? "border-slate-800 bg-slate-900"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-5">
          <h1 className="text-2xl font-bold">
            Settings
          </h1>

          <p
            className={`mt-1 text-sm ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Manage your FinTrack account and
            preferences
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl gap-6 px-6 py-8">

        {/* SIDEBAR */}

        <aside className="hidden w-64 shrink-0 md:block">
          <div
            className={`rounded-2xl border p-3 shadow-sm ${
              darkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  setActiveSection(item.id)
                }
                className={`mb-1 flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </span>

                <FaChevronRight className="text-xs" />
              </button>
            ))}

            <div
              className={`my-3 border-t ${
                darkMode
                  ? "border-slate-800"
                  : "border-slate-200"
              }`}
            />

            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </aside>

        {/* MOBILE MENU */}

        <div className="absolute left-0 right-0 top-[110px] z-10 block px-6 md:hidden">
          <select
            value={activeSection}
            onChange={(e) =>
              setActiveSection(e.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none"
          >
            {menuItems.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* MAIN */}

        <main className="mt-14 w-full md:mt-0">

          {/* =========================
              PROFILE
          ========================= */}

          {activeSection === "profile" && (
            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold">
                  Profile Information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your personal information
                </p>
              </div>

              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                  {profile.fullName
                    ?.charAt(0)
                    .toUpperCase() || "U"}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {profile.fullName}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Personal Account
                  </p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* NAME */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* PHONE */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleProfileChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* CURRENCY */}

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Currency
                  </label>

                  <select
                    value={profile.currency}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        currency: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="INR">
                      ₹ INR - Indian Rupee
                    </option>

                    <option value="USD">
                      $ USD - US Dollar
                    </option>

                    <option value="EUR">
                      € EUR - Euro
                    </option>

                    <option value="GBP">
                      £ GBP - British Pound
                    </option>
                  </select>
                </div>

              </div>

              <div className="mt-8">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                >
                  <FaSave />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* =========================
              SECURITY
          ========================= */}

          {activeSection === "security" && (
            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold">
                  Security
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Change your account password
                </p>
              </div>

              <div className="max-w-xl space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwords.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={passwords.newPassword}
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter new password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwords.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving
                    ? "Updating..."
                    : "Update Password"}
                </button>

              </div>
            </div>
          )}

          {/* =========================
              NOTIFICATIONS
          ========================= */}

          {activeSection ===
            "notifications" && (
            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose which notifications you
                  want to receive
                </p>
              </div>

              <div className="divide-y divide-slate-100">

                {[
                  {
                    key: "transaction",
                    title:
                      "Transaction Notifications",
                    desc: "Get notified when a transaction is added",
                  },

                  {
                    key: "budget",
                    title: "Budget Alerts",
                    desc: "Receive alerts when you approach your budget limit",
                  },

                  {
                    key: "goal",
                    title: "Goal Updates",
                    desc: "Get updates about your financial goals",
                  },

                  {
                    key: "email",
                    title: "Email Notifications",
                    desc: "Receive important updates through email",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-5"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {item.desc}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        toggleNotification(
                          item.key
                        )
                      }
                      className={`relative h-6 w-11 rounded-full transition ${
                        notifications[item.key]
                          ? "bg-blue-600"
                          : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                          notifications[item.key]
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* =========================
              APPEARANCE
          ========================= */}

          {activeSection === "appearance" && (
            <div
              className={`rounded-2xl border p-6 shadow-sm ${
                darkMode
                  ? "border-slate-800 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold">
                  Appearance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Customize how FinTrack looks
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">

                <button
                  onClick={() =>
                    setDarkMode(false)
                  }
                  className={`rounded-2xl border p-6 text-left ${
                    !darkMode
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <FaSun className="mb-4 text-2xl text-orange-500" />

                  <h3 className="font-semibold">
                    Light Mode
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Use the default light appearance
                  </p>
                </button>

                <button
                  onClick={() =>
                    setDarkMode(true)
                  }
                  className={`rounded-2xl border p-6 text-left ${
                    darkMode
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-200"
                  }`}
                >
                  <FaMoon className="mb-4 text-2xl text-slate-700" />

                  <h3 className="font-semibold">
                    Dark Mode
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Use a darker appearance
                  </p>
                </button>

              </div>

              <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                Your theme preference is saved
                automatically.
              </div>
            </div>
          )}

          {/* =========================
              PRIVACY
          ========================= */}

          {activeSection === "privacy" && (
            <div className="space-y-6">

              <div
                className={`rounded-2xl border p-6 shadow-sm ${
                  darkMode
                    ? "border-slate-800 bg-slate-900"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="mb-6 flex items-start gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      Privacy & Security
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Manage your account data
                    </p>
                  </div>

                </div>

                <div className="space-y-4">

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <h3 className="font-semibold">
                        Data Protection
                      </h3>

                      <p className="text-sm text-slate-500">
                        Your account data is stored
                        in MongoDB.
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                    <div>
                      <h3 className="font-semibold">
                        Password Protection
                      </h3>

                      <p className="text-sm text-slate-500">
                        Passwords are stored using
                        bcrypt hashing.
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Active
                    </span>
                  </div>

                </div>
              </div>

              {/* DANGER ZONE */}

              <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold text-red-600">
                  Danger Zone
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Deleting your account is permanent.
                </p>

                <div className="mt-6 flex flex-col justify-between gap-4 rounded-xl bg-red-50 p-4 md:flex-row md:items-center">

                  <div>
                    <h3 className="font-semibold text-red-700">
                      Delete Account
                    </h3>

                    <p className="text-sm text-red-600">
                      Permanently delete your
                      FinTrack account.
                    </p>
                  </div>

                  <button
                    onClick={
                      handleDeleteAccount
                    }
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <FaTrash />

                    {saving
                      ? "Deleting..."
                      : "Delete Account"}
                  </button>

                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Settings;