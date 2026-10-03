import { Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/login";
import Register from "../pages/Register";

import Dashboard from "../pages/dashboard/Dashboard";
import Transactions from "../pages/dashboard/Transactions";
import Budgets from "../pages/dashboard/Budgets";
import Goals from "../pages/dashboard/Goals";
import Analytics from "../pages/dashboard/Analytics";
import Settings from "../pages/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/transactions"
        element={<Transactions />}
      />

      <Route
        path="/budgets"
        element={<Budgets />}
      />

      <Route
        path="/goals"
        element={<Goals />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/settings"
        element={<Settings />}
      />
    </Routes>
  );
};

export default AppRoutes;